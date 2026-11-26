// Pre-builds the vector tiles the Bikeable Radius map draws its bike network from (posts/nyc_directed_network.html).
//
// usage: node scripts/build_nyc_network_tiles.mjs [--no-merge] [input] [outDir]
//   --no-merge  keep every street segment as its own line (draws exactly like the old in-page source; ~7x more lines)
//   input   defaults to src/data/nyc_directed_network.bin.gz (run scripts/pack_nyc_directed_network.mjs first if the
//           network changed)
//   outDir  defaults to src/tiles/nyc_network  (written as {z}/{x}/{y}.pbf; the old contents are replaced)
//
// The page used to hand MapLibre the whole network as one GeoJSON source, which MapLibre stringified on the main thread,
// re-parsed in its worker and tiled there with geojson-vt, all before drawing anything and all kept in memory. These are
// the same tiles, made ahead of time with the same geojson-vt version and the same options MapLibre derives from the
// page's old source settings (maxzoom 15, tolerance 0.5, buffer 32), so the browser only fetches and parses what's in view.
//
// One deliberate difference: connected segments of the same bike class are merged into longer lines before tiling. The
// network is ~180k separate street segments, and every separate line gets two round end caps when drawn; merging turns
// most of those caps into joins, which draws the same shape with far fewer vertices. Visible side effect: at city-wide
// zooms, where each segment is only a few pixels long, the old overlapping caps doubled up their anti-aliased edges and
// made lines look bolder than their set widths; merged lines draw at their true width, so the overview looks lighter.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import geojsonvt from 'geojson-vt';
import vtpbf from 'vt-pbf';

const require = createRequire(import.meta.url);
const { decodeNycNetwork } = require('../src/js/nyc_network_format.js');

const args = process.argv.slice(2), MERGE = !args.includes('--no-merge');
const [input = 'src/data/nyc_directed_network.bin.gz', outDir = 'src/tiles/nyc_network'] = args.filter(a => a !== '--no-merge');
export const LAYER = 'net';           //source-layer name the page's net-* layers use
const MAXZOOM = 15, TILE_SIZE = 512, EXTENT = 8192, SCALE = EXTENT / TILE_SIZE;
const OPTIONS = { maxZoom: MAXZOOM, tolerance: 0.5 * SCALE, buffer: 32 * SCALE, extent: EXTENT, lineMetrics: false, generateId: false };

const D = decodeNycNetwork(new Uint8Array(gunzipSync(readFileSync(input))));
const N = D.nf.length, { coff: COFF, xy: XY } = D;

// ---- merge connected same-class segments into longer lines ----
// at every node, pair up the segment ends of each class, straightest continuation first, then walk the pairs into chains
function mergeClass(segs) {
  const partner = new Map();   //end id (2*seg + side) -> paired end id; side 0 = from-node end (first point), 1 = to-node end
  const byNode = new Map();
  const dirAway = (i, side) => {   //unit vector from the node into the segment
    const s = COFF[i], e = COFF[i + 1];
    const [x0, y0, x1, y1] = side === 0 ? [XY[s], XY[s + 1], XY[s + 2], XY[s + 3]] : [XY[e - 2], XY[e - 1], XY[e - 4], XY[e - 3]];
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
    return [dx / L, dy / L];
  };
  for (const i of segs) for (const side of [0, 1]) {
    const node = side === 0 ? D.nf[i] : D.nt[i];
    if (!byNode.has(node)) byNode.set(node, []);
    byNode.get(node).push({ id: 2 * i + side, d: dirAway(i, side) });
  }
  for (const ends of byNode.values()) {
    while (ends.length >= 2) {
      let best = Infinity, ba = 0, bb = 1;
      for (let a = 0; a < ends.length; a++) for (let b = a + 1; b < ends.length; b++) {
        if (ends[a].id >> 1 === ends[b].id >> 1) continue;   //don't join a segment to itself
        const dot = ends[a].d[0] * ends[b].d[0] + ends[a].d[1] * ends[b].d[1];   //-1 = straight through
        if (dot < best) { best = dot; ba = a; bb = b; }
      }
      if (best === Infinity) break;
      partner.set(ends[ba].id, ends[bb].id); partner.set(ends[bb].id, ends[ba].id);
      ends.splice(bb, 1); ends.splice(ba, 1);
    }
  }
  const used = new Set(), lines = [];
  const walk = startEnd => {   //enter segment startEnd>>1 at side startEnd&1 and follow the pairing
    const line = [];
    let end = startEnd;
    while (end !== undefined && !used.has(end >> 1)) {
      const i = end >> 1, s = COFF[i], e = COFF[i + 1];
      used.add(i);
      const pts = [];
      if ((end & 1) === 0) for (let k = s; k < e; k += 2) pts.push([XY[k], XY[k + 1]]);
      else for (let k = e - 2; k >= s; k -= 2) pts.push([XY[k], XY[k + 1]]);
      const last = line[line.length - 1];
      if (last && last[0] === pts[0][0] && last[1] === pts[0][1]) pts.shift();   //shared node: don't repeat the point
      line.push(...pts);
      end = partner.get(end ^ 1);   //leave through the other end into whatever it's paired with
    }
    return line;
  };
  for (const i of segs) for (const side of [0, 1]) if (!used.has(i) && !partner.has(2 * i + side)) lines.push(walk(2 * i + side));
  for (const i of segs) if (!used.has(i)) lines.push(walk(2 * i));   //what's left is closed loops
  return lines;
}

const bySub = D.subs.map(() => []);
for (let i = 0; i < N; i++) if (COFF[i + 1] - COFF[i] >= 4) bySub[D.sub[i]].push(i);   //same "drawable" rule the page used
let nLines = 0;
const features = [];
bySub.forEach((segs, k) => {
  if (!segs.length) return;
  const lines = MERGE ? mergeClass(segs) : segs.map(i => { const p = []; for (let k = COFF[i]; k < COFF[i + 1]; k += 2) p.push([XY[k], XY[k + 1]]); return p; });
  nLines += lines.length;
  features.push({ type: 'Feature', properties: { k }, geometry: { type: 'MultiLineString', coordinates: lines } });
});

// ---- tile, the same way MapLibre's GeoJSON source does internally ----
const index = geojsonvt({ type: 'FeatureCollection', features }, OPTIONS);
rmSync(outDir, { recursive: true, force: true });
let nTiles = 0, bytes = 0;
const visit = (z, x, y) => {
  const tile = index.getTile(z, x, y);
  if (!tile) return;   //no streets anywhere in this tile (or below it)
  //a tile can exist with nothing left to draw: at low zooms, short lines are simplified away. its children can still
  //have streets, so keep descending; just don't write an empty file (a missing tile draws as empty)
  if (tile.features.length) {
    const buf = vtpbf.fromGeojsonVt({ [LAYER]: tile }, { version: 2, extent: EXTENT });
    const path = join(outDir, String(z), String(x), `${y}.pbf`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, buf);
    nTiles++; bytes += buf.length;
  }
  if (z < MAXZOOM) for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) visit(z + 1, 2 * x + dx, 2 * y + dy);
};
visit(0, 0, 0);
console.log(`${N} segments -> ${nLines} merged lines; wrote ${nTiles} tiles (${(bytes / 1e6).toFixed(1)} MB) to ${outDir}`);

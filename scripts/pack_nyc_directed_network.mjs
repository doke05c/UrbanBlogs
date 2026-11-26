// Packs the NYC directed bike network into src/data/nyc_directed_network.bin.gz (format: src/js/nyc_network_format.js).
//
// usage: node scripts/pack_nyc_directed_network.mjs <input> [output]
//   <input>  either a JSON file holding the network object, or an HTML file containing a `const D = {...};` line
//            (the format the network generator used to inline into posts/nyc_directed_network.html)
//   [output] defaults to src/data/nyc_directed_network.bin.gz
//
// After writing, the output is decoded with the same decoder the page uses and every value is compared against the input
// with Object.is, so a successful run guarantees the page sees exactly the data it used to.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';

const require = createRequire(import.meta.url);
const { decodeNycNetwork, gunzipIfNeeded, MAGIC, VERSION } = require('../src/js/nyc_network_format.js');

const [input, output = 'src/data/nyc_directed_network.bin.gz'] = process.argv.slice(2);
if (!input) { console.error('usage: node scripts/pack_nyc_directed_network.mjs <input.json|input.html> [output]'); process.exit(1); }

function readNetwork(path) {
  const text = readFileSync(path, 'utf8');
  if (/\.json$/i.test(path)) return JSON.parse(text);
  const line = text.split('\n').find(l => l.trimStart().startsWith('const D = {'));
  if (!line) throw new Error(`no "const D = {...}" line in ${path}`);
  return JSON.parse(line.slice(line.indexOf('{'), line.lastIndexOf('}') + 1));
}

const COLUMNS = ['nf', 'nt', 'wf', 'wr', 'name', 'sub', 'coords'];
const D = readNetwork(input);
const n = D.nf.length;
const meta = Object.fromEntries(Object.entries(D).filter(([k]) => !COLUMNS.includes(k)));
for (const k of COLUMNS) if (!Array.isArray(D[k]) || D[k].length !== n) throw new Error(`column ${k} missing or not ${n} long`);

// ---- encode ----
const out = [];
const uv = v => {
  if (!Number.isSafeInteger(v) || v < 0 || v >= 2 ** 31) throw new Error(`varint out of range: ${v}`);
  while (v >= 128) { out.push((v % 128) | 128); v = Math.floor(v / 128); }
  out.push(v);
};
const sv = v => uv(v < 0 ? -2 * v - 1 : 2 * v);
const tenths = (w, i) => {
  if (w === null) return 0;
  const k = Math.round(w * 10);
  if (k / 10 !== w || k < 0) throw new Error(`weight ${w} (segment ${i}) is not a non-negative one-decimal number`);
  return k + 1;
};
const fixed5 = x => {
  const k = Math.round(x * 1e5);
  if (k / 1e5 !== x) throw new Error(`coordinate ${x} has more than 5 decimals`);
  return k;
};

D.nf.forEach((v, i) => sv(v - (i ? D.nf[i - 1] : 0)));
D.nt.forEach((v, i) => sv(v - D.nf[i]));
D.wf.forEach((w, i) => uv(tenths(w, i)));
D.wr.forEach((w, i) => uv(tenths(w, i)));
D.name.forEach(v => uv(v));
D.sub.forEach(v => uv(v));
D.coords.forEach((c, i) => { if (c.length % 2) throw new Error(`segment ${i} has an odd coordinate count`); uv(c.length / 2); });
let sx = 0, sy = 0;
for (const c of D.coords) {
  let px = sx, py = sy;
  for (let k = 0; k < c.length; k += 2) {
    const x = fixed5(c[k]), y = fixed5(c[k + 1]);
    sv(x - px); sv(y - py); px = x; py = y;
    if (k === 0) { sx = x; sy = y; }
  }
}

const metaBytes = Buffer.from(JSON.stringify(meta), 'utf8');
const header = Buffer.alloc(13);
Buffer.from(MAGIC).copy(header, 0); header[4] = VERSION;
header.writeUInt32LE(n, 5); header.writeUInt32LE(metaBytes.length, 9);
const raw = Buffer.concat([header, metaBytes, Buffer.from(out)]);
const gz = gzipSync(raw, { level: 9 });
writeFileSync(output, gz);

// ---- verify: decode exactly like the browser does and compare every value ----
const dec = decodeNycNetwork(await gunzipIfNeeded(new Uint8Array(gz)));
const fail = msg => { console.error('VERIFY FAILED:', msg); process.exit(1); };
if (JSON.stringify(Object.fromEntries(Object.keys(meta).map(k => [k, dec[k]]))) !== JSON.stringify(meta)) fail('metadata differs');
for (const k of Object.keys(meta)) (function walk(a, b, path) {
  if (Array.isArray(a)) a.forEach((x, j) => walk(x, b[j], `${path}[${j}]`));
  else if (!Object.is(a, b)) fail(`${path}: ${a} !== ${b}`);
})(meta[k], dec[k], k);
for (let i = 0; i < n; i++) {
  if (dec.nf[i] !== D.nf[i] || dec.nt[i] !== D.nt[i]) fail(`node ids differ at ${i}`);
  if (!Object.is(dec.wf[i], D.wf[i] === null ? Infinity : D.wf[i])) fail(`wf differs at ${i}`);
  if (!Object.is(dec.wr[i], D.wr[i] === null ? Infinity : D.wr[i])) fail(`wr differs at ${i}`);
  if (dec.name[i] !== D.name[i] || dec.sub[i] !== D.sub[i]) fail(`name/sub differs at ${i}`);
  const c = D.coords[i], s = dec.coff[i];
  if (dec.coff[i + 1] - s !== c.length) fail(`point count differs at ${i}`);
  for (let k = 0; k < c.length; k++) if (!Object.is(dec.xy[s + k], c[k])) fail(`coordinate differs at segment ${i}, value ${k}`);
}
console.log(`packed ${n} segments, ${dec.xy.length / 2} points: ${raw.length} bytes raw, ${gz.length} bytes gzipped -> ${output}`);
console.log('verified: every value decodes bit-identical to the input');

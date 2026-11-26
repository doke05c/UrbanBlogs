// Binary format for the NYC directed bike network (UrbanBlogs posts/nyc_directed_network.html).
//
// The network used to be inlined in the page as a ~14 MB JS object literal (`const D = {...}`). Parsing that literal and
// materializing ~180k little arrays cost several seconds of main-thread time and hundreds of MB of memory on phones.
// This file is the compact replacement: one gzipped binary that decodes straight into typed arrays.
//
// Source of truth: Bike_Network_Expander/web_export/network_format.js. web_export copies it next to network.bin.gz in
// UrbanBlogs/src/bike_network/, so the decoder and the data it reads always come from the same run.
// network.bin.gz is written by web_export/pack.py, which round-trips every value through a Python copy of this decoder.
// Changing the layout means changing both, and bumping VERSION.
//
// Layout (little-endian), after gunzip:
//   "NYCN"  u8 version (=1)  u32 nSeg  u32 metaLen  meta JSON (utf-8: multipliers, subs, sub_colors, sub_widths, names, legend)
//   then one LEB128 varint stream, column by column, nSeg entries each:
//     nf      zigzag(nf[i] - nf[i-1])
//     nt      zigzag(nt[i] - nf[i])
//     wf, wr  weight * 10 + 1 (weights have one decimal), 0 = null (can't travel that way)
//     name    index into meta.names
//     sub     bike class index into meta.subs
//     npts    number of [lon, lat] points in the segment
//   then coordinates as round(deg * 1e5) (the source has 5 decimals), zigzag-delta encoded: each point relative to the
//   previous point of the same segment, and each segment's first point relative to the previous segment's first point.
//
// Decoded values are bit-identical to the export: k / 10 and k / 1e5 are the same doubles as the one- and five-decimal
// values route_test.py writes (pack.py checks this for every value).
//
// Decodes to: { ...meta, nf, nt: Int32Array, wf, wr: Float64Array (Infinity = null), name: Uint16Array, sub: Uint8Array,
//               coff: Uint32Array(nSeg + 1) (segment i owns xy[coff[i] .. coff[i+1])), xy: Float64Array (lon,lat,lon,lat,...) }
(function (root) {
  'use strict';

  const MAGIC = [0x4e, 0x59, 0x43, 0x4e];   // "NYCN"
  const VERSION = 1;

  function decodeNycNetwork(bytes) {
    for (let j = 0; j < 4; j++) if (bytes[j] !== MAGIC[j]) throw new Error('network data: bad magic');
    if (bytes[4] !== VERSION) throw new Error('network data: unsupported version ' + bytes[4]);
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const n = dv.getUint32(5, true), metaLen = dv.getUint32(9, true);
    const meta = JSON.parse(new TextDecoder().decode(bytes.subarray(13, 13 + metaLen)));
    let p = 13 + metaLen;

    //unsigned LEB128. values stay < 2^31 so plain ints are fine, but use * instead of << to be safe past 28 bits
    const uv = () => { let v = 0, m = 1, b; do { b = bytes[p++]; v += (b & 127) * m; m *= 128; } while (b & 128); return v; };
    const sv = () => { const u = uv(); return u & 1 ? -(u + 1) / 2 : u / 2; };

    const nf = new Int32Array(n), nt = new Int32Array(n);
    const wf = new Float64Array(n), wr = new Float64Array(n);
    const name = new Uint16Array(n), sub = new Uint8Array(n), coff = new Uint32Array(n + 1);
    let prev = 0;
    for (let i = 0; i < n; i++) nf[i] = prev = prev + sv();
    for (let i = 0; i < n; i++) nt[i] = nf[i] + sv();
    for (let i = 0; i < n; i++) { const w = uv(); wf[i] = w === 0 ? Infinity : (w - 1) / 10; }
    for (let i = 0; i < n; i++) { const w = uv(); wr[i] = w === 0 ? Infinity : (w - 1) / 10; }
    for (let i = 0; i < n; i++) name[i] = uv();
    for (let i = 0; i < n; i++) sub[i] = uv();
    for (let i = 0; i < n; i++) coff[i + 1] = coff[i] + 2 * uv();

    const xy = new Float64Array(coff[n]);
    let sx = 0, sy = 0;   //first point of the previous segment, in 1e-5 degree units
    for (let i = 0; i < n; i++) {
      let x = sx, y = sy;
      for (let k = coff[i]; k < coff[i + 1]; k += 2) {
        x += sv(); y += sv();
        xy[k] = x / 1e5; xy[k + 1] = y / 1e5;
        if (k === coff[i]) { sx = x; sy = y; }
      }
    }
    if (p !== bytes.length) throw new Error('network data: ' + (bytes.length - p) + ' trailing bytes');
    return Object.assign(meta, { nf, nt, wf, wr, name, sub, coff, xy });
  }

  //the file is stored gzipped. if the host already decoded it (it sent Content-Encoding: gzip) use the bytes as they are
  async function gunzipIfNeeded(bytes) {
    if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return bytes;
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function loadNycNetwork(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('network data: HTTP ' + res.status);
    return decodeNycNetwork(await gunzipIfNeeded(new Uint8Array(await res.arrayBuffer())));
  }

  const api = { decodeNycNetwork, gunzipIfNeeded, loadNycNetwork, MAGIC, VERSION };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof self !== 'undefined' ? self : this);

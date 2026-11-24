// Structural verifier for the BikeLab Di2/AXS Diagnostic decision tree.
// Checks the source tree (src/tree.json, three languages) and the live snapshot (live/, as served on 2026-11-23).
// It says nothing about whether a procedure is right: that is checked against the manufacturers'
// documentation and recorded in docs/verification.md.
// Usage: node tools/check_tree.mjs   (Node.js 18+, no dependencies). Exit code 0 = all passed.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
let passed = 0, failed = 0;
const check = (ok, msg) => { if (ok) passed++; else { failed++; console.log('FAIL', msg); } };
const isText = v => v && typeof v === 'object' && !Array.isArray(v) && typeof v.en === 'string';

function grabTree(src) {
  const i = src.indexOf('const TREE = {');
  let j = src.indexOf('{', i), d = 0, k = j, q = null;
  for (; k < src.length; k++) {
    const c = src[k];
    if (q) { if (c === '\\') { k++; continue; } if (c === q) q = null; continue; }
    if (c === '/' && src[k + 1] === '/') { k = src.indexOf('\n', k); continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === '{') d++; else if (c === '}') { d--; if (d === 0) break; }
  }
  return vm.runInNewContext('(' + src.slice(j, k + 1) + ')');
}

function checkTree(T, label, langs) {
  const ids = Object.keys(T);
  const qs = ids.filter(id => T[id].opts), rs = ids.filter(id => !T[id].opts);
  check(!!T.q0, `${label}: start node q0 exists`);
  for (const id of qs) {
    const o = T[id].opts;
    check(o.length >= 2, `${label}: ${id} has at least 2 options`);
    check(new Set(o.map(x => x.key)).size === o.length, `${label}: ${id} option keys unique`);
    for (const x of o) check(!!T[x.next], `${label}: ${id}/${x.key} -> ${x.next} exists`);
  }
  const seen = new Set(), onPath = new Set(); let cycle = false;
  (function dfs(id) {
    if (onPath.has(id)) { cycle = true; return; }
    if (seen.has(id) || !T[id]) return;
    seen.add(id); onPath.add(id);
    for (const x of T[id].opts || []) dfs(x.next);
    onPath.delete(id);
  })('q0');
  check(!cycle, `${label}: no cycles`);
  check(ids.every(id => seen.has(id)), `${label}: every node reachable from q0`);
  for (const id of rs) {
    check(['solved', 'limit', 'workshop'].includes(T[id].type), `${label}: ${id} has a known result type`);
    // 'workshop' diagnoses send the rider to a shop and may list no home steps (the page skips the list when empty)
    check(Array.isArray(T[id].steps) && (T[id].type === 'workshop' || T[id].steps.length > 0), `${label}: ${id} has steps unless it is a workshop result`);
    check(isText(T[id].desc), `${label}: ${id} has a description`);
  }
  const texts = [];
  (function walk(v, path) {
    if (isText(v)) { texts.push([path, v]); return; }
    if (Array.isArray(v)) v.forEach((x, n) => walk(x, path + '[' + n + ']'));
    else if (v && typeof v === 'object') for (const [k2, x] of Object.entries(v)) walk(x, path + '.' + k2);
  })(T, 'TREE');
  for (const [p, v] of texts) check(langs.every(l => typeof v[l] === 'string' && v[l].trim() !== ''), `${label}: ${p} has text in ${langs.join('/')}`);
  const nopts = qs.reduce((a, id) => a + T[id].opts.length, 0);
  console.log(`${label}: ${qs.length} questions, ${nopts} answers, ${rs.length} diagnoses, ${texts.length} text fields`);
  return JSON.stringify(ids.sort().map(id => [id, T[id].type || null, (T[id].opts || []).map(x => x.key + '>' + x.next)]));
}

// 1) live snapshot: files match the manifest, same tree in the three pages
const manifest = JSON.parse(read('live/manifest.json'));
const shapes = [];
for (const [file, meta] of Object.entries(manifest.files)) {
  const src = read(file);
  check(createHash('sha256').update(src).digest('hex') === meta.sha256, `${file}: SHA-256 matches manifest`);
  shapes.push(checkTree(grabTree(src), file, ['en', 'es']));
}
check(shapes.every(x => x === shapes[0]), 'live: the three pages have the same tree shape');

// 2) source: one tree, three languages; UI strings complete in the three languages
const tree = JSON.parse(read('src/tree.json'));
checkTree(tree, 'src/tree.json', ['en', 'es', 'pt']);
const ui = JSON.parse(read('src/ui.json'));
for (const l of ['es', 'pt']) {
  for (const k of Object.keys(ui.en)) check(k in ui[l], `src/ui.json: ${l} has key ${k}`);
  for (const k of Object.keys(ui.en.static)) check(typeof ui[l].static[k] === 'string' && ui[l].static[k] !== '', `src/ui.json: ${l} static ${k}`);
}

console.log(`${passed}/${passed + failed} checks passed`);
process.exit(failed ? 1 : 0);

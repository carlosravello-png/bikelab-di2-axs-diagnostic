// Structural verifier for the BikeLab Di2/AXS Diagnostic decision tree.
// Reads the tree straight out of the live scripts in live/ (it does not copy it) and checks
// that every path ends in a diagnosis. It says nothing about whether the procedures are right:
// that is checked against the manufacturers' documentation, not by code.
// Usage: node tools/check_tree.mjs   (Node.js 18+, no dependencies). Exit code 0 = all passed.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('live/manifest.json', root), 'utf8'));
let passed = 0, failed = 0;
const check = (ok, msg) => { if (ok) passed++; else { failed++; console.log('FAIL', msg); } };

function grabTree(src) {
  const i = src.indexOf('const TREE = {');
  if (i < 0) throw new Error('TREE not found');
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
const isText = v => v && typeof v === 'object' && !Array.isArray(v) && typeof v.en === 'string';

const shapes = {};
for (const [file, meta] of Object.entries(manifest.files)) {
  const src = readFileSync(new URL(file, root), 'utf8');
  check(createHash('sha256').update(src).digest('hex') === meta.sha256, `${file}: SHA-256 matches manifest`);
  const T = grabTree(src);
  const ids = Object.keys(T);
  const qs = ids.filter(id => T[id].opts), rs = ids.filter(id => !T[id].opts);
  check(!!T.q0, `${file}: start node q0 exists`);
  // every option points to an existing node; keys unique; at least two options
  for (const id of qs) {
    const o = T[id].opts;
    check(o.length >= 2, `${file}: ${id} has at least 2 options`);
    check(new Set(o.map(x => x.key)).size === o.length, `${file}: ${id} option keys unique`);
    for (const x of o) check(!!T[x.next], `${file}: ${id}/${x.key} -> ${x.next} exists`);
  }
  // reachability and no cycles (depth-first from q0)
  const seen = new Set(), onPath = new Set(); let cycle = false;
  (function dfs(id) {
    if (onPath.has(id)) { cycle = true; return; }
    if (seen.has(id) || !T[id]) return;
    seen.add(id); onPath.add(id);
    for (const x of T[id].opts || []) dfs(x.next);
    onPath.delete(id);
  })('q0');
  check(!cycle, `${file}: no cycles`);
  check(ids.every(id => seen.has(id)), `${file}: every node reachable from q0`);
  // diagnoses: known type, at least one step, text in both language slots
  for (const id of rs) {
    check(['solved', 'limit', 'workshop'].includes(T[id].type), `${file}: ${id} has a known result type`);
    // 'workshop' diagnoses send the rider to a shop and may list no home steps (the page skips the list when empty)
    check(Array.isArray(T[id].steps) && (T[id].type === 'workshop' || T[id].steps.length > 0), `${file}: ${id} has steps unless it is a workshop result`);
    check(isText(T[id].desc), `${file}: ${id} has a description`);
  }
  const texts = [];
  (function walk(v, path) {
    if (isText(v)) { texts.push([path, v]); return; }
    if (Array.isArray(v)) v.forEach((x, n) => walk(x, path + '[' + n + ']'));
    else if (v && typeof v === 'object') for (const [k2, x] of Object.entries(v)) walk(x, path + '.' + k2);
  })(T, 'TREE');
  for (const [p, v] of texts) check(v.en.trim() !== '' && typeof v.es === 'string' && v.es.trim() !== '', `${file}: ${p} has text in both slots`);
  shapes[file] = JSON.stringify(ids.sort().map(id => [id, T[id].type || null, (T[id].opts || []).map(x => x.key + '>' + x.next)]));
  const nopts = qs.reduce((a, id) => a + T[id].opts.length, 0);
  console.log(`${file}: ${qs.length} questions, ${nopts} answers, ${rs.length} diagnoses, ${texts.length} text fields`);
}
const s = Object.values(shapes);
check(s.every(x => x === s[0]), 'the three languages have the same tree shape');
console.log(`${passed}/${passed + failed} checks passed`);
process.exit(failed ? 1 : 0);

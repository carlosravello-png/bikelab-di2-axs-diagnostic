// One-off generator (commit 2): builds src/tree.json and src/ui.json from the three live scripts in live/,
// so the tool has a single source with three languages. It changes no text: run it and compare with
// `node tools/check_unify.mjs`. Kept in the repository so this step can be reproduced.
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const F = { en: readFileSync('live/di2_en.js', 'utf8'), es: readFileSync('live/di2_es.js', 'utf8'), pt: readFileSync('live/di2_pt.js', 'utf8') };
function grab(src, name) {
  const i = src.indexOf('const ' + name + ' = {');
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
// TREE: en slot from the English page, es slot from the Spanish page, pt from the 'es' slot of the Portuguese page
const T = { en: grab(F.en, 'TREE'), es: grab(F.es, 'TREE'), pt: grab(F.pt, 'TREE') };
function merge(a, b, c) {
  if (isText(a)) { const o = { en: a.en, es: b.es, pt: c.es }; return o; }
  if (Array.isArray(a)) return a.map((x, n) => merge(x, b[n], c[n]));
  if (a && typeof a === 'object') { const o = {}; for (const k of Object.keys(a)) o[k] = merge(a[k], b[k], c[k]); return o; }
  return a;
}
const tree = merge(T.en, T.es, T.pt);

// UI strings
const U = { en: grab(F.en, 'T').en, es: grab(F.es, 'T').es, pt: grab(F.pt, 'T').es };
// one quoted JS string: '...' with \' escapes
const S = "'((?:[^'\\\\]|\\\\.)*)'";
const unq = s => s.replace(/\\'/g, "'");
function ternary(src, pattern) {
  const m = src.match(new RegExp(pattern + "\\s*s\\s*\\?\\s*" + S + "\\s*:\\s*" + S));
  if (!m) throw new Error('not found: ' + pattern);
  return [unq(m[1]), unq(m[2])];
}
function langTernary(src, pattern) {
  const m = src.match(new RegExp(pattern + "\\s*LANG==='es'\\s*\\?\\s*" + S + "\\s*:\\s*" + S));
  if (!m) throw new Error('not found: ' + pattern);
  return [unq(m[1]), unq(m[2])];
}
const ids = { 'h-label': 'textContent', 'h-title': 'innerHTML', 'h-sub': 'textContent', 'h-badge3': 'textContent', 'f-note': 'textContent', 'f-home': 'textContent', 'sag-card-title': 'textContent', 'sag-card-desc': 'textContent', 'sag-link': 'textContent' };
const ui = { en: { ...U.en, static: {} }, es: { ...U.es, static: {} }, pt: { ...U.pt, static: {} } };
for (const [id, prop] of Object.entries(ids)) {
  const pat = "getElementById\\('" + id + "'\\)\\." + prop + "\\s*=";
  const [esv, env] = ternary(F.es, pat); const [ptv] = ternary(F.pt, pat);
  ui.en.static[id] = env; ui.es.static[id] = esv; ui.pt.static[id] = ptv;
}
const labels = { solved: "solved:\\s*\\{\\s*cls:'green',\\s*label:", limit: "limit:\\s*\\{\\s*cls:'orange',\\s*label:", workshop: "workshop:\\s*\\{\\s*cls:'red',\\s*label:",
  prevention_label: "prev\\.innerHTML = '<strong>' \\+ \\(", warranty_label: "w\\.innerHTML = '<strong>' \\+ \\(", warranty_text: "'</strong>' \\+ \\(" };
for (const [key, pat] of Object.entries(labels)) {
  const [esv, env] = langTernary(F.es, pat); const [ptv] = langTernary(F.pt, pat);
  ui.en[key] = env; ui.es[key] = esv; ui.pt[key] = ptv;
}
// WhatsApp prefixes (the live Portuguese page sends the Spanish text; kept as is in this step)
const wa1 = langTernary(F.es, "encodeURIComponent\\(");
ui.en.wa_peru = wa1[1]; ui.es.wa_peru = wa1[0]; ui.pt.wa_peru = langTernary(F.pt, "encodeURIComponent\\(")[0];
const m2 = [...F.es.matchAll(new RegExp("encodeURIComponent\\(LANG==='es' \\? " + S + " : " + S, 'g'))];
const m2pt = [...F.pt.matchAll(new RegExp("encodeURIComponent\\(LANG==='es' \\? " + S + " : " + S, 'g'))];
ui.en.wa_button = unq(m2[1][2]); ui.es.wa_button = unq(m2[1][1]); ui.pt.wa_button = unq(m2pt[1][1]);

writeFileSync('src/tree.json', JSON.stringify(tree, null, 2) + '\n');
writeFileSync('src/ui.json', JSON.stringify(ui, null, 2) + '\n');
console.log('src/tree.json nodes:', Object.keys(tree).length, '· src/ui.json keys:', Object.keys(ui.en).length);

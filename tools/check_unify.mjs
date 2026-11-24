// Checks that dist/di2_tool.js renders exactly what the live scripts in live/ rendered, node by node,
// in each of the three languages. Uses a minimal DOM stub (no dependencies). Meaningful for the
// unification commit only: later commits change texts on purpose.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function makeEl(tag) {
  const el = { tag, className: '', textContent: '', _html: null, style: {}, children: [], href: '', target: '', rel: '', onclick: null,
    appendChild(c) { this.children.push(c); return c; } };
  Object.defineProperty(el, 'innerHTML', { get() { return el._html; }, set(v) { el._html = v; if (v === '') el.children = []; } });
  return el;
}
function makeDoc(lang) {
  const ids = {};
  const doc = { documentElement: { lang }, addEventListener() {},
    getElementById(id) { return ids[id] || (ids[id] = makeEl('#' + id)); },
    createElement: makeEl };
  return { doc, ids };
}
const ser = el => ({ t: el.tag, c: el.className, x: el.textContent, h: el._html, href: el.href, w: el.style.width, d: el.style.display, k: el.children.map(ser) });

function run(code, lang) {
  const { doc, ids } = makeDoc(lang);
  const ctx = vm.createContext({ document: doc, location: { search: '' }, URLSearchParams, encodeURIComponent, console });
  vm.runInContext(code, ctx);
  const tree = vm.runInContext('TREE', ctx);
  const shots = {};
  shots['#static'] = Object.fromEntries(Object.entries(ids).filter(([id]) => id !== 'tool-container' && id !== 'prog-fill').sort(([a], [b]) => a < b ? -1 : 1).map(([id, el]) => [id, ser(el)]));
  for (const id of Object.keys(tree)) {
    vm.runInContext(`history = ['q0']; render(${JSON.stringify(id)});`, ctx);
    shots[id] = { box: ser(ids['tool-container']), bar: ids['prog-fill'].style.width };
  }
  return shots;
}
const dist = readFileSync('dist/di2_tool.js', 'utf8');
let bad = 0, n = 0;
for (const [file, lang] of [['live/di2_en.js', 'en'], ['live/di2_es.js', 'es'], ['live/di2_pt.js', 'pt-BR']]) {
  const a = run(readFileSync(file, 'utf8'), lang), b = run(dist, lang);
  for (const k of Object.keys(a)) {
    n++;
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) { bad++; console.log('DIFF', lang, k, JSON.stringify(a[k]).slice(0, 200), '\n   vs', JSON.stringify(b[k]).slice(0, 200)); }
  }
}
console.log(`${n - bad}/${n} rendered screens identical to live`);
process.exit(bad ? 1 : 0);

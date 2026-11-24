// Renders every node of dist/di2_tool.js in English, Spanish and Portuguese with a minimal DOM stub
// (no dependencies) and checks what the reader sees: no "undefined"/empty text, every diagnosis shows
// its sources, the service buttons match the brand, the WhatsApp link carries the diagnosis title,
// and the answers lead where the tree says. Usage: node tools/check_render.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

let passed = 0, failed = 0;
const check = (ok, msg) => { if (ok) passed++; else { failed++; console.log('FAIL', msg); } };
function makeEl(tag) {
  const el = { tag, className: '', textContent: '', _html: null, style: {}, children: [], href: '', target: '', rel: '', onclick: null,
    appendChild(c) { this.children.push(c); return c; } };
  Object.defineProperty(el, 'innerHTML', { get() { return el._html; }, set(v) { el._html = v; if (v === '') el.children = []; } });
  return el;
}
function all(el, out = []) { out.push(el); for (const c of el.children) all(c, out); return out; }
const visible = el => all(el).map(e => (e.textContent || '') + ' ' + (e._html || '')).join(' ');

const dist = readFileSync('dist/di2_tool.js', 'utf8');
const tree = JSON.parse(readFileSync('src/tree.json', 'utf8'));
for (const lang of ['en', 'es', 'pt-BR']) {
  const L = lang.slice(0, 2);
  const ids = {};
  const doc = { documentElement: { lang }, addEventListener() {}, getElementById: id => ids[id] || (ids[id] = makeEl('#' + id)),
    createElement: makeEl, createTextNode: t => ({ ...makeEl('#text'), textContent: t }) };
  const ctx = vm.createContext({ document: doc, location: { search: '' }, URLSearchParams, encodeURIComponent, console });
  vm.runInContext(dist, ctx);
  check(vm.runInContext('LANG', ctx) === L, `${lang}: language detected from <html lang>`);
  for (const id of ['h-label', 'h-sub', 'f-note', 'sag-card-title']) check(ids[id] && ids[id].textContent.trim() !== '', `${lang}: static ${id} filled`);
  for (const [id, node] of Object.entries(tree)) {
    vm.runInContext(`history = ['q0']; render(${JSON.stringify(id)});`, ctx);
    const box = ids['tool-container'];
    const text = visible(box);
    check(!/undefined|null|\[object/.test(text), `${lang} ${id}: no undefined/null text`);
    const els = all(box);
    if (node.opts) {
      const opts = els.filter(e => e.className.startsWith('opt '));
      check(opts.length === node.opts.length, `${lang} ${id}: renders ${node.opts.length} options`);
      opts.forEach((b, i) => {
        b.onclick();
        check(vm.runInContext('current', ctx) === node.opts[i].next, `${lang} ${id}/${node.opts[i].key}: leads to ${node.opts[i].next}`);
        vm.runInContext(`history = ['q0']; render(${JSON.stringify(id)});`, ctx);
      });
    } else {
      const src = els.find(e => e.className === 'result-note result-sources');
      check(!!src && src.children.filter(c => c.tag === 'a').length === node.sources.length, `${lang} ${id}: shows its ${node.sources.length} source link(s)`);
      const svc = els.filter(e => e.className === 'btn-service').map(e => e.href);
      const want = (node.type === 'workshop' || node.type === 'limit')
        ? (node.brand === 'shimano' ? ['https://si.shimano.com'] : node.brand === 'sram' ? ['https://www.sram.com/en/service'] : ['https://si.shimano.com', 'https://www.sram.com/en/service'])
        : [];
      check(JSON.stringify(svc) === JSON.stringify(want), `${lang} ${id}: service buttons ${JSON.stringify(want)}`);
      const wa = els.find(e => e.className === 'btn-wa');
      check(!!wa && decodeURIComponent(wa.href).includes(node.title[L]), `${lang} ${id}: WhatsApp text carries the diagnosis title`);
      check(els.filter(e => e.className === 'result-note community').length === (node.basis === 'community' ? 1 : 0), `${lang} ${id}: community note only when basis is community`);
      check(text.includes(node.title[L]), `${lang} ${id}: title in ${L}`);
    }
  }
}
console.log(`${passed}/${passed + failed} render checks passed`);
process.exit(failed ? 1 : 0);

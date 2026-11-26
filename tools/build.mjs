// Builds dist/di2_tool.js: the script the three bikelabstudio.com pages carry inline.
// TREE and UI come from src/*.json, the engine from src/app.js. Usage: node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('..', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const tree = JSON.parse(read('src/tree.json'));
const ui = JSON.parse(read('src/ui.json'));
const pkg = JSON.parse(read('package.json'));
const out = '\n// BikeLab Di2/AXS Diagnostic ' + pkg.version + ' · https://github.com/carlosravello-png/bikelab-di2-axs-diagnostic · PolyForm Noncommercial 1.0.0\n'
  + 'const TREE = ' + JSON.stringify(tree) + ';\n'
  + 'const UI = ' + JSON.stringify(ui) + ';\n'
  + read('src/app.js');
mkdirSync(new URL('dist/', root), { recursive: true });
writeFileSync(new URL('dist/di2_tool.js', root), out);
console.log('dist/di2_tool.js', Buffer.byteLength(out), 'bytes · sha256', createHash('sha256').update(out).digest('hex'));

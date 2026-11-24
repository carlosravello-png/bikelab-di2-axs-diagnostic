# BikeLab Di2/AXS Diagnostic

Designed and maintained by **Carlos Eduardo Ravello Joo** · ORCID [0009-0007-5631-7436](https://orcid.org/0009-0007-5631-7436) · BikeLab Studio, Trujillo, Peru

[![verify](https://github.com/carlosravello-png/bikelab-di2-axs-diagnostic/actions/workflows/verify.yml/badge.svg)](https://github.com/carlosravello-png/bikelab-di2-axs-diagnostic/actions/workflows/verify.yml)
[![license](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc/4.0/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24488780.svg)](https://doi.org/10.5281/zenodo.24488780)
[![Software Heritage](https://archive.softwareheritage.org/badge/origin/https://github.com/carlosravello-png/bikelab-di2-axs-diagnostic/)](https://archive.softwareheritage.org/swh:1:rev:a03d26a135f44207eef042a6d89de44ca1e01fb8)
[![demo](https://img.shields.io/badge/demo-GitHub%20Pages-4fb8c8)](https://carlosravello-png.github.io/bikelab-di2-axs-diagnostic/)

A decision tree for troubleshooting electronic shifting on Shimano Di2 12-speed road, Shimano Di2 11-speed with junction A, and SRAM eTap AXS road and XPLR: 7 questions, 30 answers and 22 diagnoses. Each diagnosis says whether it can be solved at home, links the Shimano or SRAM document it comes from, and sends other systems to their own manuals. It runs in the browser.

**Live:** [ES](https://www.bikelabstudio.com/articles/di2-axs-diagnostic-es.html) · [EN](https://www.bikelabstudio.com/articles/di2-axs-diagnostic.html) · [PT](https://www.bikelabstudio.com/articles/di2-axs-diagnostic-pt.html)

**Demo of this repository's engine:** https://carlosravello-png.github.io/bikelab-di2-axs-diagnostic/ (`?lang=en`, `es` or `pt`)

## Status

Version 3.0.0 is the audited version. The first commit of this repository is the tool as it was served on 2026-11-23 (`live/`, byte for byte, SHA-256 in `live/manifest.json`). The audit found procedures that contradicted the manufacturers' manuals, some of which could put the system in another mode; they are listed in [`docs/verification.md`](docs/verification.md) together with every claim of 3.0.0 and the page of the document it was checked against.

What 3.0.0 changes:

- Shimano Di2 12-speed and 11-speed are separate branches: their buttons, LEDs and procedures differ, and mixing them caused most of the errors.
- Every diagnosis cites its source, and the page shows it. A diagnosis without a source fails the build.
- Steps with no manufacturer source were removed (listed in `docs/verification.md`).
- Interface: the service button matches the brand, the WhatsApp message carries the diagnosis, the Portuguese page has its own text slot and Portuguese messages, and the footer no longer claims more than the tool does.

## Verify

```
node tools/check_tree.mjs     # Node.js 18+, no dependencies
node tools/build.mjs          # rebuilds dist/di2_tool.js from src/
node tools/check_render.mjs   # renders every screen in EN/ES/PT
```

It reads the tree out of the three scripts in `live/` and out of `src/tree.json`, and checks that the files match the manifest, that every answer leads to an existing node, that every node is reachable, that there are no loops, that every diagnosis has a known type and a description, that every text exists in both language slots, and that the three languages have the same tree. It prints `N/N checks passed` and exits with code 0.

They do **not** check whether a procedure is correct. That was checked against the manufacturers' documentation and is recorded in `docs/verification.md`; the code only makes sure every diagnosis carries its source.

| File | What it is |
|---|---|
| `live/di2_en.js`, `live/di2_es.js`, `live/di2_pt.js` | The tool as served on 2026-11-23, copied byte for byte. |
| `live/manifest.json` | Source page, size and SHA-256 of each copy. |
| `src/tree.json` | The decision tree, one file, with English, Spanish and Portuguese text. |
| `src/ui.json` | Interface strings in the three languages. |
| `src/app.js` | The engine that renders the tree. |
| `tools/build.mjs` | Builds `dist/di2_tool.js`, the script the three pages carry inline. |
| `dist/di2_tool.js` | Built script. |
| `index.html` | Minimal demo page that runs `dist/di2_tool.js` (GitHub Pages). |
| `tools/unify_from_live.mjs`, `tools/check_unify.mjs` | How `src/` was made from `live/`, and the proof that nothing changed: the built script renders the same 72 screens (23 nodes and the header, in three languages) as the live scripts. |
| `tools/check_tree.mjs` | Structural verifier for `live/` and `src/`: links, reachability, loops, three languages, and a source on every diagnosis. |
| `tools/check_render.mjs` | Renders every node of `dist/di2_tool.js` in the three languages and checks what the reader sees: options lead where the tree says, sources shown, service buttons by brand, no empty or `undefined` text. |
| `docs/verification.md` | Every claim, its source and page, and the errors found in the live version. |

## Honest notes

- In `live/di2_pt.js` the Portuguese text sits in the `es` slot of the tree; the live page read that slot. In `src/` each language has its own slot.
- `tools/check_unify.mjs` only proves the unification commit; it cannot pass on 3.0.0, whose texts changed on purpose.
- Only the generations in `docs/verification.md` were checked. Shimano MTB Di2 12-speed, GRX Di2 12-speed and SRAM Eagle AXS/Transmission are not covered.
- The deposits made on Zenodo on 13 June 2026 (one of them labelled 2.0) carry CC BY-NC-ND 4.0, and that license stays with them. This repository is CC BY-NC 4.0: derivatives are allowed for non-commercial use, with attribution.
- Not checked: whether the June 2026 Zenodo archive is byte-identical to `live/`.
- The text of the bikelabstudio.com pages stays under the site's own license.
- Not affiliated with Shimano or SRAM. Di2 and AXS are trademarks of their owners. This is a diagnostic aid, not a replacement for the manufacturer's dealer manual or warranty service.

## License and citation

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Metadata in `CITATION.cff`.

Cite the version you used. Version 3.0.0:

Ravello Joo, C. E. (2026). *BikeLab Di2/AXS Diagnostic* (Version 3.0.0) [Software]. Zenodo. https://doi.org/10.5281/zenodo.24488781

All versions from 3.0.0: DOI [10.5281/zenodo.24488780](https://doi.org/10.5281/zenodo.24488780). Code archived in Software Heritage: [swh:1:rev:a03d26a135f44207eef042a6d89de44ca1e01fb8](https://archive.softwareheritage.org/swh:1:rev:a03d26a135f44207eef042a6d89de44ca1e01fb8).

Earlier deposits (13 June 2026, CC BY-NC-ND 4.0): Ravello Joo, C. E. (2026). *BikeLab Di2/AXS Diagnostic: Decision-Tree Tool for Electronic Shifting Troubleshooting* (Version 2.0). Zenodo. https://doi.org/10.5281/zenodo.20676928 · all June 2026 versions: DOI [10.5281/zenodo.20673193](https://doi.org/10.5281/zenodo.20673193).

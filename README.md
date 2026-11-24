# BikeLab Di2/AXS Diagnostic

Designed and maintained by **Carlos Eduardo Ravello Joo** · ORCID [0009-0007-5631-7436](https://orcid.org/0009-0007-5631-7436) · BikeLab Studio, Trujillo, Peru

[![verify](https://github.com/carlosravello-png/bikelab-di2-axs-diagnostic/actions/workflows/verify.yml/badge.svg)](https://github.com/carlosravello-png/bikelab-di2-axs-diagnostic/actions/workflows/verify.yml)
[![license](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc/4.0/)

A decision tree for troubleshooting Shimano Di2 and SRAM AXS electronic shifting: 8 questions, 26 answers and 15 diagnoses, each one either fixable at home or a job for a workshop. It runs in the browser.

**Live:** [ES](https://www.bikelabstudio.com/articles/di2-axs-diagnostic-es.html) · [EN](https://www.bikelabstudio.com/articles/di2-axs-diagnostic.html) · [PT](https://www.bikelabstudio.com/articles/di2-axs-diagnostic-pt.html)

## Status

The first commit of this repository is the tool exactly as it was served on 2026-11-23: the inline script of each page, byte for byte, with its SHA-256 in `live/manifest.json`.

An audit is in progress. Every procedure (battery models, reset sequences, button and LED behaviour, charging times) is being checked against Shimano and SRAM documentation. Each correction lands as its own commit, so the history of this repository is also its errata. The first audited release will be archived on Zenodo as a new version.

## Verify

```
node tools/check_tree.mjs     # Node.js 18+, no dependencies
```

It reads the tree out of the three scripts in `live/` and checks that the files match the manifest, that every answer leads to an existing node, that every node is reachable, that there are no loops, that every diagnosis has a known type and a description, that every text exists in both language slots, and that the three languages have the same tree. It prints `N/N checks passed` and exits with code 0.

It does **not** check whether a procedure is correct. That is checked against the manufacturers' documentation, not by code.

| File | What it is |
|---|---|
| `live/di2_en.js`, `live/di2_es.js`, `live/di2_pt.js` | The tool as served on 2026-11-23, copied byte for byte. |
| `live/manifest.json` | Source page, size and SHA-256 of each copy. |
| `tools/check_tree.mjs` | Structural verifier. Runs on every push (GitHub Actions). |

## Honest notes

- In `live/di2_pt.js` the Portuguese text sits in the `es` slot of the tree. It works because the Portuguese page reads that slot. It will be renamed.
- The deposits made on Zenodo on 13 June 2026 (one of them labelled 2.0) carry CC BY-NC-ND 4.0, and that license stays with them. This repository is CC BY-NC 4.0: derivatives are allowed for non-commercial use, with attribution.
- Not checked: whether the June 2026 Zenodo archive is byte-identical to `live/`.
- The text of the bikelabstudio.com pages stays under the site's own license.
- Not affiliated with Shimano or SRAM. Di2 and AXS are trademarks of their owners. This is a diagnostic aid, not a replacement for the manufacturer's dealer manual or warranty service.

## License and citation

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Metadata in `CITATION.cff`.

Until the first audited release, cite the existing record: Ravello Joo, C. E. (2026). *BikeLab Di2/AXS Diagnostic: Decision-Tree Tool for Electronic Shifting Troubleshooting* (Version 2.0). Zenodo. https://doi.org/10.5281/zenodo.20676928

All versions: DOI [10.5281/zenodo.20673193](https://doi.org/10.5281/zenodo.20673193).

# Verification record — BikeLab Di2/AXS Diagnostic 3.0.0

Every procedure in `src/tree.json` was checked against the manufacturer's own documents on 2026-11-23/24.
Each diagnosis in the tool links the documents listed here, and the build fails if a diagnosis has no source
(`tools/check_tree.mjs`).

## Documents read

| Key | Document | How it was read |
|---|---|---|
| D12 | Shimano DM-RARD010-08 (ENG), Dealer's Manual, Rear Derailleur (Di2) RD-R9250 / RD-R8150 / RD-R7150 · [PDF](https://si.shimano.com/en/pdfs/dm/RARD010/DM-RARD010-08-ENG.pdf) · SHA-256 `cde0d52a463c59bf1fbbda0fa471ccf171a002e6e6343648b297bcf23534ec5c` | Full text with `pdftotext`; pp. 13–14 also seen on screen. Page numbers below are the printed folios. |
| D11 | Shimano DM-R8050-07 (ENG), Dealer's Manual, ULTEGRA R8050 series · [PDF](https://si.shimano.com/en/pdfs/dm/R8050/DM-R8050-07-ENG.pdf) · SHA-256 `feea4a2a521bbc85e26ad51b4319c220c2c1a886faf5cf8741ea01e8791fd7eb` | Full text with `pdftotext`; printed folios. |
| UMJ | Shimano UM-71J0B-000 (ENG), User's Manual, Junction [A] EW-RS910, © Feb. 2021 · [PDF](https://si.shimano.com/en/pdfs/um/71J0B/UM-71J0B.pdf) · SHA-256 `f055c3eece3c401aa10794605661531c33c5dcce3c98cc182a8785d5aa0d0930` | Full text with `pdftotext` (layout and raw). The German and French editions on si.shimano.com give the same press times. |
| EC300, DN300, LEVER | Shimano product pages: [EW-EC300](https://bike.shimano.com/en-NA/products/components/pdp.P-EW-EC300.html), [BT-DN300](https://bike.shimano.com/en-NA/products/components/pdp.P-BT-DN300.html), [ST-R9270-L](https://bike.shimano.com/products/components/pdp.P-ST-R9270-L.html) | Web, 2026-11-23. |
| AXSUM | SRAM, [Road AXS and XPLR AXS User Manual](https://docs.sram.com/s/RoadAXSandXPLRAXSUserManual.html) | Web page text, read in two parts (it is longer than one read), 2026-11-23. |
| AXSTS | SRAM, [AXS digital troubleshooting](https://www.sram.com/en/learn/axs-digital-troubleshooting) | Web, 2026-11-24. |
| SRAM support | [Waking AXS](https://support.sram.com/hc/en-us/articles/6030792022171) · [Batteries when flying](https://support.sram.com/hc/en-us/articles/29407870212379) · [Chain drop](https://support.sram.com/hc/en-us/articles/6495179996699) · [Force AXS chains](https://support.sram.com/hc/en-us/articles/36351047209627) | Web, 2026-11-23. |
| SRAM guides | [Chain drop troubleshooting](https://sram.com/en/sram/road/campaigns/troubleshooting-etap-axs-chain-drop) · [Road AXS tech tips](https://www.sram.com/de/learn/road-axs-welcome-guide/tech-tips-and-tuning) · [RED XPLR AXS tech tips](https://sram.com/en/learn/red-xplr-axs-welcome-guide/tech-tips-and-tuning) · [Rival eTap AXS guide](https://www.sram.com/de/learn/rival-etap-axs-welcome-guide/be-ride-ready) | Web, 2026-11-23 (the `/de/` pages are in English). |

## Claims and where they come from

### Shimano Di2 12-speed road (D12 unless stated)

| Claim in the tool | Source | Status |
|---|---|---|
| Single click on the function button = battery check: solid green 51–100 %, flashing green 26–50 %, solid red 1–25 %, off 0 % | D12 p. 13 | Verified |
| Press and hold 0.5–2 s = Bluetooth LE (flashing blue); 2–5 s = adjustment mode (solid yellow); 5–8 s = wired pairing | D12 pp. 13–14 | Verified |
| Double click cycles shift mode: solid blue 2 s = manual; blue ×2 = shift mode 1; blue ×3 = shift mode 2 | D12 pp. 13–14 | Verified |
| Battery BT-DN300 can sit inside the seatpost or the frame | DN300 page | Verified |
| Charging with EW-EC300 at the rear derailleur | EC300 page | Verified |
| Charging LED: solid blue charging, off complete, flashing red error | D12 p. 13 | Verified |
| AC adapter 5.0 V DC, ≥ 1.0 A; stop if not full after 4 h | D12 p. 5 | Verified |
| While charging, shifting and adjustment modes are disabled; connecting E-TUBE PROJECT stops charging | D12 p. 13 | Verified |
| LED does not light when charging: reconnect the adapter; if it still does not light, contact the distributor. Flashing red while charging: insufficient current or USB hub | D12 p. 51 | Verified |
| RD protection reset: turning the crank, shift to the largest sprocket, then to the smallest | D12 p. 21 | Verified |
| Adjustment: 5th sprocket from the largest; 2–5 s to solid yellow; move toward the largest until the chain touches the 4th sprocket with a subtle noise; 5 steps toward the smallest; exit with ≥ 0.5 s; overrun note | D12 pp. 32–33 | Verified |
| Levers use CR1632, 1.5–2 years, first batteries may last less | LEVER page | Verified |
| Pairing required after reinstalling/replacing a lever or the rear derailleur; ST-R9270/ST-R8170 pair wirelessly only through the app | D12 pp. 9, 15 | Verified |
| Leaving Bluetooth LE connected increases battery consumption | D12 p. 9 | Verified |
| Badly adjusted low/high limits make the battery level drop quickly | D12 p. 34 | Verified |
| Gear position control: a front shift can move the rear two sprockets toward the largest instead; select the correct component combination in E-TUBE PROJECT | D12 p. 22 | Verified |
| Synchronized shift: the front derailleur shifts automatically with the rear; up to two shift modes set in E-TUBE PROJECT | D12 pp. 39–40 | Verified |
| Firmware: keep E-TUBE PROJECT and firmware current; update by smartphone (Cyclist, Bluetooth LE) or PC (Professional + SM-PCE02); contact the place of purchase for updates | D12 pp. 7, 9, 36 | Verified |

### Shimano Di2 11-speed with junction A

| Claim in the tool | Source | Status |
|---|---|---|
| Battery check: hold a shift switch ≥ 0.5 s; 100 % steady green, 50 % flashing green ×5, 25 % steady red, 0 % flashing red ×5; then the shift mode is shown | UMJ | Verified |
| Low battery: front derailleur stops first, then the rear; fully drained, derailleurs stay in the last gear | UMJ | Verified |
| With BT-DN110: 0.5 s Bluetooth LE, 2 s adjustment, 5 s RD protection reset; with SM-BTR2: 0.5 s adjustment, 3 s RD protection reset; exit with ≥ 0.5 s | UMJ (EN, confirmed with DE and FR editions) | Verified |
| RD protection reset: rotate the chainwheel, hold the junction A button ≥ 5 s, red LED flashes about 5 s, press until the red LED turns off; manual recovery via the place of purchase | UMJ | Verified |
| Shift mode LEDs: manual = battery LED steady green + button LED steady red 2 s; synchronized 1 = both ×2; synchronized 2 = both ×3 | UMJ | Verified |
| Charging: SM-BCR2 to junction A; ~1.5 h with an AC adapter, ~3 h from a PC; complete when the orange CHARGE indicator turns off; ERROR/CHARGE blinking → "When charging is not possible" | D11 pp. 161–162 | Verified |
| Supplied USB cable; adapter 5.0 V DC ≥ 1.0 A; no USB hub on a PC | D11 p. 8 | Verified |
| Adjustment: 5th sprocket; hold the button until the red button LED lights; keep holding = RD protection reset; inward until the chain touches the 4th sprocket; 4 steps outward; press until the red LED turns off; error check with E-TUBE PROJECT Professional | D11 pp. 138–140 | Verified |
| Bluetooth LE left connected with EW-WU111 can increase consumption | D11 p. 17 | Verified |
| The battery is a consumable and loses capacity with use | D11 p. 13 | Verified |
| Reinstalled/replaced components are recognized automatically; update firmware with E-TUBE PROJECT; contact the place of purchase for updates | D11 pp. 13, 17 | Verified |

### SRAM eTap AXS road and XPLR

| Claim in the tool | Source | Status |
|---|---|---|
| Derailleur LED: green 15–60 h, red 6–15 h, flashing red < 6 h; shifter LED: green 6–24 months, red 1–6 months, flashing red < 1 month | AXSUM | Verified |
| No light = battery out of charge | AXSTS; RED XPLR tech tips | Verified |
| Pairing: RD green blinks slowly; FD and shifters green blinks quickly; end with a press on the RD; session times out after 30 s; repeat when a component is replaced, added or removed | AXSUM; AXSTS | Verified |
| Shifter LED blinks when a command is sent | AXSUM | Verified |
| MicroAdjust: hold the shifter's AXS button and shift; right = outboard, left = inboard; 0.25 mm | AXSUM | Verified |
| Chain gap set with the SRAM gauge on the upper pulley, B-adjust screw, value from the manual's chart | AXSUM | Verified |
| Shifter battery: fold the hood, coin 90° counter-clockwise, CR2032 with + to the cover, 90° clockwise, o-ring | AXSUM | Verified |
| Reboot: AXS app open, remove battery, hold AXS button, reinstall, release; LED flashes yellow and lights green; Tools → "Recovery Required" → update | AXSTS | Verified |
| Not waking: press the AXS button ≤ 2 s; otherwise charge fully | SRAM support (waking) | Verified |
| Red/green blink = rejected shift to protect the derailleur; on 2x also for locked-out combinations | AXSTS | Verified |
| Chain drop is often a front derailleur set up out of spec; support wedge strongly recommended; free replacement via dealer; low limit for inboard drops | SRAM support (chain drop); chain drop guide; AXSUM; Road AXS tech tips | Verified |
| Road Flattop chains are the compatible chains | SRAM support (Force AXS chains) | Verified |
| AXS sleeps only when the bike is still; remove batteries and fit battery blocks for transport; covers on stored batteries | SRAM support (flying); AXSUM | Verified |
| On a ride, move the 2x front battery to the rear to get home | Rival eTap AXS guide | Verified |

## Errors found in the version served on 2026-11-23 (`live/`)

| Live version said | What the sources say |
|---|---|
| Dead 12-speed system: hold the rear derailleur button 5–10 s to look for an LED | On RD-R9250/R8150/R7150, 5–8 s is wired pairing (D12 p. 13). |
| Synchro Shift: hold the button 0.5–2 s until blue to enter manual mode | 0.5–2 s is Bluetooth LE mode; the shift mode changes with a double click (D12 p. 13). |
| 12-speed charging with a "USB-C seatpost cable", until the LED turns green; red = depleted | EW-EC300 at the rear derailleur; solid blue while charging, off when done; solid red = 1–25 % (EC300 page; D12 p. 13). |
| 12-speed battery "built into the seatpost" | Seatpost or frame (DN300 page). |
| Crash recovery labelled a community procedure, one procedure for both generations | It is in Shimano's manuals, and it differs: 12-speed shifts largest → smallest while pedalling (D12 p. 21); 11-speed holds the junction A button ≥ 5 s (UMJ). |
| "Never update Di2 firmware via Bluetooth"; a failed update "corrupts the EPROM" | Shimano documents updates over Bluetooth LE with E-TUBE PROJECT Cyclist (D12 pp. 9, 36). The EPROM claim had no source and was removed. |
| 12-speed adjustment: back out 4 clicks | 5 steps on 12-speed (D12 p. 33). The 4 steps in the live version are right for 11-speed (D11 p. 140); the live version mixed the two generations. |
| System list included SLX Di2 | Shimano skipped SLX when it brought Di2 to Deore ([Cyclingnews](https://www.cyclingnews.com/news/shimano-brings-di2-shifting-to-its-budget-deore-groupset-for-the-first-time); [Escape Collective](https://escapecollective.com/shimanos-wireless-avalanche-xt-and-deore-di2-follow-xtr), quoting Shimano). The list now names only the generations covered. |
| AXS chain drop: switch to a KMC chain; called a design defect | SRAM attributes chain drop to front derailleur setup and lists road Flattop chains as compatible (SRAM support). |
| AXS micro-adjust from the rear derailleur button | It is done from the shifter's AXS button (AXSUM). |
| AXS B-gap 5–7 mm "using a finger as gauge" | SRAM sets it with its gauge and the manual's chart (AXSUM). |
| "Official SRAM" hard reset: remove battery, wait 15 s, press without battery | SRAM's documented reboot is the one above (AXSTS). |
| AXS transport drain labelled community | SRAM recommends removing the batteries (AXSUM; SRAM support). |
| Community note: "works in most cases" | No data behind it; removed. |
| Footer: "procedures based on official documentation" while several were not | Now each diagnosis links its source. |

## Removed because no manufacturer source was found

- The EW-WU111 "known phantom drain" and the day-by-day component isolation test.
- Loosening the limit screws "1/4 turn".
- Bending the AXS shifter battery contacts.
- Cleaning shifter buttons with compressed air, pressing them 20–30 times, and the TL-EW02 connector check.
- "Turn off Wi-Fi to pair", "the rear derailleur is always the master".
- The Orbit fluid-leak diagnosis (no SRAM document describes the symptom or its service).
- AXS shifter "~$1–2" battery price.

## Not covered

Shimano MTB Di2 12-speed (XTR M9200, XT M8200, Deore M6200), GRX Di2 12-speed, SRAM Eagle AXS and Transmission: their procedures were not checked, so the tool sends those riders to their manuals.

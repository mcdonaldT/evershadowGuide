# Evershadow — The Adventurer’s Field Guide

Open **Start Guide.cmd**, or open **site/index.html** directly in a modern browser. No installation, account, build step, or internet connection is needed.

The website includes:

- An illustrated introduction to Evershadow, with three new landscape illustrations.
- An interactive five-ring city atlas and the existing Central District map.
- Prices, wages, rent, commissions, public service budgets, and arcane banking.
- A loot-sale estimator for materials from the first two floors.
- Floor 1 and Floor 2 routes, creatures, landmarks, and saved preparation checklists.
- Guild registration, badges, ranks, mission categories, and services.
- Eleven public NPC profiles and nine guild, faction, and civic entries.
- Search across the guide (`/` or `Ctrl+K` / `Cmd+K`), mobile navigation, and printable floor guides.

## Present or share

For a table presentation, open the guide and use your browser’s full-screen mode. The sidebar switches chapters; the Dungeon Guide has separate floor tabs. **Print this floor** includes the selected floor’s creature notes even when their accordions are collapsed.

To send the guide to players, use **Evershadow-Player-Guide.zip**. They should extract the entire archive and open `index.html`. Keep its assets and scripts together. Saved checklists belong to the current browser and device; they are not shared with other players.

To put it online, upload **only the contents of `site/`** to a static website host. There are no build settings or server dependencies. Hash links such as `#dungeon/2` work without special routing. The website has not been deployed publicly.

The zip contains only the public website. Editorial notes, source notes, QA artifacts, and development tools are outside the published folder.

## Edit the guide

- `site/data.js`: curated district, NPC, faction, economy, and floor information.
- `site/app.js`: chapter introductions, interface behavior, search, and calculator.
- `site/styles.css`: colors, layout, mobile styles, and print layout.
- `site/assets/`: all local artwork and the icon mark.
- `EDITORIAL_NOTES.md`: source references and how draft inconsistencies were handled. For the campaign owner.
- `ARTWORK.md`: generated asset paths and the complete prompts used.

Content is a curated snapshot of the campaign notes, not a live Obsidian export. Edits to the vault do not automatically update the website. Add only player-facing material to `site/`; everything in that folder can be read by anyone receiving the website.

The calculator treats both fees as deductions from the merchant’s 50% offer, rounding each to the nearest copper. This convention is stated in the interface because the notes do not specify a tax order. Final prices and settlements remain table decisions.

## Optional local development

With Node.js installed, run from this folder:

```powershell
node tools/serve.cjs
```

Then visit `http://127.0.0.1:4173`. The development server serves only `site/` and binds to your own computer. You can choose another port using `EVERSHADOW_PORT`.

Browser verification uses the installed Microsoft Edge in headless mode and Node.js, without downloaded dependencies:

```powershell
node tools/browser-check.cjs
```

Verification output and screenshots are saved in `qa/`. The test server and browser are closed when verification ends.

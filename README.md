# Evershadow — The Adventurer’s Field Guide

A static, illustrated guide with npm commands for development, production builds, preview, and Node hosting. Requires **Node.js 22 or newer** with npm; there are no third-party packages.

From this project folder:

```sh
npm ci
npm run dev
```

Open **http://localhost:4173**. To prepare a deployment:

```sh
npm run build
npm run preview
```

The build creates **`dist/`**, ready for static hosting. Use **`npm run build`** as the host's build command and **`dist`** as its publish directory. For Node hosting, build first and run **`npm start`**; it listens on the host's `PORT` and `0.0.0.0`. See [DEPLOYMENT.md](DEPLOYMENT.md) for command details.

The standalone checkout uses **`src/`** for website files; the original Obsidian copy uses **`site/`**. Tools support both layouts, preferring `src/` when present. References to `site/` below also apply to `src/` in the standalone checkout.

You can still open **src/index.html**, **site/index.html**, or the built **dist/index.html** directly without a server. The original Obsidian copy's **Start Guide.cmd** also works. No account or internet connection is needed.

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

To put it online, run `npm run build` and upload **only the contents of `dist/`** to a static website host. Hash links such as `#dungeon/2` work without special routing, including under a URL subdirectory. Building does not publish the site. The existing ZIP is an earlier snapshot; npm builds do not update it automatically. Zip the contents of `dist/` for a fresh offline export.

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

## Development and checks

With Node.js installed, run from this folder:

```powershell
npm run dev
```

Then visit `http://localhost:4173`. The server serves the source folder and binds to your own computer. Refresh after edits. Choose another port with `npm run dev -- --port 5173`. Run `npm test` to verify builds, HTTP responses, and server startup.

Browser verification uses the installed Microsoft Edge in headless mode and Node.js, without downloaded dependencies:

```powershell
npm run test:browser
```

Verification output and screenshots are saved in `qa/`. The test server and browser are closed when verification ends.

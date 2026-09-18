# npm workflow

Run these commands from the folder containing `package.json`. Node.js 22 or newer is required. The lockfile is committed even though the project needs no external packages, so `npm ci` works on hosting services.

| Command | Purpose |
| --- | --- |
| `npm ci` | Prepare the project from its lockfile |
| `npm run dev` | Serve the source files at http://localhost:4173 |
| `npm run build` | Check JavaScript and create a clean `dist/` |
| `npm run preview` | Serve `dist/` at http://localhost:4173 |
| `npm start` | Serve `dist/` for a Node hosting service |
| `npm test` | Verify source layouts, build boundaries, HTTP responses, and startup |
| `npm run test:browser` | Run the existing headless browser interaction checks |

`npm run dev` serves files directly: refresh the browser after edits. Source files live in `src/` in the standalone checkout or `site/` in the original Obsidian copy. Both layouts are supported. No framework conversion is necessary.

## Static hosting

Configure your hosting service with:

| Setting | Value |
| --- | --- |
| Project root | Directory containing `package.json` |
| Framework preset | None / Other |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output / publish directory | `dist` |

Alternatively, run the build locally and upload the contents of `dist/`. Relative asset URLs and hash navigation also work under subdirectories. No rewrite rules, secrets, or environment variables are needed for the static build.

Only the public source folder is copied. Dotfiles are excluded; linked source files and directories are rejected. The build validates browser JavaScript before replacing an existing `dist/`. Original source files and campaign notes are untouched. Keep private content out of the public source folder.

## Node hosting

Use `npm ci && npm run build` for the build step and **`npm start`** for the start command. Production serves only `dist/` and listens on `0.0.0.0`, allowing the host's proxy to reach it.

- `PORT`: hosting port, default `4173`.
- `EVERSHADOW_PORT`: legacy fallback when `PORT` is absent.
- `HOST`: binding address for development and preview, default `127.0.0.1`.
- `--port 5173` and `--host 0.0.0.0`: explicit options after `--` in an npm command.

Examples:

```sh
npm run dev -- --port 5173
npm run preview -- --port 4180
npm start -- --port 8080
```

Command-line arguments take priority over environment variables. Build before starting or previewing; otherwise the command reports that `dist/` is missing. `npm start` explicitly sets `--host 0.0.0.0`; append a different `--host` to override it.

The server is a small static Node server. TLS and public domain configuration belong to the hosting service or reverse proxy. The npm commands do not create hosting accounts, publish to npm, push Git commits, or deploy to an external service by themselves.

## Offline use

Open `dist/index.html` directly after building. You may zip the contents of `dist/` for players to extract. Build output is independent of Node at runtime on a static host or when opened from disk.

## Browser verification

`npm run test:browser` uses Microsoft Edge's standard Windows executable path by default. Set `EVERSHADOW_BROWSER` to another Chromium executable if necessary. Reports go to `qa/`, outside the published directory.

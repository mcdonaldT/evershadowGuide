'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { findSourceRoot, distRoot } = require('./paths.cjs');
// Keep this export compatible with the existing browser verification script.
const siteRoot = findSourceRoot();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' };
function createServer(root = siteRoot) {
  const publicRoot = fs.realpathSync(root);
  return http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); res.end('Bad request'); return; }
    if (pathname.includes('\0')) { res.writeHead(400); res.end('Bad request'); return; }
    if (pathname.split(/[\\/]/).some(part => part.startsWith('.'))) { res.writeHead(403); res.end('Forbidden'); return; }
    const file = path.resolve(publicRoot, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(publicRoot, file);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(403); res.end('Forbidden'); return; }
    fs.stat(file, (err, stat) => {
      if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
      let realFile;
      try { realFile = fs.realpathSync(file); }
      catch { res.writeHead(404); res.end('Not found'); return; }
      const realRelative = path.relative(publicRoot, realFile);
      if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) { res.writeHead(403); res.end('Forbidden'); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': stat.size, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
      if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
    });
  });
}
function options(args, env = process.env) {
  const config = { root: siteRoot, host: env.HOST || '127.0.0.1', port: Number(env.PORT || env.EVERSHADOW_PORT || 4173) };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dist') config.root = distRoot;
    else if (args[i] === '--port' && args[i + 1]) config.port = Number(args[++i]);
    else if (args[i] === '--host' && args[i + 1]) config.host = args[++i];
    else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
  }
  if (!Number.isInteger(config.port) || config.port < 0 || config.port > 65535) throw new Error('Port must be an integer from 0 to 65535.');
  if (!fs.existsSync(path.join(config.root, 'index.html'))) throw new Error('No production build found. Run npm run build first.');
  return config;
}
module.exports = { createServer, siteRoot, options };
if (require.main === module) {
  try {
    const config = options(process.argv.slice(2));
    const server = createServer(config.root);
    server.on('error', error => { console.error(error.message); process.exitCode = 1; });
    server.listen(config.port, config.host, () => console.log(`Evershadow field guide: http://${config.host === '0.0.0.0' ? 'localhost' : config.host}:${server.address().port}\nServing ${path.basename(config.root)}/. Press Ctrl+C to stop.`));
    const shutdown = () => { server.close(); server.closeIdleConnections(); };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

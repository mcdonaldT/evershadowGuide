'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { build } = require('./build.cjs');
const { createServer, options } = require('./serve.cjs');
const { findSourceRoot, projectRoot, distRoot } = require('./paths.cjs');

function fixture(t, sourceName) {
  const tempRoot = fs.realpathSync(os.tmpdir());
  const root = fs.mkdtempSync(path.join(tempRoot, 'evershadow-build-'));
  t.after(() => {
    // Delete only the exact temporary test directory created above.
    if (path.dirname(root) !== tempRoot || !path.basename(root).startsWith('evershadow-build-')) throw new Error('Unexpected test cleanup path');
    fs.rmSync(root, { recursive: true, force: true });
  });
  const source = path.join(root, sourceName);
  fs.mkdirSync(path.join(source, 'assets'), { recursive: true });
  for (const [name, text] of Object.entries({ 'index.html': '<h1>Player guide</h1>', 'app.js': 'window.guide = true;', 'data.js': 'window.data = {};', 'styles.css': 'body { color: green; }', 'assets/mark.svg': '<svg/>', '.env': 'PRIVATE=1' })) fs.writeFileSync(path.join(source, name), text);
  fs.writeFileSync(path.join(root, 'EDITORIAL_NOTES.md'), 'Private campaign notes');
  fs.mkdirSync(path.join(root, 'dist'));
  fs.writeFileSync(path.join(root, 'dist', 'stale.html'), 'Old build');
  return { root, source };
}

for (const directory of ['src', 'site']) {
  test(`Build ${directory}/ into a clean public dist/`, t => {
    const { root, source } = fixture(t, directory);
    assert.equal(findSourceRoot(root), source);
    const result = build(root);
    assert.equal(result.count, 5);
    for (const file of ['index.html', 'app.js', 'data.js', 'styles.css', 'assets/mark.svg']) assert.deepEqual(fs.readFileSync(path.join(result.output, file)), fs.readFileSync(path.join(source, file)));
    for (const excluded of ['stale.html', 'EDITORIAL_NOTES.md', '.env']) assert.equal(fs.existsSync(path.join(result.output, excluded)), false);
    assert.equal(fs.readFileSync(path.join(root, 'EDITORIAL_NOTES.md'), 'utf8'), 'Private campaign notes');
  });
}
test('Invalid JavaScript fails before replacing the previous build', t => {
  const { root, source } = fixture(t, 'src');
  fs.writeFileSync(path.join(source, 'app.js'), 'function {');
  assert.throws(() => build(root), SyntaxError);
  assert.equal(fs.readFileSync(path.join(root, 'dist', 'stale.html'), 'utf8'), 'Old build');
});
function request(server, route, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: server.address().port, path: route, method }, res => {
      const chunks = []; res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject); req.end();
  });
}
test('Built site serves public assets and rejects paths outside its root', async t => {
  const { output } = build();
  const server = createServer(output);
  t.after(() => new Promise(resolve => server.close(resolve)));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const html = await request(server, '/');
  assert.equal(html.status, 200); assert.match(html.headers['content-type'], /text\/html/); assert.match(html.body, /Evershadow/);
  for (const file of ['/app.js', '/data.js', '/styles.css', '/assets/mark.svg', '/assets/evershadow-city.png', '/assets/central-district.webp', '/assets/verdant-meadow.png', '/assets/whispering-woods.png', '/assets/grinreapers.webp']) {
    const response = await request(server, file, 'HEAD');
    assert.equal(response.status, 200, file); assert.equal(response.body, '');
    assert.ok(Number(response.headers['content-length']) > 0); assert.notEqual(response.headers['content-type'], 'application/octet-stream');
  }
  for (const route of ['/%2e%2e%5cEDITORIAL_NOTES.md', '/.env', '/%2e%2e/tools/serve.cjs', '/package.json']) assert.ok([403, 404].includes((await request(server, route)).status), route);
  assert.equal((await request(server, '/%00')).status, 400);
  assert.equal((await request(server, '/%invalid')).status, 400);
  assert.equal((await request(server, '/missing')).status, 404);
  assert.equal((await request(server, '/', 'POST')).status, 405);
});
test('Hosting PORT and command-line flags configure the server', () => {
  assert.equal(options([], { PORT: '8080' }).port, 8080);
  assert.equal(options([], { EVERSHADOW_PORT: '4174' }).port, 4174);
  assert.equal(options(['--port', '5173'], { PORT: '8080' }).port, 5173);
  assert.equal(options(['--dist'], {}).root, distRoot);
  assert.equal(options(['--host', '0.0.0.0'], {}).host, '0.0.0.0');
  assert.throws(() => options(['--port', '-1'], {}), /Port must/);
  assert.throws(() => options(['--host'], {}), /incomplete/);
});
for (const [name, args] of [['development', []], ['preview', ['--dist']], ['production', ['--dist', '--host', '0.0.0.0']]]) {
  test(`${name} command starts and serves the guide`, { timeout: 10000 }, async t => {
    const child = spawn(process.execPath, [path.join(__dirname, 'serve.cjs'), ...args], { cwd: projectRoot, env: { ...process.env, PORT: '0', HOST: '127.0.0.1' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    t.after(() => new Promise(resolve => { if (child.exitCode !== null) return resolve(); child.once('exit', resolve); child.kill(); }));
    const url = await new Promise((resolve, reject) => {
      let text = '';
      child.once('error', reject); child.once('exit', code => reject(new Error(`Server exited early (${code}): ${text}`)));
      child.stdout.on('data', chunk => { text += chunk; const match = text.match(/http:\/\/[^\s]+/); if (match) resolve(match[0].replace('localhost', '127.0.0.1')); });
      child.stderr.on('data', chunk => { text += chunk; });
    });
    const response = await fetch(url); assert.equal(response.status, 200); assert.match(await response.text(), /Evershadow/);
  });
}

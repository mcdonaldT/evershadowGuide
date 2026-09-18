'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { projectRoot, findSourceRoot } = require('./paths.cjs');

function build(root = projectRoot) {
  const resolvedRoot = fs.realpathSync(root);
  const source = findSourceRoot(resolvedRoot);
  const output = path.resolve(resolvedRoot, 'dist');
  // Only the project's own dist/ may be cleared; do not follow directory links.
  if (path.dirname(output) !== resolvedRoot || path.basename(output) !== 'dist') {
    throw new Error('Build output must be the project’s dist directory.');
  }
  if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) {
    throw new Error('Refusing to replace a linked dist directory.');
  }
  const files = [];
  function visit(directory) {
    if (fs.lstatSync(directory).isSymbolicLink()) throw new Error(`Linked source directories are not supported: ${directory}`);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Linked source files are not supported: ${file}`);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) files.push(file);
    }
  }
  visit(source);
  for (const required of ['index.html', 'app.js', 'data.js', 'styles.css']) {
    if (!files.includes(path.join(source, required))) throw new Error(`Missing website file: ${required}`);
  }
  // Fail before replacing the previous build if a browser script is invalid.
  for (const file of files.filter(file => file.endsWith('.js'))) {
    new vm.Script(fs.readFileSync(file, 'utf8'), { filename: path.relative(source, file) });
  }
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  for (const file of files) {
    const destination = path.join(output, path.relative(source, file));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination);
  }
  return { source, output, count: files.length };
}

module.exports = { build };
if (require.main === module) {
  try {
    const result = build();
    console.log(`Built ${result.count} public files from ${path.basename(result.source)}/ into dist/.\nDeploy dist/ to a static host, or run npm start on a Node host.`);
  } catch (error) { console.error(`Build failed: ${error.message}`); process.exitCode = 1; }
}

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const projectRoot = path.resolve(__dirname, '..');

function findSourceRoot(root = projectRoot) {
  // The standalone checkout uses src/. The original Obsidian copy uses site/.
  for (const directory of ['src', 'site']) {
    const candidate = path.join(root, directory);
    if (fs.existsSync(path.join(candidate, 'index.html'))) return candidate;
  }
  throw new Error('No website source found. Expected src/index.html or site/index.html.');
}

module.exports = { projectRoot, findSourceRoot, distRoot: path.join(projectRoot, 'dist') };

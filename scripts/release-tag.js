// Creates the release tag for git-tag installs (github:ultrafastwork/exceljs#vX.Y.Z).
//
// dist/ is gitignored on the branch, but the `browser` export condition needs
// it. This script builds dist/ for the current package.json version, commits it
// on a detached HEAD on top of the current commit, tags that commit
// (annotated `vX.Y.Z`) and switches back to the branch. The branch never
// contains dist/; only the tag does.
//
// Usage (after the version bump commit): node scripts/release-tag.js
// Then push: git push origin <branch> && git push origin vX.Y.Z

import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, {cwd: root, encoding: 'utf8', stdio: 'pipe', ...opts}).trim();
const git = (...args) => run('git', args);
const log = message => process.stdout.write(`${message}\n`);

const {version} = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const tag = `v${version}`;

if (git('status', '--porcelain')) {
  throw new Error('Working tree is not clean. Commit or stash changes first.');
}
if (git('tag', '--list', tag)) {
  throw new Error(`Tag ${tag} already exists.`);
}
const branch = git('branch', '--show-current');
if (!branch) {
  throw new Error('Not on a branch (detached HEAD).');
}

log(`Building dist/ for ${tag}...`);
fs.rmSync(path.join(root, 'dist'), {recursive: true, force: true});
execFileSync(process.execPath, ['scripts/build.js'], {cwd: root, stdio: 'inherit'});

git('checkout', '--detach');
try {
  git('add', '--force', 'dist');
  git('commit', '-m', `build: add dist for ${tag}`);
  git('tag', '-a', tag, '-m', tag);
  log(`Tagged ${tag} at ${git('rev-parse', '--short', 'HEAD')} (dist/ included).`);
} finally {
  git('checkout', branch);
}
log(`Back on ${branch}. Push with: git push origin ${branch} && git push origin ${tag}`);

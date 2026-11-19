// Creates the release tag for git-tag installs (github:ultrafastwork/exceljs#vX.Y.Z).
//
// dist/ is gitignored on the branch, but the `browser` export condition needs
// it. This script builds dist/ for the current package.json version, commits it
// on a detached HEAD on top of the current commit, tags that commit
// (annotated `vX.Y.Z`) and switches back to the branch. The branch never
// contains dist/; only the tag does.
//
// The tag commit also drops the `prepare` script (husky, a dev-only git hook
// setup). pnpm refuses to install git-hosted packages that have a `prepare`
// script unless the consumer allowlists them, and npm would install all
// devDependencies to run it.
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

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const tag = `v${pkg.version}`;

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
  delete pkg.scripts.prepare;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  git('add', 'package.json');
  git('add', '--force', 'dist');
  git(
    'commit',
    '-m',
    `build: add dist for ${tag}`,
    '-m',
    'Release tag commit: adds the built browser bundles and drops the dev-only prepare script.',
  );
  git('tag', '-a', tag, '-m', tag);
  log(`Tagged ${tag} at ${git('rev-parse', '--short', 'HEAD')} (dist/ included).`);
} finally {
  // The tree was clean before, so --force only discards this script's own edits.
  git('checkout', '--force', branch);
}
log(`Back on ${branch}. Push with: git push origin ${branch} && git push origin ${tag}`);

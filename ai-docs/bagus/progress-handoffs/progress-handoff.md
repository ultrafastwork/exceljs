# progress-handoff (v1.0.0+90) - Active

## Status
- **Status**: Active
- **Current Session**: `v1.0.0+90`
- **Developer**: bagus

## Pending Tasks
- [ ] Release the dependency modernization from session `v1.0.0+89` as **`5.0.0`** (breaking: `engines.node >=24`). Confirm with the user that the uncommitted changes were reviewed and committed, then run `/vbump-and-push major`. Move the `CHANGELOG.md` `[Unreleased]` section under `[5.0.0]`.
- [ ] Close the `dist/` gap for git-tag consumers. `dist/` is gitignored, so `github:ultrafastwork/exceljs#vX.Y.Z` installs have no `browser` bundle and no `dist/es5`, and the jszip CSP patch doesn't reach consumers. **Ask the user** which to use: (a) a release tag commit that includes the built `dist/`, (b) a `prepare` build step, or (c) GitHub Release tarballs from `pnpm pack`.
- [ ] Consider tracking `pnpm-lock.yaml` (currently gitignored) for reproducible installs. **Ask the user first.**
- [ ] Consider deprecating `dist/es5` and the browser polyfills now that Node 24 is the floor (`ai-docs/planned.md` item 3).
- [ ] Long term: replace the unmaintained `grunt-contrib-jasmine` (Puppeteer override in `pnpm-workspace.yaml`) with direct Puppeteer or `jasmine-browser-runner`.

## Recent Accomplishments

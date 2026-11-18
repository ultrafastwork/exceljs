# progress-handoff (v1.0.0+89) - Active

## Status
- **Status**: Active
- **Current Session**: `v1.0.0+89`
- **Developer**: bagus

## Pending Tasks
- [ ] Close the `dist/` gap for git-tag consumers. `dist/` is gitignored, so `github:ultrafastwork/exceljs#vX.Y.Z` installs have no `browser` bundle and no `dist/es5`, and the jszip CSP patch doesn't reach consumers. **Ask the user** which to use: (a) a release tag commit that includes the built `dist/`, (b) a `prepare` build step, or (c) GitHub Release tarballs from `pnpm pack`.
- [ ] Consider tracking `pnpm-lock.yaml` (currently gitignored) for reproducible installs. **Ask the user first.**
- [ ] Long term: replace the unmaintained `grunt-contrib-jasmine` (Puppeteer override in `pnpm-workspace.yaml`) with direct Puppeteer or `jasmine-browser-runner`.
- [ ] Backlog in `ai-docs/planned.md`: pivot table class refactor and metrics, ZIP dependency strategy, Node engine floor.

## Recent Accomplishments

# progress-handoff (v1.0.0+91) - Active

## Status
- **Status**: Active
- **Current Session**: `v1.0.0+91`
- **Developer**: bagus

## Pending Tasks
- [ ] **Close the `dist/` gap before releasing 5.0.0.** The `exports` `browser` condition points to `dist/exceljs.browser.mjs`, so browser bundlers resolving a git-tag install fail until `dist/` ships. **Ask the user**: (a) a release tag commit that includes the built `dist/`, (b) a `prepare` build step (needs devDependencies; esbuild only, so it is much lighter than before), or (c) GitHub Release tarballs from `pnpm pack`.
- [ ] Release as **`5.0.0`** with `/vbump-and-push major` after the user reviews commits `6316ab5` and `29b2809`. Move `CHANGELOG.md` `[Unreleased]` under `[5.0.0]`.
- [ ] Run the suites on **Node 24** (session `v1.0.0+90` only ran Node 26), e.g. `fnm exec --using=24 pnpm test`.
- [ ] Update the ES5/Browserify sections of `README_zh.md` to match `README.md`.
- [ ] Consider tracking `pnpm-lock.yaml` (currently gitignored). **Ask the user first.**
- [ ] Optional cleanups: modernize the manual `test/` scripts (converted to ESM but not run in CI), consider replacing `under-dash` helpers with native code, and convert `makePivotTable` into a class (`ai-docs/planned.md` item 1).

## Recent Accomplishments

# progress-handoff (v1.0.0+91) - Completed

## Status
- **Status**: Completed
- **Current Session**: `v1.0.0+91`
- **Developer**: bagus

## Recent Accomplishments
User decisions this session: commits `6316ab5`/`29b2809` reviewed and approved; `dist/` gap closed with option **(a)** (release tag commit that includes `dist/`); `pnpm-lock.yaml` is now tracked.

- **Verification on Node 24.22.2 and 26.13.0** (Windows): `pnpm install`, lint, `format:check`, and the full `pnpm test` (build, unit 1080 +1 pending, integration 320, end-to-end 1, browser 6+6, TypeScript 25, dist 16) pass on both. No flakes. Note: `fnm exec --using=24 pnpm ...` cannot spawn the `pnpm.CMD` shim, so use `fnm exec --using=24 cmd /c "pnpm test"`.
- **`9838efc` chore: track pnpm-lock.yaml**: removed from `.gitignore`. CI's `pnpm install` now runs with a frozen lockfile.
- **`9e95664` build: ship dist/ in release tags** and **`f4b5336` build: drop prepare script in release tags**: new `scripts/release-tag.js`. After the version bump it builds `dist/`, commits it on a detached HEAD (also removing the `prepare: husky` script from `package.json`), creates the annotated `vX.Y.Z` tag there, and returns to the branch. `master` never contains `dist/`.
  - The `prepare` removal was required. A dry run showed pnpm 11 refuses git-hosted packages with a `prepare` script (`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`) unless the consumer allowlists them. npm only warned and skipped it.
- **`2ed05df` docs: update READMEs for ESM and tagged dist**: `README_zh.md` ES5/Browserify sections replaced with the ESM import and browser bundle docs, plus the fork install note. "Dist Folder" caveat refreshed in both READMEs. README install note now says tags include `dist/`.
- **`7db588f` chore: release v5.0.0**: version 4.5.0 → 5.0.0, CHANGELOG `[Unreleased]` → `[5.0.0] - 2026-11-19`. Tag **`v5.0.0`** → `cac40dc build: add dist for v5.0.0`. `master` and the tag were pushed to `origin`.
- **Consumer verification**: from a local dry-run tag (pnpm 11 + npm) and from the real `github:ultrafastwork/exceljs#v5.0.0` (pnpm), `require('exceljs')`, `import ExcelJS from 'exceljs'` (default + named), and the `browser` condition (`--conditions=browser` → `dist/exceljs.browser.mjs`, which loads and exports `Workbook`) all work. All 11 `dist/` files are installed.
- `ai-docs/planned.md`: the release procedure is recorded under item 4.

## Next Steps
- [ ] GitHub Actions did not run on the push (only old `pull_request` runs are listed, the last from 2026-09-10). Check the `tests.yml` triggers / Actions settings and ask the user whether CI should run on pushes to `master`.
- [ ] Ask the user whether to create a GitHub Release for `v5.0.0` with the CHANGELOG notes (`gh release create v5.0.0`).
- [ ] Help migrate client projects to `github:ultrafastwork/exceljs#v5.0.0` (Node >= 24; deep `exceljs/lib/...` imports are blocked by the `exports` map; `exceljs/dist/es5` is gone).
- [ ] For future releases: bump commit `chore: release vX.Y.Z` → `node scripts/release-tag.js` → `git push origin master` → `git push origin vX.Y.Z`. The `vbump-and-push` skill does not know about the tag script, so run the script in place of its `git tag` step.
- [ ] Optional cleanups: modernize the manual `test/` scripts (converted to ESM but not run in CI), consider replacing `under-dash` helpers with native code, and convert `makePivotTable` into a class (`ai-docs/planned.md` item 1).

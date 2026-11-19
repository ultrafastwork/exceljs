# progress-handoff (v1.0.0+92) - Active

## Status
- **Status**: Active
- **Current Session**: `v1.0.0+92`
- **Developer**: bagus

## Pending Tasks
- [ ] GitHub Actions did not run on the `v5.0.0` push (only old `pull_request` runs are listed, the last from 2026-09-10). Check the `tests.yml` triggers / Actions settings and ask the user whether CI should run on pushes to `master`.
- [ ] Ask the user whether to create a GitHub Release for `v5.0.0` with the CHANGELOG notes (`gh release create v5.0.0`).
- [ ] Help migrate client projects to `github:ultrafastwork/exceljs#v5.0.0` (Node >= 24; deep `exceljs/lib/...` imports are blocked by the `exports` map; `exceljs/dist/es5` is gone).
- [ ] For future releases: bump commit `chore: release vX.Y.Z` → `node scripts/release-tag.js` → `git push origin master` → `git push origin vX.Y.Z`. The `vbump-and-push` skill does not know about the tag script, so run the script in place of its `git tag` step.
- [ ] Optional cleanups: modernize the manual `test/` scripts (converted to ESM but not run in CI), consider replacing `under-dash` helpers with native code, and convert `makePivotTable` into a class (`ai-docs/planned.md` item 1).

## Recent Accomplishments

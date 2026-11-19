# AI Agent Prompt: Post-5.0.0 Follow-up (CI, GitHub Release, Client Migration)

## Objective
Session `v1.0.0+91` released `5.0.0` (tag `v5.0.0`, which includes the built `dist/` via `scripts/release-tag.js`). Make sure CI covers `master`, publish release notes if the user wants them, and support client projects moving to 5.0.0.

## Instructions
1. Read `ai-docs/bagus/progress-handoffs/progress-handoff-v1.0.0+91-complete.md`, `ai-docs/planned.md` and `CHANGELOG.md` `[5.0.0]`.
2. Check `git status`, `git log --oneline -5` and `gh run list --limit 5`.
3. CI: inspect `.github/workflows/tests.yml` and `asset-size.yml` triggers. No run was recorded for the `v5.0.0` push. Report why (triggers vs. disabled Actions) and **ask the user** before changing triggers. If CI is enabled, confirm it passes with the now-tracked `pnpm-lock.yaml` (frozen lockfile).
4. **Ask the user** whether to create a GitHub Release for `v5.0.0` from the CHANGELOG section (`gh release create v5.0.0 --notes-file ...`). Do not create it without approval.
5. If the user names client projects, help migrate them to `github:ultrafastwork/exceljs#v5.0.0`: Node >= 24, no deep `exceljs/lib/...` imports, no `exceljs/dist/es5`. Run their tests.
6. Optional, with user agreement: modernize the manual `test/` scripts, replace `under-dash` helpers with native code, convert `makePivotTable` into a class (`ai-docs/planned.md` item 1). Keep `pnpm lint`, `pnpm format:check` and `pnpm test` green.
7. For any new release, use `chore: release vX.Y.Z`, then `node scripts/release-tag.js`, then push the branch and the tag.
8. Complete the session handoff per `AGENTS.md`.

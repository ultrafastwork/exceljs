# AI Agent Prompt: Release 5.0.0 and Make Git-Tag Installs Complete

## Objective
Session `v1.0.0+89` upgraded every dependency to its latest major (Node floor now `>=24`, ESLint 10 flat config, Babel 8, Mocha 12, Chai 6, TypeScript 7, archiver 8, readable-stream 4, …). Release it as `5.0.0`, then close the `dist/` gap for git-tag consumers (`github:ultrafastwork/exceljs#vX.Y.Z`) without changing the public API.

## Instructions
1. Read `ai-docs/bagus/progress-handoffs/progress-handoff-v1.0.0+89-complete.md`, `ai-docs/planned.md` and `CHANGELOG.md` `[Unreleased]` for context.
2. Check `git status`. If the `v1.0.0+89` modernization is still uncommitted, ask the user to review it, then commit per `AGENTS.md` (summary under 50 characters, e.g. `chore: modernize deps, require Node 24`).
3. Re-verify on Node 24 and 26: `pnpm install`, `pnpm lint`, `pnpm test` (build, unit, integration, end-to-end, Jasmine, TypeScript), `pnpm test:dist`, and the ES5 unit/integration suites (`$env:EXCEL_BUILD = "es5"`).
4. With the user's go-ahead, release `5.0.0` via `/vbump-and-push major`, moving the `[Unreleased]` changelog section under `[5.0.0]`.
5. Close the `dist/` gap: present the options and **wait for a decision**: (a) a release tag commit that force-adds the built `dist/` (e.g. on a `release` branch), (b) a `prepare` build script (heavy: needs devDependencies, Puppeteer, the jszip patch), or (c) GitHub Release tarballs from `pnpm pack`. Verify from a scratch consumer project that `dist/exceljs.min.js` and `exceljs/dist/es5` resolve and that the bundle has no `new Function`.
6. Ask whether `pnpm-lock.yaml` should be tracked (currently gitignored).
7. Complete the session handoff per `AGENTS.md`.

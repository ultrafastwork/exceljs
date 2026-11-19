# AI Agent Prompt: Ship the ESM Modernization as 5.0.0

## Objective
Session `v1.0.0+90` converted ExcelJS to native ESM (Node >= 24), dropped the ES5 build, and replaced Grunt/Babel/Browserify/Jasmine with esbuild and Mocha + Puppeteer (commits `6316ab5`, `29b2809`). Verify it on Node 24, close the `dist/` gap for git-tag consumers, and release `5.0.0`.

## Instructions
1. Read `ai-docs/bagus/progress-handoffs/progress-handoff-v1.0.0+90-complete.md`, `ai-docs/planned.md` and `CHANGELOG.md` `[Unreleased]`.
2. Check `git status` and `git log --oneline -3`. Ask the user to confirm they reviewed `6316ab5` and `29b2809`.
3. Verify on Node 24 and 26: `pnpm install`, `pnpm lint`, `pnpm format:check`, `pnpm test` (build, unit, integration, end-to-end, browser, TypeScript, dist). Report any failures with output. If an integration test flakes, rerun it and note the result.
4. Close the `dist/` gap. The `browser` export condition points to `dist/exceljs.browser.mjs`, which git-tag installs lack. Present the options and **wait for a decision**: (a) a release tag commit that force-adds the built `dist/`, (b) a `prepare` build script (esbuild only), or (c) GitHub Release tarballs from `pnpm pack`. Verify from a scratch consumer project that `require('exceljs')`, `import ExcelJS from 'exceljs'`, and a browser-condition resolution of `exceljs` all work.
5. With the user's go-ahead, release `5.0.0` via `/vbump-and-push major`, moving the `[Unreleased]` changelog section under `[5.0.0]`.
6. Update the ES5/Browserify sections of `README_zh.md` to match `README.md`.
7. Ask whether `pnpm-lock.yaml` should be tracked.
8. Complete the session handoff per `AGENTS.md`.

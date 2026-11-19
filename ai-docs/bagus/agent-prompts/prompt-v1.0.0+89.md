# AI Agent Prompt: Make Git-Tag Installs Complete (dist/ for Consumers)

## Objective
The fork is distributed via git tags (`github:ultrafastwork/exceljs#vX.Y.Z`) with the package name unchanged (`exceljs`). `dist/` is gitignored, so git-tag consumers get no browser bundle (`package.json` `browser` → `dist/exceljs.min.js`) and no `exceljs/dist/es5`. Close this gap without changing the public API.

## Instructions
1. Read `ai-docs/bagus/progress-handoffs/progress-handoff.md` and `ai-docs/planned.md` (Known Environment Caveats) for context.
2. Confirm the gap. In a scratch project, run `pnpm add github:ultrafastwork/exceljs#v4.5.0` and check that `node_modules/exceljs/dist` is missing while `require('exceljs')` works.
3. Present options to the user and **wait for a decision** before implementing:
   - (a) a release tag commit that force-adds the built `dist/` (e.g. on a `release` branch), keeping `master` clean;
   - (b) a `prepare` script that runs `grunt build` on install (heavy: it needs devDependencies, Puppeteer, and the jszip patch);
   - (c) GitHub Release tarballs from `pnpm pack`, installed by URL.
   Note that the jszip CSP patch (`patchedDependencies`) only applies inside this workspace, so built bundles are the only way consumers get the CSP-safe jszip.
4. Implement the chosen option and document the release steps (README install section and `ai-docs/planned.md`). Verify from a scratch consumer project that `dist/exceljs.min.js` and `exceljs/dist/es5` resolve, and that the bundle has no `new Function`.
5. Ask whether `pnpm-lock.yaml` should be tracked (currently gitignored).
6. Run `pnpm lint`, the native + ES5 (`$env:EXCEL_BUILD = "es5"`) unit, integration, and end-to-end suites, dist, `test:typescript`, and `test:jasmine`. On Node 26, if Chrome is missing, see the caveat in `planned.md`.
7. Commit per `AGENTS.md` rules and complete the session handoff.

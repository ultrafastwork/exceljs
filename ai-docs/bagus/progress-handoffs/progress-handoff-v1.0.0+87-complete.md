# progress-handoff (v1.0.0+87) - Completed

## Status
- **Status**: Completed
- **Current Session**: `v1.0.0+87`
- **Developer**: bagus

## Accomplishments
- Released **`v4.5.0`** (user-confirmed bump from `4.4.0`): release commit `chore: release v4.5.0` plus annotated tag `v4.5.0`, pushed to origin.
- Added `CHANGELOG.md` with a "Behavior changes to review before upgrading" section (image anchor scaling #2924, table validation #2767/#2680, CSV number/whitespace handling #1743/#2752, data validation clamping #2977, empty-archive warning #2779) plus Added / Fixed / Security & build sections.
- **Found and fixed a CSP regression (#2672)**: `patches/jszip@3.10.1.patch` was committed but never registered, so a fresh `pnpm build` put `new Function` back into all four `dist/exceljs*.js` bundles and `spec/integration/pr/test-pr-2672.spec.js` failed. Registered the patch under `patchedDependencies` in `pnpm-workspace.yaml`, and removed `pnpm-workspace.yaml` from `.gitignore` (user-approved) so the patch applies on every clone.
- Verified `pnpm pack --dry-run`: 568 files, all from the `files` whitelist (`dist/`, `lib/`, `excel.js`, `index.js`, `index.d.ts`, `LICENSE`, `README.md`, `README_zh.md`, `package.json`).
- Verified after rebuild:
  - native + ES5 (`$env:EXCEL_BUILD = "es5"`): unit 1080 passing (1 pending), integration 320, end-to-end 1, dist 10
  - `test:typescript`: 24 passing; `pnpm lint`: clean
  - browser Jasmine: 4 specs, 0 failures (**Node 24 only**, see below)
- Updated `ai-docs/planned.md`: ticked off the release checklist and added a "Known Environment Caveats" section.

## Findings / Caveats
- **Node 26** (current fnm default `v26.13.0`): `grunt jasmine` fails to load (`require is not defined in ES module scope`, from Puppeteer 19's `yargs`), and Puppeteer's postinstall cannot download Chromium. Workaround: `fnm exec --using=v24.22.2 node node_modules/grunt/bin/grunt jasmine` (Chromium was installed via `node install.js` in the pnpm store puppeteer dir under Node 24).
- `package.json` still uses the name `exceljs` and the upstream `repository` URL, so it can't be published to npm without a scoped rename. Consumers should install from the git tag.
- `patches/jszip+3.10.1.patch` (patch-package format) is a redundant copy and is not used by pnpm.

## Next Steps
- Decide distribution: keep git-tag installs (`github:<owner>/exceljs#v4.5.0`) or rename to a scoped package (e.g. `@<scope>/exceljs`) and update `repository`/`bugs`/`homepage` for npm publishing.
- Fix browser test tooling on Node 26 (upgrade `grunt-contrib-jasmine`/Puppeteer, Jasmine 4.x, `headless: 'new'`).
- Remove the redundant `patches/jszip+3.10.1.patch`.
- Pick up backlog in `ai-docs/planned.md` (pivot table class refactor and metrics, ZIP dependency strategy, Node engine floor).

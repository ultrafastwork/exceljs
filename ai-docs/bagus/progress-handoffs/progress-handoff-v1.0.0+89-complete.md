# progress-handoff (v1.0.0+89) - Completed

## Status
- **Status**: Completed
- **Current Session**: `v1.0.0+89`
- **Developer**: bagus

## Accomplishments
- **Modernized all packages to their latest versions, majors included** (`pnpm outdated` is empty). User decisions: Node floor `>=24`; ESLint flat config + Prettier 3.
  - Runtime: `archiver` 8, `unzipper` 0.12.5, `readable-stream` 4, `saxes` 6, `fast-csv` 5, `jszip` 3.10.2, `dayjs` 1.11.23, `tmp` 0.2.7. `uuid` removed.
  - Dev: Babel 8, Mocha 12, Chai 6, `dirty-chai` 3, `chai-xml` 0.4, `chai-datetime` 1.8, TypeScript 7, `@types/node` 26, Express 5, lint-staged 17, ESLint 10, Prettier 3. `tsx`, `globals`, `@eslint/js`, `eslint-plugin-n` and `@stylistic/eslint-plugin` added. `babelify`, `got`, `ts-node`, `eslint-config-airbnb-base`, `eslint-plugin-node`, `eslint-plugin-import`, `eslint-friendly-formatter`, `prettier-eslint` and `prettier-eslint-cli` removed.
  - `engines.node` is `>=24` and `packageManager` is `pnpm@11.15.0`. The unused npm `overrides.glob` entry was dropped.
- **Code changes needed by the upgrades:**
  - `lib/utils/uuid.js` (new): `crypto.randomUUID()`, falling back to `getRandomValues()` for insecure browser contexts. uuid 14 is ESM-only with no `main`, so browserify can't bundle it.
  - `lib/stream/xlsx/workbook-writer.js`: `new ZipArchive(options)` (archiver 8 has no factory).
  - `lib/utils/stream-buf.js`: own `readable`/`writable` flags. In readable-stream 4 these are state-backed getters that read `false` on StreamBuf, so archiver's `is-stream` v4 check rejected it (38 integration failures).
  - `lib/utils/web-stream.js`: idempotent lock release and keeping the original error. readable-stream 4 `autoDestroy` calls `destroy()` after a failed write.
  - `scripts/babelify.js` (new): a local Babel 8 browserify transform. babelify 10 calls Babel's sync `loadPartialConfig`, which Babel 8 removed. `grunt-babel` works with Babel 8 as-is.
  - `patches/jszip@3.10.2.patch`: regenerated for 3.10.2 (both `dist/jszip.js` and `dist/jszip.min.js` have 0 `new Function`).
  - Specs: Mocha `--require` paths need `.js`; `dirty-chai` is ESM-only (`.default`); the express spec uses native `fetch` + `Readable.fromWeb`; the TS spec adds non-null assertions on `getWorksheet()` because TS 7 defaults to `strict`.
- **Lint/format split (user decision):** Prettier owns all formatting. `.prettier` became a valid `.prettierrc.json` with `endOfLine: auto`. The codebase was reformatted once, and that commit is in `.git-blame-ignore-revs`. Markdown, `**/data/` fixtures and `.github/lock.yml` are ignored. New scripts: `format` / `format:check`, and CI runs `format:check`.
- **ESLint kept for correctness only** (`eslint.config.js`, flat): `@eslint/js` recommended + `eslint-plugin-n` + a few correctness rules (`eqeqeq`, `consistent-return`, `array-callback-return`, `no-var`, `prefer-const`, …). There are no formatting or style rules, and no `eslint-config-prettier`. Removed: `.eslintrc`, `.eslintignore`, `spec/.eslintrc`, `test/.eslintrc`, `spec/.jshintrc`, and 75 stale `eslint-disable` directives. `node/*` directives were renamed to `n/*`.
- lint-staged: Prettier on all staged files, then ESLint (check only) on `.js` files.
- **TypeScript:** `test:typescript` = `tsc -p tsconfig.json` (TS 7, strict, includes `index.d.ts` + spec) + `mocha --node-option import=tsx`. ts-node can't run on TS 7, which has no JS API.
- **CI** (`.github/workflows/tests.yml`): Node 24/26 matrix with pnpm, `actions/*@v5`, and a `pnpm lint` step.
- Docs: `CHANGELOG.md` `[Unreleased]` (breaking: Node >=24), `ai-docs/planned.md` items 3–4.
- Verified on Node 26.13.0:
  - `pnpm lint`: clean
  - `pnpm test` (build, unit 1080 passing / 1 pending, integration 320, end-to-end 1, Jasmine 4 specs / 0 failures, TypeScript 24): exit 0
  - dist: 10
  - ES5 unit 1080, ES5 integration 320
  - `pnpm benchmark`: runs (3 runs OK)

## Findings / Caveats
- `grunt-babel@8` still declares a peer of `@babel/core@^7` (pnpm warns). It works with Babel 8 because it loads Babel through `require(esm)`.
- `grunt-contrib-jasmine` pulls in a deprecated `eslint@8` (via `grunt-eslint`); this is dev-only.
- The integration suite had 1 flaky failure on the first baseline run (before any change) that passed on re-run.
- No pre-upgrade benchmark was captured, so no performance comparison exists.
- Puppeteer's Chrome download succeeded on Node 26 during this install.

## Next Steps
- Release the modernization as **`5.0.0`** (breaking: Node >=24) with `/vbump-and-push major`, after the user reviews the changes. Nothing is committed yet.
- Close the `dist/` gap for git-tag consumers (ask the user: release commit with `dist/`, `prepare` build, or `pnpm pack` tarballs).
- Consider tracking `pnpm-lock.yaml` (ask first).
- Lint follow-ups in `ai-docs/planned.md` item 4. Consider dropping `dist/es5` and the browser polyfills now that Node 24 is the floor.
- Long term: replace `grunt-contrib-jasmine` with direct Puppeteer or `jasmine-browser-runner`.

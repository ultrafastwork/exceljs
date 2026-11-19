# progress-handoff (v1.0.0+90) - Completed

## Status
- **Status**: Completed
- **Current Session**: `v1.0.0+90`
- **Developer**: bagus

## Recent Accomplishments
User request: modernize the codebase for Node.js >= 24. Correctness and performance first, ESM over `require`, drop ES5, modern stack, keep browser use possible.

- **`6316ab5` refactor!: convert to native ESM, drop ES5**
  - `"type": "module"` plus an `exports` map (`.`, `./browser`, `./dist/*`, `./package.json`) and an `imports` map (`#crypto`). All of `lib/`, `spec/`, `test/` and `benchmark.js` were converted from CommonJS with a resolver-aware codemod, then fixed by hand (named exports for `enums`, `drawing-range`, `pivot-table`, `copy-style`, `shared-formula`, `style-fast-serialize`, `uuid`, `web-stream`, `zip-stream`). `spec/utils/verquire.js` is gone: specs import `lib/` directly.
  - **CommonJS compatibility verified** from a scratch consumer: `require('exceljs')`, destructuring, `.default` (TS `esModuleInterop`), `exceljs/dist/*`, and ESM default/named/namespace imports all work on Node 24 with no warnings. `index.d.ts` gained `export * as default from './index.js'` so `import ExcelJS from 'exceljs'` type-checks.
  - Removed: Babel, core-js, regenerator-runtime, Grunt (+ plugins), Browserify, Terser, grunt-contrib-jasmine, `dist/es5`, `index.js`, `excel.js`, `.babelrc`, `.browserslistrc`, `scripts/babelify.js`, the pnpm Puppeteer override. Also removed 6 unused lib modules (`line-buffer`, `auto-drain`, `stream-base64`, `string-builder`, `stuttered-pipe`, `typed-stack`) and dead helpers (`promiseImmediate`, the broken `toIsoDateString`).
  - Build: `scripts/build.js` (esbuild) emits `dist/exceljs(.min).js` (IIFE global `ExcelJS`), `dist/exceljs.browser.mjs` (ESM, chosen by the `browser` export condition), and `exceljs.bare(.min).js` as aliases. Targets Chrome/Edge 111+, Firefox 115+, Safari 16.4+. The minified bundle is ~597 KB, with no `new Function` (CSP).
  - Platform code: lib uses `node:` built-ins (native streams on Node; `readable-stream` is now a devDependency used only as the browser polyfill). `TextDecoder`/`TextEncoder` replace `StringDecoder` and the `process.browser` branches. `DecompressionStream('deflate-raw')` replaces zlib in `blob-zip-stream`. `#crypto` maps to `node:crypto` on Node and to `lib/platform/crypto.browser.js` (`@noble/hashes`) in browsers. Verified byte-identical for SHA-512/384/256/1, MD5 and RIPEMD-160.
  - Browser test: `spec/browser/run.js` serves the repo and runs Mocha + Chai in headless Chrome (Puppeteer) against both the script and the module bundle (6 specs each, including Blob streaming, sheet protection and non-ASCII text).
  - fast-csv is imported by name (`{format, parse}`) because its `__esModule` flag makes the default import `undefined` under tsx and similar loaders.
  - `.husky/pre-commit` runs `lint-staged --max-arg-length 4000`: large commits overflowed the Windows command line.
- **`29b2809` refactor: modernize idioms, update docs for ESM**
  - `CommentXform`, `CommentsXform` and `StreamBuf` are ES classes. `StreamBuf` keeps its deliberate "no Duplex constructor" design through `Object.setPrototypeOf(StreamBuf.prototype, Duplex.prototype)`. `utils.inherits` was removed.
  - Spread, `Array.isArray`, `Object.hasOwn`, `includes`, `slice` (instead of `substr`), rest params, `fs.promises`, arrow helpers. New ESLint rules: `object-shorthand`, `prefer-arrow-callback`, `prefer-rest-params`, `prefer-spread`, `prefer-template`.
  - Deliberately **not** done: blanket `a && a.b` → `a?.b` and `x = x || y` → `x ||= y` rewrites (not semantically identical), and converting the event-wrapping `new Promise` blocks.
  - README Importing/Browser sections, CHANGELOG `[Unreleased]` (breaking changes listed) and AGENTS.md stack and coding rules were updated.
- **Verification** (Node 26.13, Windows): lint, `format:check`, unit 1080 (+1 pending), integration 320, end-to-end 1, browser 6+6, TypeScript 25, dist 16. A broader scratch benchmark (stream read, readFile, writeBuffer, stream write, CSV; old vs. new run alternately) showed no regression: writes are consistently faster, reads are on par within the machine's ±15% noise. One integration run showed a one-off 2-test failure that did not reproduce in 3 reruns (likely a timeout flake).

## Next Steps
- [ ] **Close the `dist/` gap before releasing 5.0.0.** This is now more visible: the `exports` `browser` condition points to `dist/exceljs.browser.mjs`, so browser bundlers resolving a git-tag install fail until `dist/` ships. **Ask the user**: (a) a release tag commit that includes the built `dist/`, (b) a `prepare` build step (needs devDependencies; esbuild only, so it is much lighter than before), or (c) GitHub Release tarballs from `pnpm pack`.
- [ ] Release as **`5.0.0`** with `/vbump-and-push major` after the user reviews both commits. Move `CHANGELOG.md` `[Unreleased]` under `[5.0.0]`.
- [ ] Run the suites on **Node 24** (this session only ran Node 26), e.g. `fnm exec --using=24 pnpm test`.
- [ ] Update the ES5/Browserify sections of `README_zh.md` to match `README.md`.
- [ ] Consider tracking `pnpm-lock.yaml` (currently gitignored). **Ask the user first.**
- [ ] Optional cleanups: modernize the manual `test/` scripts (converted to ESM but not run in CI), consider replacing `under-dash` helpers with native code, and convert `makePivotTable` into a class (`ai-docs/planned.md` item 1).

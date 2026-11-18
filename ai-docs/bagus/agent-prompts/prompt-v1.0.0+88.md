# AI Agent Prompt: Post-4.5.0 Tooling Cleanup (Node 26 Browser Tests)

## Objective
`v4.5.0` is released (tagged and pushed). Restore the browser Jasmine test suite on the current default Node.js (v26), and tidy the release follow-ups without changing the public API.

## Instructions
1. Reproduce: `pnpm build` then `pnpm test:jasmine` on Node 26. Grunt fails to load `grunt-contrib-jasmine` (`require is not defined in ES module scope`, from Puppeteer 19's `yargs`). For a baseline, confirm it passes on Node 24: `fnm exec --using=v24.22.2 node node_modules/grunt/bin/grunt jasmine`.
2. Upgrade the browser test tooling (`grunt-contrib-jasmine`, Puppeteer, and Jasmine `3.8.0` → `4.x` if compatible) in `package.json`/`gruntfile.js`. Remove the `customBootFile` workaround if it's no longer needed, and opt into `headless: 'new'`. Keep the existing 4 browser specs passing.
3. Delete the redundant `patches/jszip+3.10.1.patch`. The active patch is `patches/jszip@3.10.1.patch`, registered in `pnpm-workspace.yaml`. Confirm `spec/integration/pr/test-pr-2672.spec.js` still passes after `pnpm install && pnpm build`.
4. Re-run the full verification: `pnpm lint`, native + ES5 (`$env:EXCEL_BUILD = "es5"`) unit, integration, end-to-end, and dist; `test:typescript`; `test:jasmine`.
5. Ask the user how the fork should be distributed (git-tag installs vs. a scoped npm package name). Don't rename the package without approval.
6. Commit per `AGENTS.md` rules and complete the session handoff.

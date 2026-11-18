# AI Agent Prompt: Final PR Batch (#2867, #2779, #1457, #2077, #1869) & Catalog Completion

## Objective
Complete the integration of all remaining functional Pull Requests and finalize the PR catalog:
- **PR #2867**: `Introducing styleCacheMode. Up to 3x performance improvements on xlsx…` (by `@brunoargolo`)
- **PR #2779**: `improve: add logs to help developers troubleshoot issues` (by `@gweesin`)
- **PR #1457**: `browser: add streaming xlsx reader for blob` (by `@myfreeer`)
- **PR #2077**: `Basic shape support added` (by `@DantSu` — verify coverage via PR #2601 and mark `DONE`)
- **PR #1869**: `Lint fixes` (by `@bno1` — verify `pnpm lint` passes with 0 errors and mark `DONE`)
- **Remaining 12 non-functional / superseded / dependency PRs** (`#2989`, `#2930`, `#2891`, `#2869`, `#2847`, `#2812`, `#2744`, `#2710`, `#2688`, `#2687`, `#2278`, `#1664`): audit each one and update its status in `ai-docs/prs/` so the entire 135-PR catalog is accounted for.

## Instructions
1. Inspect `ai-docs/prs/pr-2867.md`, `ai-docs/prs/pr-2779.md`, `ai-docs/prs/pr-1457.md`, `ai-docs/prs/pr-2077.md`, and `ai-docs/prs/pr-1869.md` along with upstream PR diffs (`curl.exe -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement the code changes and typings (`index.d.ts` if applicable) for **PR #2867**, **PR #2779**, and **PR #1457**, and add/verify unit, integration, and TypeScript tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Update the status of `#2867`, `#2779`, `#1457`, `#2077`, `#1869`, and the remaining 12 catalog entries in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.
6. **Commit and Push**: Commit all code/test/doc changes and push to `origin/master`, ensuring commit messages follow `AGENTS.md` (<50 chars imperative summary) and explicitly credit every PR number (`#...`), related Issue (`#...`), and upstream contributor (`@username`).

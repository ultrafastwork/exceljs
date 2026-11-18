# AI Agent Prompt: Batch PRs #2867, #2077, #2779, #1869

## Objective
Implement and verify support for:
- **PR #2867**: `Introducing styleCacheMode. Up to 3x performance improvements on xlsx…`
- **PR #2077**: `Basic shape support added`
- **PR #2779**: `improve: add logs to help developers troubleshoot issues`
- **PR #1869**: `Lint fixes`

## Instructions
1. Inspect `ai-docs/prs/pr-2867.md`, `ai-docs/prs/pr-2077.md`, `ai-docs/prs/pr-2779.md`, and `ai-docs/prs/pr-1869.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

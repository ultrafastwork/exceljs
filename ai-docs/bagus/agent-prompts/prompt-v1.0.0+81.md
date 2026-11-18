# AI Agent Prompt: Batch PRs #1889, #1885, #1789

## Objective
Implement and verify support for:
- **PR #1889**: `Support nested columns feature`
- **PR #1885**: `Add table support for streaming Mode Fixes issue #1412`
- **PR #1789**: `Add support image accessibilities requirements`

## Instructions
1. Inspect `ai-docs/prs/pr-1889.md`, `ai-docs/prs/pr-1885.md`, and `ai-docs/prs/pr-1789.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

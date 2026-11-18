# AI Agent Prompt: Batch PRs #1938, #1933, #1929

## Objective
Implement and verify support for:
- **PR #1938**: `Fix loadin of table rows and ref from xlsx file`
- **PR #1933**: `Add automatic size for comment box`
- **PR #1929**: `Release large values early for GC to be able to do its job`

## Instructions
1. Inspect `ai-docs/prs/pr-1938.md`, `ai-docs/prs/pr-1933.md`, and `ai-docs/prs/pr-1929.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

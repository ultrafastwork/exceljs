# AI Agent Prompt: Batch PRs #1688, #1600, #1573

## Objective
Implement and verify support for:
- **PR #1688**: `fix issue #894`
- **PR #1600**: `Fix spliceRows() issues with delete`
- **PR #1573**: `fix: cell.style.fill problems`

## Instructions
1. Inspect `ai-docs/prs/pr-1688.md`, `ai-docs/prs/pr-1600.md`, and `ai-docs/prs/pr-1573.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

# AI Agent Prompt: Batch PRs #2601, #2578, #2563

## Objective
Implement and verify support for:
- **PR #2601**: `feat: Support shapes and text boxes`
- **PR #2578**: `PivotTable: Support multiple values`
- **PR #2563**: `feat: header and footer support image`

## Instructions
1. Inspect `ai-docs/prs/pr-2601.md`, `ai-docs/prs/pr-2578.md`, and `ai-docs/prs/pr-2563.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

# AI Agent Prompt: Batch PRs #2633, #2625, #2602

## Objective
Implement and verify support for:
- **PR #2633**: `WorksheetWriter.addImage`
- **PR #2625**: `Fix splicecolumn mergedcells`
- **PR #2602**: `Parse page breaks`

## Instructions
1. Inspect `ai-docs/prs/pr-2633.md`, `ai-docs/prs/pr-2625.md`, and `ai-docs/prs/pr-2602.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

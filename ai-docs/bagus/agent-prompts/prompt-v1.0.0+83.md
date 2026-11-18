# AI Agent Prompt: Batch PRs #1563, #1516, #1448, #1378

## Objective
Implement and verify support for:
- **PR #1563**: `col listed in different order in the excel xml breaks props load`
- **PR #1516**: `Corretly serialize and deserialize multiple print areas on one worksh…`
- **PR #1448**: `Add addImage method validation`
- **PR #1378**: `fix issue #791 - modify a cell style on existing excel file may affec…`

## Instructions
1. Inspect `ai-docs/prs/pr-1563.md`, `ai-docs/prs/pr-1516.md`, `ai-docs/prs/pr-1448.md`, and `ai-docs/prs/pr-1378.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

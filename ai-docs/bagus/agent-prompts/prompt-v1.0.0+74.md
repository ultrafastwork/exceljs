# AI Agent Prompt: Batch PRs #2185, #2089, #2090

## Objective
Implement and verify support for:
- **PR #2185**: `fix file not opening because of wrong defaults`
- **PR #2089**: `Fix #1959 Corrupted file generating by reading and modifing an existing XLSX file with tables`
- **PR #2090**: `Tables and media update functions when inserting or deleting rows/columns in a worksheet`

## Instructions
1. Inspect `ai-docs/prs/pr-2185.md`, `ai-docs/prs/pr-2089.md`, and `ai-docs/prs/pr-2090.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

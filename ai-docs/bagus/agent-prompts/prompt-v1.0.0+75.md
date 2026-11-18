# AI Agent Prompt: Batch PRs #2201, #2264, #2341

## Objective
Implement and verify support for:
- **PR #2201**: `WorksheetWriter.addImage` (Streaming image support for WorksheetWriter)
- **PR #2264**: `fix: Fix the problem of displaying more than 255 characters in formula...`
- **PR #2341**: `tests: Add test with a third party exported excel file`

## Instructions
1. Inspect `ai-docs/prs/pr-2201.md`, `ai-docs/prs/pr-2264.md`, and `ai-docs/prs/pr-2341.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

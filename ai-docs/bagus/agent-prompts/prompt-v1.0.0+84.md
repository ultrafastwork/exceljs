# AI Agent Prompt: Batch PRs #1383, #1345, #1061, #1570

## Objective
Implement and verify support for:
- **PR #1383**: `[F] #1363 - Add support for excluding AutoFilter columns`
- **PR #1345**: `Improved table handling`
- **PR #1061**: `Add ability to set fill style for a range`
- **PR #1570**: `fix a handful of streaming parser bugs`

## Instructions
1. Inspect `ai-docs/prs/pr-1383.md`, `ai-docs/prs/pr-1345.md`, `ai-docs/prs/pr-1061.md`, and `ai-docs/prs/pr-1570.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

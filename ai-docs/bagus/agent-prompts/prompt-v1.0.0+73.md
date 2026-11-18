# AI Agent Prompt: Batch PRs #2102, #2080, #2116

## Objective
Implement and verify support for:
- **PR #2102**: `Fixed issue 1351 - "worksheet.properties.outlineProperties does not exist"`
- **PR #2080**: `fix issue #1695, #1130 reading csv files with headers`
- **PR #2116**: `Add duplicate multiple rows feature`

## Instructions
1. Inspect `ai-docs/prs/pr-2102.md`, `ai-docs/prs/pr-2080.md`, and `ai-docs/prs/pr-2116.md` along with the upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

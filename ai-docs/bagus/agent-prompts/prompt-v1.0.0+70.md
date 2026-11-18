# AI Agent Prompt: Batch PRs #1743, #1907, #2009

## Objective
Implement and verify support for:
- **PR #1743**: `fix CSV reading large number` (`lib/csv/csv.js`, `spec/unit/csv/csv.spec.js`)
- **PR #1907**: `FIX assignStyle on Table.store` (`lib/doc/table.js`, `spec/unit/doc/table.spec.js`)
- **PR #2009**: `Fix addThemes` (`lib/xlsx/xlsx.js` / `lib/stream/xlsx/workbook-writer.js`)

## Instructions
1. Inspect `ai-docs/prs/pr-1743.md`, `ai-docs/prs/pr-1907.md`, and `ai-docs/prs/pr-2009.md` along with the relevant source and test files.
2. Implement the fixes and add unit test coverage.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/` and complete the session handoff.

# AI Agent Prompt: Batch PRs #2558, #2049, #1971

## Objective
Implement and verify support for:
- **PR #2558**: `Fix the problem with writing a file using streams and not using RAM`
- **PR #2049**: `improved media properties with rotation, extent, offset`
- **PR #1971**: `Fixed set multiple print area functionality.`

## Instructions
1. Inspect `ai-docs/prs/pr-2558.md`, `ai-docs/prs/pr-2049.md`, and `ai-docs/prs/pr-1971.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

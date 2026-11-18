# AI Agent Prompt: Batch PRs #2588, #2614, #2562

## Objective
Implement and verify support for:
- **PR #2588**: `Fix shared strings and richText`
- **PR #2614**: `fix: addImage position is wrong`
- **PR #2562**: `fix: fixes typescript and intellisense`

## Instructions
1. Inspect `ai-docs/prs/pr-2588.md`, `ai-docs/prs/pr-2614.md`, and `ai-docs/prs/pr-2562.md` along with upstream PR diffs (`curl -sL https://github.com/exceljs/exceljs/pull/<number>.diff`) and relevant source and spec files.
2. Implement necessary code changes and typings (`index.d.ts` if applicable), and add/verify unit and integration tests.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm run test:typescript`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/pr-*.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.
5. Complete the session handoff per project rules in `AGENTS.md`.

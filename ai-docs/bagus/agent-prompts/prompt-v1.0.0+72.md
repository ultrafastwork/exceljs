# AI Agent Prompt: Batch PRs #2095, #2081, #1665

## Objective
Implement and verify support for:
- **PR #2095**: `fix: saving a worksheet with conditional formatting breaks the font styles`
- **PR #2081**: `fix utf-8 multibyte character garbled problem`
- **PR #1665**: `fix: parse-sax distructs multi-byte char`

## Instructions
1. Inspect `ai-docs/prs/pr-2095.md`, `ai-docs/prs/pr-2081.md`, and `ai-docs/prs/pr-1665.md` along with the upstream PR diffs and relevant source/test files (`BooleanXform`, `parse-sax.js`, etc.).
2. Implement any remaining fixes and add/verify unit and integration test coverage.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/` and complete the session handoff.

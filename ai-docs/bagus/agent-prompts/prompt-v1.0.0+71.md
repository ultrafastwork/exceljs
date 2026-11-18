# AI Agent Prompt: Batch PRs #2002, #2001, #1886

## Objective
Implement and verify support for:
- **PR #2002**: `fix hyperlink hash`
- **PR #2001**: `fix xlsx parser can not compatible with rich text tags that are not closed`
- **PR #1886**: `Fix Row.values type definition` (`index.d.ts`)

## Instructions
1. Inspect `ai-docs/prs/pr-2002.md`, `ai-docs/prs/pr-2001.md`, and `ai-docs/prs/pr-1886.md` along with the upstream PR diffs and relevant source/test files.
2. Implement the fixes and add unit/integration test coverage.
3. Run `pnpm lint`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.
4. Mark completed PRs as `DONE` in `ai-docs/prs/` and complete the session handoff.

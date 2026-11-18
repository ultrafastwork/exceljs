# AI Agent Prompt: Release Readiness & Full Suite Verification

## Objective
All **135** upstream Pull Requests in `ai-docs/prs/` have been audited/implemented and marked `DONE`. Verify the remaining distribution, end-to-end, and browser test suites, and synchronize project roadmap documentation (`ai-docs/features.md`, `ai-docs/planned.md`) for release readiness.

## Instructions
1. Run `pnpm lint`, `pnpm build`, `pnpm test:end-to-end`, `pnpm test:dist`, and `pnpm test:jasmine` (or inspect browser test environment if headless Chrome is configured).
2. Audit `ai-docs/features.md` and `ai-docs/planned.md` against the completed PRs in `ai-docs/prs/README.md` and update them with any newly added features (e.g., `stylesCacheMode`, `Cell.addStyle`, `WorkbookReaderBlob` for browser `Blob` streaming, shape support, pivot tables, web-native streams).
3. Complete the session handoff per project rules in `AGENTS.md`.

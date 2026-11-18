# AI Agent Prompt: Release Packaging, ES5 Verification & Changelog

## Objective
Prepare the ExcelJS fork for release after completing all 135 upstream PRs and verifying all native, dist, end-to-end, browser Jasmine, and TypeScript test suites.

## Instructions
1. Run `pnpm pack --dry-run` and inspect the file list to verify all expected package artifacts (`dist/`, `lib/`, `excel.js`, `index.js`, `index.d.ts`, `LICENSE`, `README.md`, `README_zh.md`) are included and no extraneous files are packaged.
2. Run ES5 build verification (`test:unit:es5`, `test:integration:es5`, `test:end-to-end:es5` — using PowerShell `$env:EXCEL_BUILD = "es5"` on Windows since `package.json` uses POSIX `export`).
3. Draft release notes for `CHANGELOG.md` summarizing the fork's updates since `4.4.0` based on `ai-docs/features.md` and recent git commits, and ask the user to confirm the target version bump before modifying `package.json` or creating a release commit/tag.
4. Complete the session handoff per project rules in `AGENTS.md`.

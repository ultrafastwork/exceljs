# AI Agent Prompt: PR #2849 - Support web-native streams for read/write methods

## Objective
Implement and verify support for PR #2849: `feat: support web-native streams for read/write methods`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2849.md` and inspect `read` and `write` stream handling in `lib/xlsx/xlsx.js`, `lib/csv/csv.js` (and any related files in `lib/`), TypeScript definitions in `index.d.ts`, and related tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement support for web-native `ReadableStream` and `WritableStream` in `read` and `write` methods while preserving full backward compatibility with Node.js streams.
- Update `index.d.ts` and add automated tests covering web-native `ReadableStream` and `WritableStream`.
- Verify unit, type, and integration tests pass with `pnpm test:unit`, `pnpm test:integration`, and any TypeScript checks.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2849.md`.
  - Add the `✅` checkmark to `#2849` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2849]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

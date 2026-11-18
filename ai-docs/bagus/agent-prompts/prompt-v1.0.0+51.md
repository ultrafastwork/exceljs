# AI Agent Prompt: PR #2671 - Make iterate-stream More Resilient

## Objective
Implement and verify support for PR #2671: `fix: make iterate-stream more resilient`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2671.md` and inspect `lib/stream/xlsx/workbook-reader.js`, `lib/utils/iterate-stream.js`, and related tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the fix while preserving backward compatibility.
- Add automated tests covering the changes.
- Verify tests pass with `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm test:typescript`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2671.md`.
  - Add the `✅` checkmark to `#2671` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2671]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

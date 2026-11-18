# AI Agent Prompt: PR #2977 - Fix large validation ranges by clamping range to highest row in actual data

## Objective
Implement and verify support for PR #2977: `Fix large validation ranges by clamping range to highest row in actual data`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2977.md` and inspect data validation xform/reconcile logic in `lib/xlsx/xform/sheet/` (e.g., `data-validations-xform.js`) and related tests in `spec/` (including `spec/integration/issues/issue-1842-*.spec.js`).
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Clamp large data validation ranges to the highest actual row in use in the model before running `Range` on them, without breaking existing validation behavior.
- Add automated unit/integration tests covering this edge case.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2977.md`.
  - Add the `✅` checkmark to `#2977` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2977]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

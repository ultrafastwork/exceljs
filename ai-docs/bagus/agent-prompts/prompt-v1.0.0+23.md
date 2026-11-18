# AI Agent Prompt: PR #2978 - Fix undefined column assignment autofilter

## Objective
Implement and verify support for PR #2978: `Fix undefined column assignment autofilter`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2978.md` and inspect autofilter xform/reconcile logic in `lib/xlsx/xform/sheet/` (e.g., `auto-filter-xform.js`, `filter-column-xform.js`) and related tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Add a guard against undefined column assignment in autofilter parsing/reconciliation so the xlsx parser does not crash.
- Add automated unit/integration tests covering this edge case.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2978.md`.
  - Add the `✅` checkmark to `#2978` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2978]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

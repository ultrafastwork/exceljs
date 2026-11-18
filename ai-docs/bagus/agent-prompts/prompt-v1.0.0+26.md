# AI Agent Prompt: PR #2956 - Fix dateToExcel() return value for non-numeric values

## Objective
Implement and verify support for PR #2956: `Fix the return value from dateToExcel() when it's passed a non-numeric value.`

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2956.md` and inspect `dateToExcel()` in `lib/utils/utils.js` (and any callers in `lib/`), as well as related tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Ensure `dateToExcel()` handles non-numeric / invalid date inputs safely without producing `NaN` when persisted.
- Add automated unit/integration tests covering non-numeric values passed to `dateToExcel()`.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2956.md`.
  - Add the `✅` checkmark to `#2956` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2956]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

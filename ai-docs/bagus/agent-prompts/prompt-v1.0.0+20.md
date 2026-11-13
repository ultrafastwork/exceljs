# AI Agent Prompt: PR #2995 - feat: Support multiple pivot tables from same source data

## Objective
Implement and verify support for PR #2995: feat: Support multiple pivot tables from same source data.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2995.md` and inspect the relevant pivot table files (`lib/doc/pivot-table.js`, `lib/xlsx/xform/pivot-table/*`, `lib/xlsx/xlsx.js`, and `spec/integration/workbook/pivot-tables.spec.js`).
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement support for multiple pivot tables from the same source data.
- Add automated tests in `spec/integration/workbook/pivot-tables.spec.js` (and unit tests if applicable).
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2995.md`.
  - Add the `✅` checkmark to `#2995` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2995]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

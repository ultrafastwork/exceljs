# AI Agent Prompt: PR #2973 - Fix parsing error for dynamicFilter nodes in Excel tables

## Objective
Implement and verify support for PR #2973: `Fix parsing error for dynamicFilter nodes in Excel tables`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2973.md` and inspect table/autofilter xform logic in `lib/xlsx/xform/table/` (e.g., `filter-column-xform.js`, `auto-filter-xform.js`, `table-xform.js`) and related tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Prevent `Unexpected xml node in parseOpen` exception when loading an Excel file with `dynamicFilter` nodes in tables, without breaking existing table/autofilter parsing.
- Add automated unit/integration tests covering `dynamicFilter` nodes in Excel tables.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2973.md`.
  - Add the `✅` checkmark to `#2973` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2973]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

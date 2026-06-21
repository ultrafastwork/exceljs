# AI Agent Prompt: PR #2998 - Fix getTable().addRow() workflow for loaded tables

## Objective
Implement and verify support for PR #2998 / Issue #2987: Fix getTable().addRow() workflow for loaded tables, which crashes or doesn't expand reference/preserve filter buttons correctly.

## Context & Details
- **The Problem**: The `getTable().addRow()` workflow fails when working with tables loaded from Excel files, throwing:
  `TypeError: Cannot read properties of undefined (reading 'length')`
  Additionally:
  - Table references don't expand dynamically when rows are added.
  - Excel filter buttons disappear after save/load cycle.
  - Missing worksheet references cause inconsistent behavior.
- **The Solution**:
  1. Modify `lib/doc/table.js`:
     - Fix `autoFilterRef` to target header row only.
     - Add `_updateTableRef()` method to dynamically update table ranges when rows change.
     - Modify `addRow()` to update table references and call `commit()` to re-render properly.
     - Modify `removeRows()` to update table references after removal.
     - Add `_writeRowToWorksheet()` helper for targeted row writes.
     - Add `autoFilterRef` getter/setter.
  2. Modify `lib/doc/worksheet.js`:
     - Map `tableRef` to `ref` for Excel format compatibility when loading.
     - Add empty `rows` array for loaded tables.
     - Auto-detect `headerRow` when columns have names.
     - Enable `filterButton: true` on columns when `autoFilterRef` exists.
  3. Create test coverage:
     - Recreate or retrieve `test/test-table-addrow.js`.
- **Target Files**:
  - `lib/doc/table.js`
  - `lib/doc/worksheet.js`
  - `test/test-table-addrow.js` (New)
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2998.md` and fetch/check the diff from GitHub using `gh pr diff 2998 --repo exceljs/exceljs`.
- Create a design and implementation plan, detailing the modifications in `lib/doc/table.js` and `lib/doc/worksheet.js`.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the changes in `lib/doc/table.js` and `lib/doc/worksheet.js`.
- Write the test script under `test/test-table-addrow.js`.
- Run the test script using `node test/test-table-addrow.js` and verify it passes.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues using `pnpm lint`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules):
  - Mark status as `DONE` in `ai-docs/prs/pr-2998.md`.
  - Add the `✅` checkmark to `#2998` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2998]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

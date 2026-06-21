# AI Agent Prompt: PR #2997 - feat: Add applyWidthHeightFormats option for pivot table column widths

## Objective
Implement and verify support for PR #2997: feat: Add applyWidthHeightFormats option for pivot table column widths.

## Context & Details
- **The Problem**: Excel pivot table styles override and reset custom worksheet column widths, making custom sizing on worksheets containing pivot tables impossible.
- **The Solution**:
  1. Modify `lib/doc/pivot-table.js`:
     - Accept the optional `applyWidthHeightFormats` parameter in the pivot table model.
     - Default it to `'1'` (Excel's standard behavior to apply styling widths) for backwards compatibility.
  2. Modify `lib/xlsx/xform/pivot-table/pivot-table-xform.js`:
     - Render/pass `applyWidthHeightFormats` attribute in the generated pivot table definition XML.
- **Target Files**:
  - `lib/doc/pivot-table.js`
  - `lib/xlsx/xform/pivot-table/pivot-table-xform.js`
  - `test/test-pivot-table.js`
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2997.md` and fetch/check the diff from GitHub using `gh pr diff 2997 --repo exceljs/exceljs`.
- Create a design and implementation plan, detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the changes in `lib/doc/pivot-table.js` and `lib/xlsx/xform/pivot-table/pivot-table-xform.js`.
- Write/update the test cases in `test/test-pivot-table.js` to verify custom width preservation.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues using `pnpm lint`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules):
  - Mark status as `DONE` in `ai-docs/prs/pr-2997.md`.
  - Add the `✅` checkmark to `#2997` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2997]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

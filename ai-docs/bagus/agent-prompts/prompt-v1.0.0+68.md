# AI Agent Prompt: PR #2079 - Fix Unable to specify a note in a cell within a table

## Objective
Implement and verify support for PR #2079: `Fix Unable to specify a note in a cell within a table` in `lib/xlsx/xform/sheet/worksheet-xform.js` and `spec/unit/xlsx/xform/sheet/worksheet-xform.spec.js`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-2079.md`
- **Issue**:
  - In `WorkSheetXform.prototype.render` (`lib/xlsx/xform/sheet/worksheet-xform.js`), `<legacyDrawing>` nodes (used for cell notes/comments) are currently rendered at the very end of `<worksheet>`, after `<tableParts>` and `<extLst>`.
  - According to the OpenXML `CT_Worksheet` schema specification, `<legacyDrawing>` must appear directly after `<drawing>` (and before `<picture>`, `<tableParts>`, and `<extLst>`). Rendering `<legacyDrawing>` after `<tableParts>` causes Excel to report a corrupted workbook when a sheet contains both a table and a cell note.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2079.md` and inspect `lib/xlsx/xform/sheet/worksheet-xform.js` and `spec/unit/xlsx/xform/sheet/worksheet-xform.spec.js`.
- Create a design and implementation plan detailing the code and unit test updates.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `lib/xlsx/xform/sheet/worksheet-xform.js`:
  - In `WorkSheetXform.prototype.render`, move the `if (model.rels) { ... legacyDrawing ... }` block so it is rendered directly after `this.map.drawing.render(xmlStream, model.drawing);` and before `this.map.picture.render(xmlStream, model.background);`, `this.map.tableParts.render(xmlStream, model.tables);`, and `this.map.extLst.render(xmlStream, model);`.
- Add unit tests in `spec/unit/xlsx/xform/sheet/worksheet-xform.spec.js` verifying that `legacyDrawing` is rendered before `tableParts`.
- Verify code quality and tests pass with `pnpm lint`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2079.md`.
  - Add the `✅` checkmark to `#2079` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2079]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

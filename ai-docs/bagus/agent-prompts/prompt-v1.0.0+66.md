# AI Agent Prompt: PR #1936 - Fix loading of tables with calculated columns.

## Objective
Implement and verify support for PR #1936: `Fix loading of tables with calculated columns.` in `lib/xlsx/xform/table/table-column-xform.js`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-1936.md`
- **Issue**:
  - When a `<tableColumn>` in table XML contains child elements such as `<calculatedColumnFormula>` or `<totalsRowFormula>`, `TableColumnXform.prototype.parseClose` currently ignores the closing tag `name` and unconditionally returns `false`.
  - Consequently, when `</calculatedColumnFormula>` is encountered, `TableColumnXform.parseClose` returns `false`, causing `ListXform` (`tableColumns`) to think `<tableColumn>` closed; then when `</tableColumn>` is encountered, `ListXform.parseClose` returns `false`, prematurely terminating parsing of any subsequent `<tableColumn>` elements in `<tableColumns>`.
  - Checking `if (name === this.tag) { return false; } return true;` (or `return name !== this.tag;`) in `TableColumnXform.prototype.parseClose(name)` ensures only `</tableColumn>` closes the `TableColumnXform` parser.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-1936.md` and inspect `lib/xlsx/xform/table/table-column-xform.js`, `spec/unit/xlsx/xform/table/table-column-xform.spec.js`, and `spec/unit/xlsx/xform/table/table-xform.spec.js`.
- Create a design and implementation plan detailing the code update and unit test addition.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `parseClose(name)` in `lib/xlsx/xform/table/table-column-xform.js` to only return `false` when `name === this.tag` (returning `true` otherwise).
- Add unit test coverage in `spec/unit/xlsx/xform/table/table-column-xform.spec.js` and/or `spec/unit/xlsx/xform/table/table-xform.spec.js` verifying that `<tableColumn>` elements containing child tags (e.g. `<calculatedColumnFormula>`) do not truncate subsequent columns in `<tableColumns>`.
- Verify code quality and tests pass with `pnpm lint`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-1936.md`.
  - Add the `✅` checkmark to `#1936` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#1936]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

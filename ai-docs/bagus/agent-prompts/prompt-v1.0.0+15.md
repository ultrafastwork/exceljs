# AI Agent Prompt: PR #3002 - Support Merged Cells Event in stream processing WorksheetReader

## Objective
Implement and verify support for PR #3002 / Issue #3000: Under stream processing, support retrieving information about merged cells.

## Context & Details
- **The Problem**: When reading xlsx files in streaming mode via `WorkbookReader` / `WorksheetReader`, the reader parses XML SAX events but does not emit/expose information about merged cells (`<mergeCell ref="..."/>`), making it impossible to obtain merged cells under stream processing.
- **The Solution**: 
  1. Modify `lib/stream/xlsx/worksheet-reader.js`:
     - Maintain a `mergeCell` reference value during SAX parsing.
     - When starting a `mergeCell` element, record `mergeCell = node.attributes.ref`.
     - When ending a `mergeCell` element, push a new event `{eventType: 'mergeCell', value: mergeCell}` to `worksheetEvents`.
  2. Implement/Add test coverage:
     - Check out or download `spec/integration/data/test-issue-3000.xlsx` from PR #3002 (`gh pr checkout 3002 --repo exceljs/exceljs -b pr-3002-branch` and copy the file, or generate/mock it).
     - Add integration test `spec/integration/pr/test-pr-3002.spec.js` that checks if the `mergeCell` event correctly yields `'A2:C4'`.
- **Target Files**:
  - `lib/stream/xlsx/worksheet-reader.js`
  - `spec/integration/data/test-issue-3000.xlsx` (New)
  - `spec/integration/pr/test-pr-3002.spec.js` (New)
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-3002.md` and check the diff from GitHub using `gh pr diff 3002 --repo exceljs/exceljs`.
- Create a design and implementation plan, detailing the implementation of the SAX parse events and how to retrieve/mock the test spreadsheet.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the changes in `lib/stream/xlsx/worksheet-reader.js`.
- Retrieve/recreate the test file `spec/integration/data/test-issue-3000.xlsx`.
- Write the integration test under `spec/integration/pr/test-pr-3002.spec.js`.
- Verify tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues using `pnpm lint`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules):
  - Mark status as `DONE` in `ai-docs/prs/pr-3002.md`.
  - Add the `✅` checkmark to `#3002` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#3002]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

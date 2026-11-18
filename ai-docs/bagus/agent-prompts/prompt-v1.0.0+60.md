# AI Agent Prompt: PR #2148 - Cleanup temporary files in WorkbookReader.parse() when not fully iterated

## Objective
Implement and verify support for PR #2148: `Issue 2147: stream.xlsx.WorkbookReader.parse() doesn't cleanup temporary files if not fully iterated` in `lib/stream/xlsx/workbook-reader.js`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-2148.md`
- **Issue**:
  - In `lib/stream/xlsx/workbook-reader.js`, `WorkbookReader.prototype.parse()` creates temporary files (`waitingWorkSheets`) when worksheet entries are encountered before `sharedStrings` and `workbookRels`.
  - Currently, `tempFileCleanupCallback()` is only called at the end of the loop over `waitingWorkSheets`. If the caller stops iterating the async generator returned by `parse()` early (e.g., `break` or an error is thrown), remaining temporary files in `waitingWorkSheets` are never cleaned up until process exit.
  - Wrapping the generator body in a `try { ... } finally { ... }` block (or cleaning up any remaining `waitingWorkSheets` in `finally`) ensures temporary files are always removed promptly even when iteration terminates early.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2148.md` and inspect `lib/stream/xlsx/workbook-reader.js`.
- Check existing `WorkbookReader` tests in `spec/integration/workbook-xlsx-reader.spec.js`.
- Create a design and implementation plan detailing the cleanup logic and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `WorkbookReader.prototype.parse` in `lib/stream/xlsx/workbook-reader.js` to guarantee cleanup of temporary worksheet files when iteration finishes or exits early.
- Add test cases in `spec/integration/workbook-xlsx-reader.spec.js` verifying that temporary files are cleaned up when `parse()` (or `for await (const worksheetReader of workbookReader)`) breaks early.
- Verify tests pass with `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm test:typescript`, and ensure modified JS files pass `npx eslint`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2148.md`.
  - Add the `✅` checkmark to `#2148` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2148]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

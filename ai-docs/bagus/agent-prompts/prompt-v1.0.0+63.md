# AI Agent Prompt: PR #1922 - Options for WorkbookReader should have an optional type

## Objective
Implement and verify support for PR #1922: `Options for WorkbookReader should have an optional type` in `index.d.ts`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-1922.md`
- **Issue**:
  - In `lib/stream/xlsx/workbook-reader.js`, `WorkbookReader`'s constructor is defined as `constructor(input, options = {})`, where `options` defaults to `{}` and applies default streaming options (`worksheets: 'emit'`, `sharedStrings: 'cache'`, etc.).
  - However, in `index.d.ts`, `stream.xlsx.WorkbookReader` declares `constructor(input: string | import('stream').Stream, options: Partial<WorkbookStreamReaderOptions>);`, requiring `options` to be passed.
  - Making `options?: Partial<WorkbookStreamReaderOptions>` optional aligns the TypeScript definitions with the runtime implementation.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-1922.md` and inspect `WorkbookReader` in `index.d.ts` and `lib/stream/xlsx/workbook-reader.js`.
- Check existing TypeScript tests in `spec/typescript/exceljs.spec.ts`.
- Create a design and implementation plan detailing the typing update and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `stream.xlsx.WorkbookReader` constructor in `index.d.ts` so `options?: Partial<WorkbookStreamReaderOptions>` is optional.
- Add TypeScript test cases in `spec/typescript/exceljs.spec.ts` verifying `new ExcelJS.stream.xlsx.WorkbookReader(stream)` without passing `options` (and with `options`).
- Verify tests pass with `pnpm test:typescript`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-1922.md`.
  - Add the `✅` checkmark to `#1922` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#1922]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

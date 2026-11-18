# AI Agent Prompt: PR #1901 - Fix worksheet reader type definitions

## Objective
Implement and verify support for PR #1901: `Fix worksheet reader type definitions` in `index.d.ts`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-1901.md`
- **Issue**:
  - In `lib/stream/xlsx/worksheet-reader.js` and `lib/stream/xlsx/workbook-reader.js`, `WorksheetReader` instances have properties such as `id`, `name`, `state`, `workbook`, `dimensions` (getter returning `Range`), `columns` (getter returning `Column[] | null`), and `getColumn(c: string | number): Column`.
  - However, in `index.d.ts`, `stream.xlsx.WorksheetReader` is missing `id`, `name`, `state`, `workbook`, and defines `dimensions(): number;` and `columns(): number;` as methods instead of getters, and `getColumn(c: number): Column;` without `string` support.
  - Updating `stream.xlsx.WorksheetReader` in `index.d.ts` aligns the TypeScript definitions with the runtime implementation.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-1901.md` and inspect `gh pr diff 1901 --repo exceljs/exceljs` if needed, along with `WorksheetReader` in `index.d.ts`, `lib/stream/xlsx/worksheet-reader.js`, and `lib/stream/xlsx/workbook-reader.js`.
- Check existing TypeScript tests in `spec/typescript/exceljs.spec.ts`.
- Create a design and implementation plan detailing the typing update and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `stream.xlsx.WorksheetReader` in `index.d.ts` to match the runtime implementation.
- Add TypeScript test cases in `spec/typescript/exceljs.spec.ts` verifying `WorksheetReader` properties (`id`, `name`, `state`, `dimensions`, `columns`, `getColumn`, etc.).
- Verify tests pass with `pnpm test:typescript`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-1901.md`.
  - Add the `✅` checkmark to `#1901` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#1901]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

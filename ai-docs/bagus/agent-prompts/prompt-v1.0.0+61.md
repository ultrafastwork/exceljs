# AI Agent Prompt: PR #2127 - Fixed error in FastCsvParserOptionsArgs

## Objective
Implement and verify support for PR #2127: `Fixed error in FastCsvParserOptionsArgs` in `index.d.ts`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-2127.md`
- **Issue**:
  - In `index.d.ts`, `FastCsvParserOptionsArgs.quote` is currently typed as `string | null`.
  - However, `fast-csv` parser options allow `quote: false` (a `boolean`) to disable quoting (as documented in the ExcelJS `README.md` and `FastCsvFormatterOptionsArgs.quote`).
  - Updating `FastCsvParserOptionsArgs.quote` to `string | null | boolean` resolves the TypeScript error when passing `quote: false` (or `true`) in `CsvReadOptions.parserOptions`.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2127.md` and inspect `FastCsvParserOptionsArgs` in `index.d.ts`.
- Check existing TypeScript tests in `spec/typescript/exceljs.spec.ts`.
- Create a design and implementation plan detailing the typing update and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `FastCsvParserOptionsArgs.quote` in `index.d.ts` to `string | null | boolean`.
- Add TypeScript test cases in `spec/typescript/exceljs.spec.ts` verifying `CsvReadOptions` with `parserOptions: { quote: false }`, `{ quote: '"' }`, and `{ quote: null }`.
- Verify tests pass with `pnpm test:typescript`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2127.md`.
  - Add the `✅` checkmark to `#2127` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2127]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

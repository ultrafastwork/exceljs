# AI Agent Prompt: PR #2587 - Fix types of Row and Column values

## Objective
Implement and verify support for PR #2587: `Fix types of Row and Column values` in `index.d.ts`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-2587.md`
- **Issue**:
  - In `index.d.ts`, `Column.values` is typed as `values: CellValue;`, whereas in `lib/doc/column.js` (`get values()` / `set values(v)`), `column.values` is a sparse array of cell values (`CellValue[]` or `readonly CellValue[]` / `CellValue[]`).
  - Also review `Row.values` in `index.d.ts` vs `lib/doc/row.js` (`get values()` returns `CellValue[]`, while `set values(value)` accepts `CellValue[] | { [key: string]: CellValue }`). Ensure any changes to `Row.values` preserve backward compatibility for both reading array values and assigning array or key-value object values.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2587.md` and inspect `index.d.ts`, `lib/doc/column.js`, and `lib/doc/row.js`.
- Check `spec/typescript/exceljs.spec.ts` for existing TypeScript tests.
- Create a design and implementation plan detailing the TypeScript interface updates and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `Column.values` (and `Row.values` if appropriate without breaking object-keyed assignment) in `index.d.ts`.
- Add TypeScript test cases in `spec/typescript/exceljs.spec.ts` verifying `column.values` and `row.values`.
- Verify tests pass with `pnpm test:typescript`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2587.md`.
  - Add the `✅` checkmark to `#2587` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2587]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

# AI Agent Prompt: PR #2596 - fix: updated dimensions type

## Objective
Implement and verify support for PR #2596: `fix: updated dimensions type` (Update `Row.dimensions` type in `index.d.ts`).

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-2596.md`
- **Issue**: In `index.d.ts`, `Row.dimensions` is typed as `readonly dimensions: number;`, whereas in `lib/doc/row.js` the getter `dimensions` returns `{ min: number, max: number }` when the row has cells, or `null` when empty.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2596.md` and inspect `index.d.ts` and `lib/doc/row.js` (and `lib/stream/xlsx/worksheet-reader.js` if applicable).
- Check `spec/typescript/exceljs.spec.ts` for existing TypeScript tests.
- Create a design and implementation plan detailing the TypeScript interface update and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `Row.dimensions` in `index.d.ts` to `readonly dimensions: { min: number; max: number } | null;` (and check if any other `dimensions` definition is affected).
- Add TypeScript test cases in `spec/typescript/exceljs.spec.ts` verifying `row.dimensions` on empty and populated rows.
- Verify tests pass with `pnpm test:typescript`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2596.md`.
  - Add the `✅` checkmark to `#2596` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2596]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

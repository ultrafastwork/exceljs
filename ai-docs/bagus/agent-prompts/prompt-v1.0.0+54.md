# AI Agent Prompt: PR #2664 - Worksheet protect(): fix types

## Objective
Implement and verify support for PR #2664: `Worksheet protect(): fix types`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2664.md` and inspect `index.d.ts` around `protect` method definition on `Worksheet`.
- Verify runtime behavior in `lib/doc/worksheet.js` (and `lib/stream/xlsx/worksheet-writer.js`) when `protect()` is called with no arguments.
- Create a design and implementation plan detailing the type modifications and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `index.d.ts` to allow `protect(password?: string, options?: Partial<WorksheetProtection>): Promise<void>;` (and check if any other Worksheet or WorksheetWriter declarations need updating).
- Add TypeScript spec tests in `spec/typescript/exceljs.spec.ts` (or `spec/typescript/pr-2664.spec.ts`) asserting that `worksheet.protect()` can be called with 0, 1, or 2 arguments without compilation errors.
- Verify tests pass with `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm test:typescript`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2664.md`.
  - Add the `✅` checkmark to `#2664` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2664]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

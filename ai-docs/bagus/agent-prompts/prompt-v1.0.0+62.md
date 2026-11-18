# AI Agent Prompt: PR #2061 - 'None' is another theme style for a table

## Objective
Implement and verify support for PR #2061: `'None' is another theme style for a table` in `index.d.ts`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-2061.md`
- **Issue**:
  - In `index.d.ts`, `TableStyleProperties.theme` currently lists `'TableStyleDark1'` through `'TableStyleMedium9'`, omitting `'None'` (and `null`, which `TableStyleInfoXform` uses when no `name` attribute is present).
  - Excel supports `'None'` (as well as `null`) as a table theme style when customizing table styles without a built-in color theme.
  - Adding `'None' | null` to `TableStyleProperties.theme` in `index.d.ts` allows TypeScript users to specify `theme: 'None'` or `theme: null` without type errors.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2061.md` and inspect `TableStyleProperties` in `index.d.ts` and `lib/xlsx/xform/table/table-style-info-xform.js`.
- Check existing TypeScript tests in `spec/typescript/exceljs.spec.ts`.
- Create a design and implementation plan detailing the typing update and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `TableStyleProperties.theme` in `index.d.ts` to include `'None' | null`.
- Add TypeScript test cases in `spec/typescript/exceljs.spec.ts` verifying `ws.addTable` with `style: { theme: 'None' }` and `style: { theme: null }`.
- Verify tests pass with `pnpm test:typescript`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2061.md`.
  - Add the `✅` checkmark to `#2061` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2061]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

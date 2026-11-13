# AI Agent Prompt: PR #2991 - feat: add getFirstWorksheet() method to safely get first existing worksheet

## Objective
Implement and verify support for PR #2991: `feat: add getFirstWorksheet() method to safely get first existing worksheet`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2991.md` and inspect `lib/doc/workbook.js`, `index.d.ts`, and relevant workbook tests (`spec/unit/doc/workbook.spec.js`, `spec/integration/workbook/*`).
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement `getFirstWorksheet()` on `Workbook` (and TypeScript declarations in `index.d.ts` if applicable).
- Add automated unit/integration tests covering edge cases (e.g., deleted first worksheet, empty workbook).
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2991.md`.
  - Add the `✅` checkmark to `#2991` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2991]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

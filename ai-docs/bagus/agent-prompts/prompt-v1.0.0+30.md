# AI Agent Prompt: PR #2876 - Fix error of adding image in certain situations

## Objective
Implement and verify support for PR #2876: `Fix error of adding image in certain situations`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2876.md` and inspect image handling in `lib/` (e.g., `lib/doc/workbook.js`, `lib/doc/worksheet.js`, `lib/xlsx/`) and related tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the fix while preserving backward compatibility.
- Add automated tests covering the image addition edge case.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2876.md`.
  - Add the `✅` checkmark to `#2876` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2876]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

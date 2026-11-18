# AI Agent Prompt: PR #2736 - Improve conditional formatting settings

## Objective
Implement and verify support for PR #2736: `Improve conditional formatting settings` (`stopIfTrue`, TypeScript definitions, and documentation).

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2736.md` and inspect the relevant conditional formatting source files in `lib/xlsx/xform/`, `index.d.ts`, documentation, and tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the fix/enhancement while preserving backward compatibility.
- Add automated tests covering the changes (including TypeScript specs if applicable).
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2736.md`.
  - Add the `✅` checkmark to `#2736` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2736]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

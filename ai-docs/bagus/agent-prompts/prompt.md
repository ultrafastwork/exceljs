# AI Agent Prompt: PR #3003 - Fix Typo in index.d.ts Comment

## Objective
Implement and verify support for PR #3003: Fix typo `definde` -> `defined` in the comment for `spliceColumns` in `index.d.ts`.

## Context & Details
- **The Problem**: In `index.d.ts`, the JSDoc comment for `spliceColumns` contains a typo: `definde` instead of `defined`.
- **The Solution**: Correct the spelling in `index.d.ts` on line 1170.
- **Target Files**:
  - `index.d.ts`
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Implementation
- Modify `index.d.ts` to correct the typo.

### 2. Testing & Verification
- Verify that the TS declarations remain valid and error-free.
- Check and fix formatting/lint issues using `pnpm lint`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules):
  - Mark status as `DONE` in `ai-docs/prs/pr-3003.md`.
  - Add the `✅` checkmark to `#3003` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#3003]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

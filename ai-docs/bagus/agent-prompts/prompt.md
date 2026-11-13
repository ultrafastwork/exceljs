# AI Agent Prompt: PR #2983 - Add ImageEditAs type and update addImage method to support 'twoCell' option

## Objective
Implement and verify support for PR #2983: `Add ImageEditAs type and update addImage method to support 'twoCell' option`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2983.md` and inspect `lib/doc/worksheet.js`, `lib/doc/image.js`, `lib/xlsx/xform/drawing/two-cell-anchor-xform.js`, `index.d.ts`, and `spec/integration/workbook/images.spec.js`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Add `ImageEditAs` type and update `addImage` / drawing XML handling to support the `'twoCell'` `editAs` option.
- Add automated unit/integration tests covering `editAs: 'twoCell'`.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2983.md`.
  - Add the `✅` checkmark to `#2983` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2983]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

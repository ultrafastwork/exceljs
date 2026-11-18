# AI Agent Prompt: PR #2851 - Fix boolean read val error for `<strike val="0"/>`

## Objective
Implement and verify support for PR #2851: `fix boolean read val error like as ：<strike val="0"/>`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2851.md` and inspect strike / boolean tag parsing in `lib/xlsx/xform/style/` (and any related xforms in `lib/`), as well as related tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Ensure `<strike val="0"/>` parses to `false` and `<strike/>` (and truthy `val` cases) parse to `true`.
- Add automated unit/integration tests covering `<strike val="0"/>` and `<strike/>`.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2851.md`.
  - Add the `✅` checkmark to `#2851` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2851]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

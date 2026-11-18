# AI Agent Prompt: PR #2651 - Fix issue #2547 (invert order of negativeFillColor and negativeBorderColor)

## Objective
Implement and verify support for PR #2651: `Fix issue #2547` (Invert order of `negativeFillColor` and `negativeBorderColor` in `DatabarExtXform`).

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-2651.md`
- **Issue**: In `lib/xlsx/xform/sheet/cf-ext/databar-ext-xform.js`, `negativeBorderColor` is rendered before `negativeFillColor`. In the OpenXML `x14:dataBar` sequence schema, `x14:negativeFillColor` must precede `x14:negativeBorderColor`. Excel fails to open generated workbooks when the XML element order is inverted.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2651.md` and inspect `lib/xlsx/xform/sheet/cf-ext/databar-ext-xform.js`.
- Check `spec/unit/xlsx/xform/sheet/cf-ext/databar-ext-xform.spec.js` and existing test cases.
- Create a design and implementation plan detailing the render sequence fix and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- In `lib/xlsx/xform/sheet/cf-ext/databar-ext-xform.js`, swap the render order so that `negativeFillColor` is rendered before `negativeBorderColor`.
- Update `spec/unit/xlsx/xform/sheet/cf-ext/databar-ext-xform.spec.js` to assert the correct XML element ordering.
- Add an integration test in `spec/integration/pr/test-pr-2651.spec.js` (or similar) verifying round-trip workbook writing/reading with `negativeFillColor` and `negativeBorderColor`.
- Verify tests pass with `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm test:typescript`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2651.md`.
  - Add the `✅` checkmark to `#2651` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2651]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

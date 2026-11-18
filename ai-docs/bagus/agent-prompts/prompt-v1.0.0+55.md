# AI Agent Prompt: PR #2655 - add: add color field in data bar cf in typescript

## Objective
Implement and verify support for PR #2655: `add: add color field in data bar cf in typescript`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2655.md` and inspect `index.d.ts` around `DataBarRuleType`.
- Inspect `lib/xlsx/xform/sheet/cf/data-bar-xform.js` to see how color and related properties (`color`, `axisColor`) are handled in data bars.
- Create a design and implementation plan detailing the type modifications and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `index.d.ts` to add `color?: Partial<Color>;` (and other relevant color properties if present in `data-bar-xform.js`) to `DataBarRuleType`.
- Add TypeScript spec tests in `spec/typescript/exceljs.spec.ts` asserting that data bar conditional formatting rule with `color` passes compilation and runs.
- Verify tests pass with `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm test:typescript`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2655.md`.
  - Add the `✅` checkmark to `#2655` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2655]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

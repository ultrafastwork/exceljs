# AI Agent Prompt: PR #2720 - Fix type mismatch in Address interface

## Objective
Implement and verify support for PR #2720: `Fix type mismatch in Address interface`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2720.md` and inspect the relevant `Address` interface definitions in `index.d.ts`, runtime implementations in `lib/`, and tests in `spec/`.
- Create a design and implementation plan detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the fix while preserving backward compatibility.
- Add automated tests covering the changes (including TypeScript specs if applicable).
- Verify tests pass with `pnpm build`, `pnpm test:unit`, `pnpm test:integration`, and `pnpm test:typescript`.
- Check and fix formatting/lint issues on modified files using ESLint.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2720.md`.
  - Add the `✅` checkmark to `#2720` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2720]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

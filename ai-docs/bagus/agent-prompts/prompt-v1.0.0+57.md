# AI Agent Prompt: PR #2630 - Add additional Media types for worksheet and workbook

## Objective
Implement and verify support for PR #2630: `Add additional Media types for worksheet and workbook (Improves type of Media interface)`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-2630.md`
- **Issue**: The `Media` interface in `index.d.ts` uses `type: string` instead of `'image' | 'background'`, and lacks accurate typing for worksheet media vs. workbook media models.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2630.md` and inspect `gh pr diff 2630 --repo exceljs/exceljs` (if available) as well as `index.d.ts`, `lib/doc/workbook.js`, and `lib/doc/worksheet.js`.
- Check `spec/typescript/exceljs.spec.ts` for existing TypeScript tests.
- Create a design and implementation plan detailing the TypeScript interface updates and test additions.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `index.d.ts` with improved `Media` types while maintaining backward compatibility.
- Add TypeScript test cases in `spec/typescript/exceljs.spec.ts` verifying the `Media` types.
- Verify tests pass with `pnpm test:typescript`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-2630.md`.
  - Add the `✅` checkmark to `#2630` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2630]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

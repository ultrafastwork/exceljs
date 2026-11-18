# AI Agent Prompt: PR #1746 - Add removeNote method

## Objective
Implement and verify support for PR #1746: `Add removeNote method` in `lib/doc/cell.js`, `index.d.ts`, `README.md`, and `spec/unit/doc/cell.spec.js`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-1746.md`
- **Issue**:
  - There is currently no clean way to remove a note/comment from a `Cell` instance. Assigning `cell.note = {}` creates an empty `Note` object rather than deleting the comment.
  - Adding `removeNote() { delete this._comment; }` on `Cell` and ensuring `get model()` deletes `model.comment` when `!this._comment` allows callers to remove a cell's note cleanly.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-1746.md` and inspect `lib/doc/cell.js`, `index.d.ts`, `README.md`, and `spec/unit/doc/cell.spec.js`.
- Create a design and implementation plan detailing the code, typings, docs, and unit test updates.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `lib/doc/cell.js`:
  - Add `removeNote() { delete this._comment; }` to `Cell`.
  - In `Cell.prototype.model` getter, add `else { delete model.comment; }` when `this._comment` is falsy.
- Update `index.d.ts` to declare `removeNote(): void;` on the `Cell` interface.
- Update `README.md` in the Cell Comments section to document `ws.getCell('B1').removeNote()`.
- Add unit tests in `spec/unit/doc/cell.spec.js` verifying `cell.removeNote()`.
- Verify code quality and tests pass with `pnpm lint`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-1746.md`.
  - Add the `✅` checkmark to `#1746` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#1746]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

# AI Agent Prompt: Implement and Verify PR #2903

## Objective
Your goal is to inspect, implement, and verify **Pull Request #2903** ("Add support for removing images from Worksheet") from the upstream repository. This feature resolves Issue #1533, enabling developers to cleanly remove images from worksheets.

## Context & Details
- **PR Detail Document**: Read [pr-2903.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2903.md) for description and context.
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Research & Analysis
- Open and read [pr-2903.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2903.md).
- **PR Evaluation & Assessment**: Before doing any code implementation, carefully check:
  1. **Is this PR needed?** (Examine the issue context, does it resolve a real pain point?).
  2. **Should this PR be implemented?** (Consider stability, performance, and backward compatibility).
  3. **Can/Should the PR's solution be improved?** (Inspect the PR author's proposed solution. Identify any fragility, security, or design issues, and see if there is a cleaner, more standard, or robust way to implement it).
- Examine how images are added to worksheets, how they are managed inside `lib/` (e.g. `lib/doc/worksheet.js` or `lib/xlsx/xform/sheet/worksheet-xform.js`), and identify the structures holding images (e.g. `_media`, images array).
- Study how we can cleanly remove an image by index or ID, including updating drawings/media relationships if necessary.

### 2. Implementation
- Implement `removeImage` on the Worksheet class (e.g. `worksheet.removeImage(index)` or similar logic from the PR).
- Ensure references to the removed image are cleaned up and no corrupted XML/zip structure is produced on write.

### 3. Verification
- Create a test spec file or add to existing tests (e.g., in `spec/integration/` or `spec/unit/`) to verify that removing an image works perfectly.
- Run the full test suite (`pnpm test:unit` and `pnpm test:integration`).
- Run `pnpm lint` and `npx eslint` to verify that formatting is clean.

### 4. Git Commit
- Once verified, commit the changes to git.
- **Commit message constraint**: Use a summary under 50 characters in imperative mood (e.g., `feat: support removing images from worksheet`).

### 5. Documentation & Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file and prepare for the next session.

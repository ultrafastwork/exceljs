# AI Agent Prompt: Implement and Verify PR #3031

## Objective
Your goal is to inspect, implement, and verify **Pull Request #3031** ("fix: terminates early on macOS with Node.js 22, causing to fail for...") from the upstream repository. This is a critical modern stability fix that prevents `WorkbookReader` from crashing silently when parsing zip-entry order worksheets under Node 22 (macOS).

## Context & Details
- **PR Detail Document**: Read [pr-3031.md](file:///d:/projects/exceljs/ai-docs/prs/pr-3031.md) for full description and context.
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) (e.g., using `pnpm`, backward compatibility priority, git commit structure, and progress handoffs).

## Instructions

### 1. Research & Analysis
- Open and read [pr-3031.md](file:///d:/projects/exceljs/ai-docs/prs/pr-3031.md).
- Locate the target file `lib/utils/iterate-stream.js`. Analyze the `iterateStream` function and where `stream.pause()` is called.
- Understand the regression fixture setup mentioned in the PR.

### 2. Implementation
- Safely remove the `stream.pause()` call in `lib/utils/iterate-stream.js`.
- Implement a regression spec at `spec/integration/issues/iterate-stream-worksheet-before-workbook.spec.js` using Mocha/Chai to read a test fixture with worksheets ordered before `workbook.xml`.
- If you need a zip/xlsx test fixture with specific sheet ordering, create one or use existing test fixtures if applicable.

### 3. Verification
- Install dependencies using `pnpm install` if needed.
- Run tests (e.g., using the appropriate project test commands, check `package.json`).
- Ensure the fix passes successfully and no existing tests are broken.

### 4. Git Commit
- Once verified, commit the changes to git.
- **Commit message constraint**: Use the format: `fix: remove stream pause in WorkbookReader for Node 22` (fewer than 50 chars for summary).

### 5. Documentation & Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

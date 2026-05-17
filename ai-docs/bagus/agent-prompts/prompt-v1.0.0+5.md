# AI Agent Prompt: Implement and Verify PR #2915

## Objective
Your goal is to inspect, implement, and verify **Pull Request #2915** ("Resolved the issue in WorkbookReader where cell values were being interpreted as sharedString instead of the actual value") from the upstream repository. This is an important fix resolving a bug where cell values are returned as their sharedString raw index instead of the actual text value during streaming.

## Context & Details
- **PR Detail Document**: Read [pr-2915.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2915.md) for full description and context.
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) (e.g. using `pnpm`, backward compatibility priority, git commit structure, and progress handoffs).

## Instructions

### 1. Research & Analysis
- Open and read [pr-2915.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2915.md).
- Locate the target file `lib/stream/xlsx/workbook-reader.js`.
- Analyze the zip and parsing stream loop in the `parse()` method.
- Check how `iterateStream(zip)` behaves, and why referencing zip directly via `for await (const entry of zip)` solves the sharedString indexing issue.

### 2. Implementation
- Update the zip stream pipeline setup:
  ```javascript
  const zip = stream.pipe(unzip.Parse({forceStream: true}));
  ```
- Change the loop iterating entries to consume the zip stream directly instead of wrapping with `iterateStream`:
  ```javascript
  for await (const entry of zip) {
  ```

### 3. Verification
- Verify using unit and integration tests (`pnpm test:unit` and `pnpm test:integration`).
- Ensure no regressions occur in the WorkbookReader's behavior across all platforms.
- Run `pnpm lint` and `npx eslint` to verify that formatting is clean.

### 4. Git Commit
- Once verified, commit the changes to git.
- **Commit message constraint**: Use a summary under 50 characters in imperative mood (e.g., `fix: resolve sharedString interpretation in WorkbookReader`). Add issue/PR references in the commit body description.

### 5. Documentation & Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

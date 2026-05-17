# AI Agent Prompt: Implement and Verify PR #2920

## Objective
Your goal is to inspect, implement, and verify **Pull Request #2920** ("fix: inefficient merge check for large amount of merged cells") from the upstream repository. This is an important performance optimization resolving a severe slowdown where worksheets containing tens of thousands of merged cells take minutes to load or parse due to an O(N) conflict check in `_mergeCellsInternal`.

## Context & Details
- **PR Detail Document**: Read [pr-2920.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2920.md) and [pr-2691.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2691.md) for full context and motivation.
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) (e.g. using `pnpm`, backward compatibility priority, git commit structure, and progress handoffs).

## Instructions

### 1. Research & Analysis
- Open and read [pr-2920.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2920.md) and [pr-2691.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2691.md).
- Locate `lib/doc/worksheet.js` and analyze how `_mergeCellsInternal` checks for conflicts among merged cells.
- Understand the complexity scaling of this check (O(N) search for every new merge cell), and how it can be optimized.

### 2. Implementation
- Implement the optimized check from PR #2920 to verify if cells in the new range are already merged, bypassing the inefficient loop over every existing merge range.
- Maintain full correctness and backward compatibility.

### 3. Verification
- Verify using unit and integration tests (`pnpm test:unit` and `pnpm test:integration`).
- Ensure no regressions occur in worksheets or cell merging across all platforms.
- Run `pnpm lint` and `npx eslint` to verify that formatting is clean.

### 4. Git Commit
- Once verified, commit the changes to git.
- **Commit message constraint**: Use a summary under 50 characters in imperative mood (e.g., `fix: optimize worksheet merge conflict check`). Add issue/PR references in the commit body description.

### 5. Documentation & Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

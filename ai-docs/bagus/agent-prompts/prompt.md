# AI Agent Prompt: Monitor and Audit Performance Optimizations

## Objective
Your goal is to monitor, audit, and explore further performance optimizations in worksheet operations, building on the 154x speedup achieved in cell merge collision checking.

## Context & Details
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) (e.g. using `pnpm`, backward compatibility priority, git commit structure, and progress handoffs).

## Instructions

### 1. Performance Auditing
- Review other parts of `lib/doc/worksheet.js` and `lib/doc/row.js` to see if there are any other O(N) loops executed in a nested manner (e.g., in insertion, duplication, deletion, or styles copying) that could be optimized to O(1) or O(log N).
- Analyze memory usage patterns when handling large worksheets.

### 2. Verification
- Verify your findings using existing tests (`pnpm test:unit` and `pnpm test:integration`).
- Ensure no regressions occur in worksheets, cell merging, or other core features across all platforms.
- Run `pnpm lint` and `npx eslint` to verify that formatting is clean.

### 3. Documentation & Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

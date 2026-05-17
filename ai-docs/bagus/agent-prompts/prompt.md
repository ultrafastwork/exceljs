# AI Agent Prompt: Implement PR #2924 Fix Anchor Column and Row Positioning

## Objective
Your goal is to implement PR #2924: "Fix Anchor Column and Row Positioning" by adjusting the scaling calculations in the `Anchor` class for Excel defaults.

## Context & Details
- **PR Description**: Previously `colWidth` and `rowHeight` assumed a simplistic scaling factor, causing incorrect image and object positioning when custom widths/heights were set. 
  This update should use precise scaling:
  * `8.43` width = `640000` EMUs
  * `15` height = `180000` EMUs
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Refactor scaling and calculations in the `Anchor` class
- Update column width and row height scaling calculations in `lib/doc/anchor.js` to use more precise default scaling factors (`8.43` width = `640000` EMUs, `15` height = `180000` EMUs).

### 2. Simplify test assertions
- Replace multiline assertions with single-line equivalents for better readability in the test suite under `spec/integration/workbook-xlsx-reader.spec.js` and `spec/unit/doc/anchor.spec.js`.

### 3. Add new integration tests
- Introduce a new integration test inside `spec/integration/workbook/images.spec.js` verifying that images are positioned correctly when custom column widths are set.

### 4. Verification
- Verify your changes using existing unit tests and integration tests (`pnpm test:unit` and `pnpm test:integration`).
- Ensure no regressions occur in image or object positioning, sheet rendering, or cell merging across all platforms.
- Run lint checks (`pnpm lint` and `npx eslint`) to ensure formatting is clean.

### 5. Documentation & Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

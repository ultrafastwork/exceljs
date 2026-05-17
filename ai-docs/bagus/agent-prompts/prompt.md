# AI Agent Prompt: PR #3019 - Add Default Values for Data Bar Conditional Formatting

## Objective
Implement and verify support for PR #3019 / Issue #3015: Add default values for data bar conditional formatting when minimal API options are provided.

## Context & Details
- **The Problem**: When creating data bar conditional formatting with minimal API options (e.g., `ws.addConditionalFormatting({ ref: "A1:A10", rules: [{ type: "dataBar", priority: 1 }] });`), ExcelJS crashes with `TypeError: Cannot read properties of undefined (reading 'forEach')` because it expects `model.cfvo` and `model.color` to be defined.
- **The Solution**: Add sensible defaults:
  - Default `cfvo` array: `[{ type: "min" }, { type: "max" }]`
  - Default `color`: `{ argb: "FF638EC6" }` (Excel blue)
- **Target Files**:
  1. `lib/xlsx/xform/sheet/cf/databar-xform.js` - Provide default `cfvo` and `color` if undefined.
  2. `lib/xlsx/xform/sheet/cf-ext/databar-ext-xform.js` - Provide default `cfvo` if undefined.
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Implementation
- Modify `lib/xlsx/xform/sheet/cf/databar-xform.js` and `lib/xlsx/xform/sheet/cf-ext/databar-ext-xform.js` to implement the defaults.

### 2. Testing & Verification
- Run existing tests to ensure no regressions.
- Add unit test coverage to verify default rendering.
- Add an integration test to verify the end-to-end workflow under minimal API options.
- Run `pnpm test:unit` and `pnpm test:integration` to ensure 100% green test suites.

### 3. Formatting
- Run `pnpm lint` and `pnpm lint:fix` to ensure formatting compliance.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

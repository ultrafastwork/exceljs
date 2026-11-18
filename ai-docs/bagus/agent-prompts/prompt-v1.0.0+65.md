# AI Agent Prompt: PR #1596 - return destination stream when piping in StreamBuf

## Objective
Implement and verify support for PR #1596: `return destination stream when piping in StreamBuf` in `lib/utils/stream-buf.js`.

## Context & Details
- **Rules File**: Always adhere to the project rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) and [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).
- **PR Description**: `ai-docs/prs/pr-1596.md`
- **Issue**:
  - In `lib/utils/stream-buf.js`, `StreamBuf.prototype.pipe(destination)` adds `destination` to `this.pipes` and flushes buffers if needed, but does not return `destination`.
  - Standard Node.js `Readable.prototype.pipe(destination)` returns `destination` to allow chaining (e.g., `stream.pipe(dest).on('finish', ...)` or usage with `stream.pipeline`).
  - Returning `destination` from `StreamBuf.prototype.pipe` aligns `StreamBuf` with the Node.js stream contract.

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-1596.md` and inspect `lib/utils/stream-buf.js` and `spec/unit/utils/stream-buf.spec.js`.
- Create a design and implementation plan detailing the code update and unit test addition.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Update `pipe(destination)` in `lib/utils/stream-buf.js` to return `destination`.
- Add unit test coverage in `spec/unit/utils/stream-buf.spec.js` verifying `stream1.pipe(stream2)` returns `stream2`.
- Verify code quality and tests pass with `pnpm lint`, `pnpm build`, `pnpm test:unit`, and `pnpm test:integration`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md):
  - Mark status as `DONE` in `ai-docs/prs/pr-1596.md`.
  - Add the `✅` checkmark to `#1596` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#1596]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [AGENTS.md](file:///d:/projects/exceljs/AGENTS.md) to update the handoff file.

# AI Agent Prompt: Implement and Verify PR #2894

## Objective
Your goal is to inspect, implement, and verify **Pull Request #2894** ("Fix parse-sax.js broke utf8 string bug") from the upstream repository. This critical bug (Issue #2084) causes Chinese or other multi-byte Unicode strings to be corrupted and split incorrectly when they span across stream chunk boundaries inside `lib/utils/parse-sax.js`.

## Context & Details
- **PR Detail Document**: Read [pr-2894.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2894.md) for description and context.
- **Target File**: Locate `lib/utils/parse-sax.js` and analyze how buffers are converted to strings using `bufferToString(chunk)` inside the chunk iteration loop.
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Research & Analysis
- Open and read [pr-2894.md](file:///d:/projects/exceljs/ai-docs/prs/pr-2894.md).
- Examine `lib/utils/parse-sax.js` to understand the root cause of the bug. Specifically, investigate how `bufferToString(chunk)` fails when multi-byte UTF-8 characters are split across raw buffer chunks.
- Explore alternative/standard solution: Node's `StringDecoder` from the core `string_decoder` module, which is robust and standard.

### 2. Implementation
- Safely implement the fix in `lib/utils/parse-sax.js`.
- Create a regression test file: `spec/integration/issues/parse-sax-utf8-characters.spec.js` using Mocha/Chai. In the test, construct a stream that emits chunks splitting a Chinese/Unicode character across chunk boundaries, and verify that `parseSax` parses it without corrupting the string.

### 3. Verification
- Run the new test and the full test suite (`pnpm test:unit` and `pnpm test:integration`).
- Run `pnpm lint` and `npx eslint` to verify that formatting is clean.

### 4. Git Commit
- Once verified, commit the changes to git.
- **Commit message constraint**: Use a summary under 50 characters in imperative mood (e.g., `fix: resolve multibyte utf8 split in parse-sax`).

### 5. Documentation & Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file and prepare for the next session.

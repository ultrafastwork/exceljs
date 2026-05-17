# AI Agent Prompt: PR #3020 Final Verification and Git Commit

## Objective
Commit the fully implemented and verified support for HAN CELL Excel files, generate any required build outputs, and prepare a final proposal for merging the pull request.

## Context & Details
- **Implementation Status**: All tasks are fully implemented, unit and integration tests are 100% green, and ESLint is completely clean.
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules), particularly the Git Commit Rules.
- **Git Commit Guidelines**: Commit summaries must be under 50 characters, use the imperative mood, and reference PR #3020 / Issue #3014.

## Instructions

### 1. Verification
- Briefly verify that all files are staged/ready for commit.
- Run `pnpm test:unit` and `pnpm test:integration` if needed to confirm zero regressions before committing.

### 2. Git Commit
- Add all modified files and the new test spec file (`spec/integration/pr/test-pr-3020.spec.js`) to staging.
- Create a clean git commit adhering strictly to the repository guidelines (imperative mood, <50 characters, referencing PR #3020 / Issue #3014).

### 3. Build browser files
- If browser distribution builds are needed, execute the build step (e.g. `pnpm build` or Grunt tasks) to ensure `dist/` is fully in-sync.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

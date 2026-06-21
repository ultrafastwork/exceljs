# AI Agent Prompt: Port and Implement Next Pull Request

## Objective
Select, port, and implement the next pull request from the open pull requests directory cataloged in `ai-docs/prs/README.md`.

## Context & Details
- We have successfully implemented and verified PR #3019.
- You must review `ai-docs/prs/README.md` to identify the next open pull request that has not been marked as DONE (lacking the `✅` checkmark).
- Adhere strictly to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Pick an open pull request from `ai-docs/prs/README.md`.
- Read its corresponding detail file `ai-docs/prs/pr-<number>.md`.
- Create a design and implementation plan.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the changes and write unit/integration tests as needed.
- Verify tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues using `pnpm lint`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to archive files and renew them for the next session.

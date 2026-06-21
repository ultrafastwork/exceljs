# AI Agent Prompt: PR #2999 - Removed critical vulnerabilities from the package.

## Objective
Implement and verify support for PR #2999: Removed critical vulnerabilities from the package, which updates dependencies and devDependencies to reduce vulnerability counts, removes unused `grunt-exorcise` build plugin, and updates the TypeScript spec file stream helper.

## Context & Details
- **The Problem**: Pre-existing dependencies in the package have critical vulnerabilities.
- **The Solution**:
  1. Modify `package.json`:
     - Update dependencies: `archiver` from `^5.0.0` to `^5.3.2`, `readable-stream` from `^3.6.0` to `^3.6.2`, `unzipper` from `^0.10.11` to `^0.10.14`, `uuid` from `^8.3.0` to `^8.3.2`.
     - Add override: `"glob": "^10.4.5"`.
     - Update devDependencies: `@types/chai` to `^5.2.3`, `@types/mocha` to `^10.0.10`, `@types/node` to `^24.10.0`, `browserify` to `^17.0.1`, `chai` to `^4.5.0`, `grunt-browserify` to `^6.0.0`, `grunt-contrib-jasmine` to `^4.0.0`, `grunt-terser` to `^2.0.0`, `mocha` to `^11.7.5`, `regenerator-runtime` to `^0.14.1`, `ts-node` to `^10.9.2`, `typescript` to `^5.9.3`.
  2. Modify `gruntfile.js`:
     - Remove `grunt-exorcise` task loader and execution from the `build` task pipeline.
  3. Modify `spec/typescript/exceljs.spec.ts`:
     - Replace workbook stream reading with standard `stream.PassThrough` to write and read from stream concurrently.
- **Target Files**:
  - `package.json`
  - `gruntfile.js`
  - `spec/typescript/exceljs.spec.ts`
- **Rules File**: Always adhere to the project rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules).

## Instructions

### 1. Selection & Research
- Read `ai-docs/prs/pr-2999.md` and fetch/check the diff from GitHub using `gh pr diff 2999 --repo exceljs/exceljs`.
- Create a design and implementation plan, detailing the modifications in the target files.

### 2. Implementation & Verification
- Obtain user approval for your implementation plan.
- Implement the changes in `package.json`, `gruntfile.js`, and `spec/typescript/exceljs.spec.ts`.
- Run `pnpm install` to update lockfile and node_modules.
- Verify unit and integration tests pass with `pnpm test:unit` and `pnpm test:integration`.
- Check and fix formatting/lint issues using `pnpm lint`.

### 3. Update PR Status & Documentation
- Follow the **Marking PRs as Completed** instructions in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules):
  - Mark status as `DONE` in `ai-docs/prs/pr-2999.md`.
  - Add the `✅` checkmark to `#2999` in `ai-docs/prs/README.md`.
  - Prepend `[DONE]` to the header `## [#2999]` in `ai-docs/prs/all_prs_consolidated.md`.

### 4. Session Handoff
- Follow the **Handoff (End of Session)** rules in [.windsurfrules](file:///d:/projects/exceljs/.windsurfrules) to update the handoff file.

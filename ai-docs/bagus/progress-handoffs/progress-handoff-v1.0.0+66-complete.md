# progress-handoff (v1.0.0+66) - Completed

## Status
- **Status**: Completed
- **Current Session**: `v1.0.0+66`
- **Developer**: bagus

## Recent Accomplishments
- Implemented **PR #1936**: `Fix loading of tables with calculated columns.`.
- Updated `TableColumnXform.prototype.parseClose(name)` in `lib/xlsx/xform/table/table-column-xform.js` to return `false` only when `name === this.tag` and `true` otherwise.
- Added unit tests in `spec/unit/xlsx/xform/table/table-column-xform.spec.js` and `spec/unit/xlsx/xform/table/table-xform.spec.js` verifying parsing of `<tableColumn>` with `<calculatedColumnFormula>` and tables with calculated columns.
- Verified linting, build, unit tests, and integration tests pass.
- Updated PR status in `ai-docs/prs/pr-1936.md`, `ai-docs/prs/README.md`, and `ai-docs/prs/all_prs_consolidated.md`.

## Next Steps
- [ ] Research and implement **PR #1746**: `Add removeNote method`.
- [ ] Inspect `ai-docs/prs/pr-1746.md`, `lib/doc/cell.js`, `index.d.ts`, `README.md`, and `spec/unit/doc/cell.spec.js`.
- [ ] Add `removeNote()` to `Cell` in `lib/doc/cell.js` (`delete this._comment;`) and ensure `Cell.prototype.model` getter deletes `model.comment` when `!this._comment`.
- [ ] Add `removeNote(): void;` to the `Cell` interface in `index.d.ts` and document `removeNote()` in `README.md`.
- [ ] Add unit tests in `spec/unit/doc/cell.spec.js` verifying `cell.removeNote()`.
- [ ] Run test suites (`pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:integration`).
- [ ] Update PR status documents (`ai-docs/prs/pr-1746.md`, `ai-docs/prs/README.md`, `ai-docs/prs/all_prs_consolidated.md`) and complete handoff.

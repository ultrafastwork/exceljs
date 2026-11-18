# progress-handoff (v1.0.0+88) - Active

## Status
- **Status**: Active
- **Current Session**: `v1.0.0+88`
- **Developer**: bagus

## Pending Tasks
- [ ] Decide distribution: keep git-tag installs (`github:<owner>/exceljs#v4.5.0`) or rename to a scoped package (e.g. `@<scope>/exceljs`) and update `repository`/`bugs`/`homepage` for npm publishing. **Ask the user before changing the package name.**
- [ ] Fix browser test tooling on Node 26 (upgrade `grunt-contrib-jasmine`/Puppeteer, Jasmine 4.x, `headless: 'new'`). Until then, run Jasmine with Node 24 (see `ai-docs/planned.md` → Known Environment Caveats).
- [ ] Remove the redundant `patches/jszip+3.10.1.patch` (pnpm uses `patches/jszip@3.10.1.patch`).
- [ ] Backlog in `ai-docs/planned.md`: pivot table class refactor and metrics, ZIP dependency strategy, Node engine floor.

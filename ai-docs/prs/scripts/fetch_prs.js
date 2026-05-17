const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPO = 'exceljs/exceljs';
const OUTPUT_DIR = path.resolve(__dirname, '..');
const INDIVIDUAL_DIR = OUTPUT_DIR; // We'll write pr-<number>.md directly to ai-docs/prs
const LIMIT = 250; // Ensure we fetch all 135 PRs

console.log(`Starting to fetch open PRs for repo ${REPO}...`);

try {
  // Ensure output directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. Fetch data from GitHub CLI
  console.log(`Executing GitHub CLI to fetch up to ${LIMIT} open pull requests...`);
  const cmd = `gh pr list --repo ${REPO} --state open --limit ${LIMIT} --json number,title,url,body,author,createdAt,updatedAt,labels`;
  
  // Set buffer size to 50MB to handle large PR descriptions safely
  const rawData = execSync(cmd, { maxBuffer: 1024 * 1024 * 50, encoding: 'utf8' });
  const prs = JSON.parse(rawData);
  
  console.log(`Successfully fetched ${prs.length} open pull requests.`);

  // Sort PRs by number descending
  prs.sort((a, b) => b.number - a.number);

  // 2. Generate Individual PR Files and prepare Consolidated / Index content
  let indexRows = [];
  let consolidatedContent = `# ExcelJS Open Pull Requests (Consolidated)

This file contains the full details of all **${prs.length}** open pull requests from the original [exceljs/exceljs](https://github.com/exceljs/exceljs) repository. It is generated to allow rapid global searching and single-context analysis for AI agents.

---
`;

  console.log('Generating individual files and building index...');

  prs.forEach((pr, idx) => {
    const authorUsername = pr.author ? pr.author.login : 'deleted_user';
    const authorName = pr.author && pr.author.name ? ` (${pr.author.name})` : '';
    const authorLink = pr.author ? `[@${authorUsername}](https://github.com/${authorUsername})` : 'deleted_user';
    
    const labelNames = pr.labels && pr.labels.length > 0
      ? pr.labels.map(l => `\`${l.name}\``).join(', ')
      : '*None*';

    const cleanBody = pr.body ? pr.body.trim() : '*No description provided.*';
    const formattedDate = new Date(pr.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // Content for individual PR markdown file
    const prFileContent = `# PR #${pr.number}: ${pr.title}

- **GitHub URL:** [PR #${pr.number} on GitHub](${pr.url})
- **Author:** ${authorLink}${authorName}
- **Labels:** ${labelNames}
- **Created At:** ${pr.createdAt} (Formatted: ${formattedDate})
- **Updated At:** ${pr.updatedAt}

---

## Description

${cleanBody}
`;

    // Save individual file
    const individualFileName = `pr-${pr.number}.md`;
    const individualFilePath = path.join(INDIVIDUAL_DIR, individualFileName);
    fs.writeFileSync(individualFilePath, prFileContent, 'utf8');

    // Add to Index rows (using relative path to file)
    indexRows.push(
      `| #${pr.number} | [${pr.title.replace(/\|/g, '\\|')}](${pr.url}) | ${authorLink} | ${labelNames} | ${formattedDate} | [Detail Link](./${individualFileName}) |`
    );

    // Add to Consolidated Content
    consolidatedContent += `
## [#${pr.number}] ${pr.title}

- **GitHub URL:** [PR #${pr.number} on GitHub](${pr.url})
- **Author:** ${authorLink}${authorName}
- **Labels:** ${labelNames}
- **Created At:** ${pr.createdAt}
- **Updated At:** ${pr.updatedAt}
- **Local Detail File:** [pr-${pr.number}.md](./pr-${pr.number}.md)

### Description

${cleanBody}

---
`;

    if ((idx + 1) % 20 === 0 || idx === prs.length - 1) {
      console.log(`Processed ${idx + 1}/${prs.length} PRs...`);
    }
  });

  // 3. Generate README.md (Index)
  console.log('Writing README.md Index...');
  const indexHeader = `# ExcelJS Open Pull Requests (Index)

Welcome to the local pull request documentation for the upstream repository [exceljs/exceljs](https://github.com/exceljs/exceljs).

This directory contains details for **${prs.length}** open pull requests. This collection allows AI agents and developers to review, audit, or port pull requests one by one without needing to continuously query the GitHub API.

## File Structure

- [README.md](./README.md) - This index file (a searchable overview table).
- [all_prs_consolidated.md](./all_prs_consolidated.md) - All PR details in a single file for easy global regex search.
- **\`pr-<number>.md\`** - Individual documents for each PR, optimized for high-context task focus (e.g., [pr-${prs[0].number}.md](./pr-${prs[0].number}.md)).

## AI Agent Instructions & Reference Commands

If you are an AI agent tasked with reviewing, auditing, or porting these pull requests, here are useful reference commands you can run in this workspace to interact with the repository:

### 1. View the Code Diff of a Pull Request
To see the exact code changes made in a specific PR:
\`\`\`powershell
gh pr diff <number> --repo exceljs/exceljs
\`\`\`

### 2. View the Files Modified in a Pull Request
To see a list of files modified:
\`\`\`powershell
gh pr view <number> --repo exceljs/exceljs --json files
\`\`\`

### 3. Check out the Pull Request Branch Locally
If you want to test, run, or build the code from a PR locally in a separate branch:
\`\`\`powershell
gh pr checkout <number> --repo exceljs/exceljs -b pr-<number>-branch
\`\`\`

---

## Open Pull Requests Directory

| Number | Title | Author | Labels | Created Date | Local Detail |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

  const indexContent = indexHeader + indexRows.join('\n') + '\n';
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), indexContent, 'utf8');

  // 4. Generate all_prs_consolidated.md
  console.log('Writing all_prs_consolidated.md...');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'all_prs_consolidated.md'), consolidatedContent, 'utf8');

  console.log('\nSUCCESS: All pull request documents generated successfully!');
  console.log(`- Index: ${path.join(OUTPUT_DIR, 'README.md')}`);
  console.log(`- Consolidated: ${path.join(OUTPUT_DIR, 'all_prs_consolidated.md')}`);
  console.log(`- Total Individual Files: ${prs.length} files in ${INDIVIDUAL_DIR}\n`);

} catch (error) {
  console.error('An error occurred during execution:', error);
  process.exit(1);
}

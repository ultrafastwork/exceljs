# ExcelJS Open Pull Requests (Index)

Welcome to the local pull request documentation for the upstream repository [exceljs/exceljs](https://github.com/exceljs/exceljs).

This directory contains details for **135** open pull requests. This collection allows AI agents and developers to review, audit, or port pull requests one by one without needing to continuously query the GitHub API.

## File Structure

- [README.md](./README.md) - This index file (a searchable overview table).
- [all_prs_consolidated.md](./all_prs_consolidated.md) - All PR details in a single file for easy global regex search.
- **`pr-<number>.md`** - Individual documents for each PR, optimized for high-context task focus (e.g., [pr-3031.md](./pr-3031.md)).

## AI Agent Instructions & Reference Commands

If you are an AI agent tasked with reviewing, auditing, or porting these pull requests, here are useful reference commands you can run in this workspace to interact with the repository:

### 1. View the Code Diff of a Pull Request
To see the exact code changes made in a specific PR:
```powershell
gh pr diff <number> --repo exceljs/exceljs
```

### 2. View the Files Modified in a Pull Request
To see a list of files modified:
```powershell
gh pr view <number> --repo exceljs/exceljs --json files
```

### 3. Check out the Pull Request Branch Locally
If you want to test, run, or build the code from a PR locally in a separate branch:
```powershell
gh pr checkout <number> --repo exceljs/exceljs -b pr-<number>-branch
```

---

## Open Pull Requests Directory

| Number | Title | Author | Labels | Created Date | Local Detail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **✅ #3031** | [fix:  terminates early on macOS with Node.js 22, causing  to fail for…](https://github.com/exceljs/exceljs/pull/3031) | [@tkambler](https://github.com/tkambler) | *None* | Apr 1, 2026 | [Detail Link](./pr-3031.md) |
| **✅ #3020** | [Fix #3014: Add support for HAN CELL Excel files](https://github.com/exceljs/exceljs/pull/3020) | [@protobi-pieter](https://github.com/protobi-pieter) | *None* | Jan 27, 2026 | [Detail Link](./pr-3020.md) |
| #3019 | [Fix #3015: Add default values for data bar conditional formatting](https://github.com/exceljs/exceljs/pull/3019) | [@protobi-pieter](https://github.com/protobi-pieter) | *None* | Jan 27, 2026 | [Detail Link](./pr-3019.md) |
| #3011 | [README.md: Formulas: Add note about not including '='](https://github.com/exceljs/exceljs/pull/3011) | [@moshekaplan](https://github.com/moshekaplan) | *None* | Dec 25, 2025 | [Detail Link](./pr-3011.md) |
| #3003 | [fix typo in comment](https://github.com/exceljs/exceljs/pull/3003) | [@divingbeetle](https://github.com/divingbeetle) | *None* | Nov 13, 2025 | [Detail Link](./pr-3003.md) |
| #3002 | [Under stream processing, the information of the merged cells in the table cannot be obtained](https://github.com/exceljs/exceljs/pull/3002) | [@halvee-tech](https://github.com/halvee-tech) | *None* | Nov 10, 2025 | [Detail Link](./pr-3002.md) |
| #2999 | [Removed critical vulnerabilities from the package.](https://github.com/exceljs/exceljs/pull/2999) | [@peterv959](https://github.com/peterv959) | *None* | Nov 8, 2025 | [Detail Link](./pr-2999.md) |
| #2998 | [Fix getTable().addRow() workflow for loaded tables](https://github.com/exceljs/exceljs/pull/2998) | [@protobi-pieter](https://github.com/protobi-pieter) | *None* | Nov 7, 2025 | [Detail Link](./pr-2998.md) |
| #2997 | [feat: Add applyWidthHeightFormats option for pivot table column widths](https://github.com/exceljs/exceljs/pull/2997) | [@protobi-pieter](https://github.com/protobi-pieter) | *None* | Nov 7, 2025 | [Detail Link](./pr-2997.md) |
| #2996 | [fix: Handle XML special characters and null values in pivot tables](https://github.com/exceljs/exceljs/pull/2996) | [@protobi-pieter](https://github.com/protobi-pieter) | *None* | Nov 7, 2025 | [Detail Link](./pr-2996.md) |
| #2995 | [feat: Support multiple pivot tables from same source data](https://github.com/exceljs/exceljs/pull/2995) | [@protobi-pieter](https://github.com/protobi-pieter) | *None* | Nov 7, 2025 | [Detail Link](./pr-2995.md) |
| #2991 | [feat: add getFirstWorksheet() method to safely get first existing worksheet ](https://github.com/exceljs/exceljs/pull/2991) | [@freepad](https://github.com/freepad) | *None* | Nov 3, 2025 | [Detail Link](./pr-2991.md) |
| #2989 | [Fix transitive dependencies issues in Snyk for outdated version of archiver](https://github.com/exceljs/exceljs/pull/2989) | [@nickiannone-fis](https://github.com/nickiannone-fis) | *None* | Oct 28, 2025 | [Detail Link](./pr-2989.md) |
| #2983 | [Add ImageEditAs type and update addImage method to support 'twoCell' option](https://github.com/exceljs/exceljs/pull/2983) | [@hshoja](https://github.com/hshoja) | *None* | Oct 9, 2025 | [Detail Link](./pr-2983.md) |
| #2978 | [Fix undefined column assignment autofilter](https://github.com/exceljs/exceljs/pull/2978) | [@hypesystem](https://github.com/hypesystem) | *None* | Sep 25, 2025 | [Detail Link](./pr-2978.md) |
| #2977 | [Fix large validation ranges by clamping range to highest row in actual data](https://github.com/exceljs/exceljs/pull/2977) | [@hypesystem](https://github.com/hypesystem) | *None* | Sep 25, 2025 | [Detail Link](./pr-2977.md) |
| #2973 | [Fix parsing error for dynamicFilter nodes in Excel tables](https://github.com/exceljs/exceljs/pull/2973) | [@johnnyoshika](https://github.com/johnnyoshika) | *None* | Sep 23, 2025 | [Detail Link](./pr-2973.md) |
| **✅ #2962** | [fix: handle missing r attribute in row and cell elements (#2961)](https://github.com/exceljs/exceljs/pull/2962) | [@Diluka](https://github.com/Diluka) | *None* | Aug 25, 2025 | [Detail Link](./pr-2962.md) |
| #2956 | [Fix the return value from dateToExcel() when it's passed a non-numeric value.](https://github.com/exceljs/exceljs/pull/2956) | [@davepuchyr](https://github.com/davepuchyr) | *None* | Aug 12, 2025 | [Detail Link](./pr-2956.md) |
| #2930 | [Update content-types.01.xml](https://github.com/exceljs/exceljs/pull/2930) | [@MatheusdeArmas](https://github.com/MatheusdeArmas) | *None* | May 20, 2025 | [Detail Link](./pr-2930.md) |
| **✅ #2924** | [Fix Anchor Column and Row Positioning by Adjusting Scaling for Excel Defaults](https://github.com/exceljs/exceljs/pull/2924) | [@stany-bns](https://github.com/stany-bns) | *None* | Apr 27, 2025 | [Detail Link](./pr-2924.md) |
| **✅ #2920** | [fix: inefficient merge check for large amount of merged cells](https://github.com/exceljs/exceljs/pull/2920) | [@3ximus](https://github.com/3ximus) | *None* | Apr 17, 2025 | [Detail Link](./pr-2920.md) |
| **✅ #2915** | [Resolved the issue in WorkbookReader where cell values were being interpreted as sharedString instead of the actual value.](https://github.com/exceljs/exceljs/pull/2915) | [@AnechaS](https://github.com/AnechaS) | *None* | Apr 9, 2025 | [Detail Link](./pr-2915.md) |
| #2912 | [Fix a constant identifier naming error in the Chinese documentation](https://github.com/exceljs/exceljs/pull/2912) | [@yusn](https://github.com/yusn) | *None* | Apr 2, 2025 | [Detail Link](./pr-2912.md) |
| **✅ #2903** | [Add support for removing images from Worksheet](https://github.com/exceljs/exceljs/pull/2903) | [@wwwxy80s](https://github.com/wwwxy80s) | *None* | Mar 20, 2025 | [Detail Link](./pr-2903.md) |
| **✅ #2894** | [Fix parse-sax.js broke utf8 string bug](https://github.com/exceljs/exceljs/pull/2894) | [@maoxian-1](https://github.com/maoxian-1) | *None* | Mar 3, 2025 | [Detail Link](./pr-2894.md) |
| #2891 | [#2878: dependencies bump and code fix](https://github.com/exceljs/exceljs/pull/2891) | [@rengare](https://github.com/rengare) | *None* | Feb 19, 2025 | [Detail Link](./pr-2891.md) |
| #2885 | [feat: add 'count' metric for pivot table](https://github.com/exceljs/exceljs/pull/2885) | [@dsilva01](https://github.com/dsilva01) | *None* | Feb 6, 2025 | [Detail Link](./pr-2885.md) |
| #2883 | [Make to work with expressions with no formulae](https://github.com/exceljs/exceljs/pull/2883) | [@AndresDSoto](https://github.com/AndresDSoto) | *None* | Jan 29, 2025 | [Detail Link](./pr-2883.md) |
| #2876 | [Fix error of adding image in certain situations](https://github.com/exceljs/exceljs/pull/2876) | [@wwwxy80s](https://github.com/wwwxy80s) | *None* | Jan 8, 2025 | [Detail Link](./pr-2876.md) |
| #2874 | [Fix: Changed error-prone race conditions](https://github.com/exceljs/exceljs/pull/2874) | [@StevenGee3398](https://github.com/StevenGee3398) | *None* | Jan 3, 2025 | [Detail Link](./pr-2874.md) |
| #2869 | [Bumping unzipper (DUPLICATED #2744)](https://github.com/exceljs/exceljs/pull/2869) | [@Siemienik](https://github.com/Siemienik) | *None* | Dec 21, 2024 | [Detail Link](./pr-2869.md) |
| #2867 | [Introducing styleCacheMode. Up to 3x performance improvements on xlsx…](https://github.com/exceljs/exceljs/pull/2867) | [@brunoargolo](https://github.com/brunoargolo) | *None* | Dec 20, 2024 | [Detail Link](./pr-2867.md) |
| #2852 | [fix: add check for empty target on worksheet-xform reconcile](https://github.com/exceljs/exceljs/pull/2852) | [@kyleamazza-fq](https://github.com/kyleamazza-fq) | *None* | Nov 28, 2024 | [Detail Link](./pr-2852.md) |
| #2851 | [fix boolean read val error like as ：<strike val="0"/>](https://github.com/exceljs/exceljs/pull/2851) | [@Jason33Wang](https://github.com/Jason33Wang) | *None* | Nov 26, 2024 | [Detail Link](./pr-2851.md) |
| #2849 | [feat: support web-native streams for read/write methods](https://github.com/exceljs/exceljs/pull/2849) | [@lionel-rowe](https://github.com/lionel-rowe) | *None* | Nov 21, 2024 | [Detail Link](./pr-2849.md) |
| #2847 | [Shuntagami patch 1](https://github.com/exceljs/exceljs/pull/2847) | [@shuntagami](https://github.com/shuntagami) | *None* | Nov 20, 2024 | [Detail Link](./pr-2847.md) |
| #2846 | [Update xlsx.js to allow compat with non office generated files.](https://github.com/exceljs/exceljs/pull/2846) | [@TheMrDec](https://github.com/TheMrDec) | *None* | Nov 12, 2024 | [Detail Link](./pr-2846.md) |
| #2812 | [update-dependency-version](https://github.com/exceljs/exceljs/pull/2812) | [@Diego-18](https://github.com/Diego-18) | *None* | Aug 27, 2024 | [Detail Link](./pr-2812.md) |
| #2809 | [Added quote prefix feature](https://github.com/exceljs/exceljs/pull/2809) | [@ldefelici-mitobit](https://github.com/ldefelici-mitobit) | *None* | Aug 14, 2024 | [Detail Link](./pr-2809.md) |
| #2807 | [place pageSetUpPr in the end of sheetPr to fix getting broken xlsx do…](https://github.com/exceljs/exceljs/pull/2807) | [@strelok372](https://github.com/strelok372) | *None* | Aug 13, 2024 | [Detail Link](./pr-2807.md) |
| #2803 | [Fix corrupted file with conditional formatting and hyperlinks](https://github.com/exceljs/exceljs/pull/2803) | [@TheAsda](https://github.com/TheAsda) | *None* | Aug 1, 2024 | [Detail Link](./pr-2803.md) |
| #2800 | [fix: worksheet-reader hidden prop](https://github.com/exceljs/exceljs/pull/2800) | [@babu-ch](https://github.com/babu-ch) | *None* | Jul 27, 2024 | [Detail Link](./pr-2800.md) |
| #2791 | [Issue 2790/xlsx stream missing worksheets](https://github.com/exceljs/exceljs/pull/2791) | [@LarryKen](https://github.com/LarryKen) | *None* | Jul 8, 2024 | [Detail Link](./pr-2791.md) |
| #2783 | [:memo: Fix errors in document about image embedding](https://github.com/exceljs/exceljs/pull/2783) | [@Cat7373](https://github.com/Cat7373) | *None* | Jun 26, 2024 | [Detail Link](./pr-2783.md) |
| #2781 | [fix: setting cell style attribute clones style object](https://github.com/exceljs/exceljs/pull/2781) | [@gmahomarf](https://github.com/gmahomarf) | *None* | Jun 24, 2024 | [Detail Link](./pr-2781.md) |
| #2779 | [improve: add logs to help developers troubleshoot issues](https://github.com/exceljs/exceljs/pull/2779) | [@gweesin](https://github.com/gweesin) | *None* | Jun 15, 2024 | [Detail Link](./pr-2779.md) |
| #2767 | [Bug2675 table creation accepts invalid names](https://github.com/exceljs/exceljs/pull/2767) | [@georgbuehler](https://github.com/georgbuehler) | *None* | May 25, 2024 | [Detail Link](./pr-2767.md) |
| #2752 | [fix #2751 - Csv reading - cells filled with spaces only are converted to 0 ](https://github.com/exceljs/exceljs/pull/2752) | [@tlgman](https://github.com/tlgman) | *None* | Apr 23, 2024 | [Detail Link](./pr-2752.md) |
| #2744 | [bump: Bumping unzipper to mitigate license issue](https://github.com/exceljs/exceljs/pull/2744) | [@dubzzz](https://github.com/dubzzz) | `prerelesed` | Apr 15, 2024 | [Detail Link](./pr-2744.md) |
| #2737 | [Don't render empty rich text substrings](https://github.com/exceljs/exceljs/pull/2737) | [@Blackhol3](https://github.com/Blackhol3) | *None* | Apr 7, 2024 | [Detail Link](./pr-2737.md) |
| #2736 | [Improve conditional formatting settings](https://github.com/exceljs/exceljs/pull/2736) | [@Blackhol3](https://github.com/Blackhol3) | *None* | Apr 7, 2024 | [Detail Link](./pr-2736.md) |
| #2720 | [Fix type mismatch in Address interface](https://github.com/exceljs/exceljs/pull/2720) | [@ashc0](https://github.com/ashc0) | *None* | Mar 5, 2024 | [Detail Link](./pr-2720.md) |
| #2710 | [fix: add proper version control to deps](https://github.com/exceljs/exceljs/pull/2710) | [@haikal-handamara-x150s](https://github.com/haikal-handamara-x150s) | *None* | Feb 28, 2024 | [Detail Link](./pr-2710.md) |
| #2702 | [Fix date parsing for Strict OpenXML spreadsheets](https://github.com/exceljs/exceljs/pull/2702) | [@jec006](https://github.com/jec006) | *None* | Feb 22, 2024 | [Detail Link](./pr-2702.md) |
| #2698 | [Issue: style.xml has [Object object] as formatCode](https://github.com/exceljs/exceljs/pull/2698) | [@jmatth11](https://github.com/jmatth11) | *None* | Feb 21, 2024 | [Detail Link](./pr-2698.md) |
| #2697 | [Add type DataValidationType](https://github.com/exceljs/exceljs/pull/2697) | [@gregfenton](https://github.com/gregfenton) | *None* | Feb 20, 2024 | [Detail Link](./pr-2697.md) |
| #2691 | [fix: inefficient merge check for large amount of merged cells within …](https://github.com/exceljs/exceljs/pull/2691) | [@aorsten](https://github.com/aorsten) | *None* | Feb 15, 2024 | [Detail Link](./pr-2691.md) |
| #2688 | [update package name](https://github.com/exceljs/exceljs/pull/2688) | [@SahilTamboli7194](https://github.com/SahilTamboli7194) | *None* | Feb 13, 2024 | [Detail Link](./pr-2688.md) |
| #2687 | [[Breaking] Replace unzipper with yauzl-promise](https://github.com/exceljs/exceljs/pull/2687) | [@pnappa](https://github.com/pnappa) | *None* | Feb 13, 2024 | [Detail Link](./pr-2687.md) |
| #2685 | [Fix error saving files when streaming using autofilter and sheet protection](https://github.com/exceljs/exceljs/pull/2685) | [@Dokril](https://github.com/Dokril) | *None* | Feb 11, 2024 | [Detail Link](./pr-2685.md) |
| #2680 | [Fix for Bug 2678: Table creation allows empty array of rows](https://github.com/exceljs/exceljs/pull/2680) | [@georgbuehler](https://github.com/georgbuehler) | *None* | Feb 7, 2024 | [Detail Link](./pr-2680.md) |
| #2672 | [Fix 'unsafe-eval' CSP issue](https://github.com/exceljs/exceljs/pull/2672) | [@cherniavskii](https://github.com/cherniavskii) | *None* | Jan 26, 2024 | [Detail Link](./pr-2672.md) |
| #2671 | [fix: make iterate-stream more resilient](https://github.com/exceljs/exceljs/pull/2671) | [@Kkoile](https://github.com/Kkoile) | *None* | Jan 25, 2024 | [Detail Link](./pr-2671.md) |
| #2664 | [Worksheet protect(): fix types](https://github.com/exceljs/exceljs/pull/2664) | [@nuragic](https://github.com/nuragic) | *None* | Jan 19, 2024 | [Detail Link](./pr-2664.md) |
| #2655 | [add: add color field in data bar cf in typescript](https://github.com/exceljs/exceljs/pull/2655) | [@krhambaliyaavesta](https://github.com/krhambaliyaavesta) | *None* | Jan 13, 2024 | [Detail Link](./pr-2655.md) |
| #2651 | [Fix issue #2547](https://github.com/exceljs/exceljs/pull/2651) | [@darkag](https://github.com/darkag) | *None* | Jan 5, 2024 | [Detail Link](./pr-2651.md) |
| #2633 | [WorksheetWriter.addImage](https://github.com/exceljs/exceljs/pull/2633) | [@shuntagami](https://github.com/shuntagami) | *None* | Dec 18, 2023 | [Detail Link](./pr-2633.md) |
| #2630 | [Add additional Media types for worksheet and workbook (Improves type of Media interface)](https://github.com/exceljs/exceljs/pull/2630) | [@devcomfort](https://github.com/devcomfort) | *None* | Dec 15, 2023 | [Detail Link](./pr-2630.md) |
| #2625 | [Fix splicecolumn mergedcells](https://github.com/exceljs/exceljs/pull/2625) | [@roshanreacts](https://github.com/roshanreacts) | *None* | Dec 9, 2023 | [Detail Link](./pr-2625.md) |
| #2614 | [fix: addImage position is wrong](https://github.com/exceljs/exceljs/pull/2614) | [@newbeea](https://github.com/newbeea) | *None* | Dec 5, 2023 | [Detail Link](./pr-2614.md) |
| #2602 | [Parse page breaks](https://github.com/exceljs/exceljs/pull/2602) | [@kigh-ota](https://github.com/kigh-ota) | *None* | Nov 26, 2023 | [Detail Link](./pr-2602.md) |
| #2601 | [feat: Support shapes and text boxes](https://github.com/exceljs/exceljs/pull/2601) | [@kigh-ota](https://github.com/kigh-ota) | *None* | Nov 25, 2023 | [Detail Link](./pr-2601.md) |
| #2596 | [fix: updated dimensions type](https://github.com/exceljs/exceljs/pull/2596) | [@sr-26](https://github.com/sr-26) | *None* | Nov 19, 2023 | [Detail Link](./pr-2596.md) |
| #2588 | [Fix shared strings and richText](https://github.com/exceljs/exceljs/pull/2588) | [@PetrChalov](https://github.com/PetrChalov) | *None* | Nov 13, 2023 | [Detail Link](./pr-2588.md) |
| #2587 | [Fix types of Row and Column values](https://github.com/exceljs/exceljs/pull/2587) | [@pex](https://github.com/pex) | *None* | Nov 13, 2023 | [Detail Link](./pr-2587.md) |
| #2578 | [PivotTable: Support multiple values](https://github.com/exceljs/exceljs/pull/2578) | [@Rablet](https://github.com/Rablet) | *None* | Nov 1, 2023 | [Detail Link](./pr-2578.md) |
| #2577 | [Fixed tabColor example and documented hexadecimal format](https://github.com/exceljs/exceljs/pull/2577) | [@Mike-Dax](https://github.com/Mike-Dax) | *None* | Nov 1, 2023 | [Detail Link](./pr-2577.md) |
| #2563 | [feat: header and footer support image](https://github.com/exceljs/exceljs/pull/2563) | [@baian1](https://github.com/baian1) | `hacktoberfest-accepted` | Oct 20, 2023 | [Detail Link](./pr-2563.md) |
| #2562 | [fix: fixes typescript and intellisense](https://github.com/exceljs/exceljs/pull/2562) | [@groozin](https://github.com/groozin) | *None* | Oct 19, 2023 | [Detail Link](./pr-2562.md) |
| #2558 | [Fix the problem with writing a file using streams and not using RAM](https://github.com/exceljs/exceljs/pull/2558) | [@zlooun](https://github.com/zlooun) | `hacktoberfest-accepted` | Oct 17, 2023 | [Detail Link](./pr-2558.md) |
| #2341 | [tests: Add test with a third party exported excel file](https://github.com/exceljs/exceljs/pull/2341) | [@Amund211](https://github.com/Amund211) | *None* | Aug 28, 2023 | [Detail Link](./pr-2341.md) |
| #2278 | [Downgrade regenerator runtime dependency to be CSP strict-src compliant](https://github.com/exceljs/exceljs/pull/2278) | [@lakshit-dua](https://github.com/lakshit-dua) | *None* | May 25, 2023 | [Detail Link](./pr-2278.md) |
| #2264 | [fix：Fix the problem of displaying more than 255 characters in formula…](https://github.com/exceljs/exceljs/pull/2264) | [@zurmokeeper](https://github.com/zurmokeeper) | *None* | May 7, 2023 | [Detail Link](./pr-2264.md) |
| #2201 | [WorksheetWriter.addImage](https://github.com/exceljs/exceljs/pull/2201) | [@yapus](https://github.com/yapus) | *None* | Jan 23, 2023 | [Detail Link](./pr-2201.md) |
| #2185 | [fix file not opening because of wrong defaults](https://github.com/exceljs/exceljs/pull/2185) | [@nbelyh](https://github.com/nbelyh) | *None* | Dec 26, 2022 | [Detail Link](./pr-2185.md) |
| #2148 | [Issue 2147: stream.xlsx.WorkbookReader.parse() doesn't cleanup temporary files if not fully iterated](https://github.com/exceljs/exceljs/pull/2148) | [@Turtlefight](https://github.com/Turtlefight) | *None* | Oct 6, 2022 | [Detail Link](./pr-2148.md) |
| #2127 | [Fixed error in FastCsvParserOptionsArgs](https://github.com/exceljs/exceljs/pull/2127) | [@andrewasd](https://github.com/andrewasd) | *None* | Aug 31, 2022 | [Detail Link](./pr-2127.md) |
| #2116 | [Add duplicate multiple rows feature](https://github.com/exceljs/exceljs/pull/2116) | [@joaojhgs](https://github.com/joaojhgs) | *None* | Aug 19, 2022 | [Detail Link](./pr-2116.md) |
| #2102 | [Fixed issue 1351 - "worksheet.properties.outlineProperties does not exist"](https://github.com/exceljs/exceljs/pull/2102) | [@ksiegel1923](https://github.com/ksiegel1923) | *None* | Aug 3, 2022 | [Detail Link](./pr-2102.md) |
| #2095 | [fix: saving a worksheet with conditional formatting breaks the font styles](https://github.com/exceljs/exceljs/pull/2095) | [@Codeneos](https://github.com/Codeneos) | *None* | Jul 15, 2022 | [Detail Link](./pr-2095.md) |
| #2090 | [Tables and media update functions when inserting or deleting rows/columns in a worksheet](https://github.com/exceljs/exceljs/pull/2090) | [@MatthisClavijo](https://github.com/MatthisClavijo) | *None* | Jul 4, 2022 | [Detail Link](./pr-2090.md) |
| #2089 | [Fix #1959 Corrupted file generating by reading and modifing an existing XLSX file with tables](https://github.com/exceljs/exceljs/pull/2089) | [@MatthisClavijo](https://github.com/MatthisClavijo) | *None* | Jun 28, 2022 | [Detail Link](./pr-2089.md) |
| #2081 | [fix utf-8 multibyte  character garbled problem](https://github.com/exceljs/exceljs/pull/2081) | [@ligolas](https://github.com/ligolas) | *None* | Jun 21, 2022 | [Detail Link](./pr-2081.md) |
| #2080 | [fix issue #1695, #1130 reading csv files with headers](https://github.com/exceljs/exceljs/pull/2080) | [@consatan](https://github.com/consatan) | *None* | Jun 17, 2022 | [Detail Link](./pr-2080.md) |
| #2079 | [Fix Unable to specify a note in a cell within a table](https://github.com/exceljs/exceljs/pull/2079) | [@rheidari](https://github.com/rheidari) | *None* | Jun 15, 2022 | [Detail Link](./pr-2079.md) |
| #2077 | [Basic shape support added](https://github.com/exceljs/exceljs/pull/2077) | [@DantSu](https://github.com/DantSu) | *None* | Jun 14, 2022 | [Detail Link](./pr-2077.md) |
| #2061 | ['None' is another theme style for a table](https://github.com/exceljs/exceljs/pull/2061) | [@gocs](https://github.com/gocs) | *None* | May 18, 2022 | [Detail Link](./pr-2061.md) |
| #2049 | [improved media properties with rotation, extent, offset](https://github.com/exceljs/exceljs/pull/2049) | [@GitSamson](https://github.com/GitSamson) | *None* | Apr 30, 2022 | [Detail Link](./pr-2049.md) |
| #2009 | [Fix addThemes](https://github.com/exceljs/exceljs/pull/2009) | [@bno1](https://github.com/bno1) | *None* | Mar 15, 2022 | [Detail Link](./pr-2009.md) |
| #2002 | [fix hyperlink hash](https://github.com/exceljs/exceljs/pull/2002) | [@nwind](https://github.com/nwind) | *None* | Mar 14, 2022 | [Detail Link](./pr-2002.md) |
| #2001 | [fix xlsx parser can not compatible with rich text tags that are not closed](https://github.com/exceljs/exceljs/pull/2001) | [@WingMrL](https://github.com/WingMrL) | *None* | Mar 11, 2022 | [Detail Link](./pr-2001.md) |
| #1971 | [Fixed set multiple print area functionality.](https://github.com/exceljs/exceljs/pull/1971) | [@hovikkhachatryan](https://github.com/hovikkhachatryan) | *None* | Feb 11, 2022 | [Detail Link](./pr-1971.md) |
| #1938 | [Fix loadin of table rows and ref from xlsx file](https://github.com/exceljs/exceljs/pull/1938) | [@antoineacy](https://github.com/antoineacy) | *None* | Dec 20, 2021 | [Detail Link](./pr-1938.md) |
| #1936 | [Fix loading of tables with calculated columns.](https://github.com/exceljs/exceljs/pull/1936) | [@antoineacy](https://github.com/antoineacy) | *None* | Dec 20, 2021 | [Detail Link](./pr-1936.md) |
| #1933 | [Add automatic size for comment box](https://github.com/exceljs/exceljs/pull/1933) | [@csgka1](https://github.com/csgka1) | *None* | Dec 18, 2021 | [Detail Link](./pr-1933.md) |
| #1929 | [Release large values early for GC to be able to do its job](https://github.com/exceljs/exceljs/pull/1929) | [@kibertoad](https://github.com/kibertoad) | *None* | Dec 14, 2021 | [Detail Link](./pr-1929.md) |
| #1922 | [Options for WorkbookReader should have an optional type](https://github.com/exceljs/exceljs/pull/1922) | [@vicary](https://github.com/vicary) | *None* | Dec 3, 2021 | [Detail Link](./pr-1922.md) |
| #1907 | [FIX assignStyle on Table.store](https://github.com/exceljs/exceljs/pull/1907) | [@o100ja](https://github.com/o100ja) | *None* | Nov 17, 2021 | [Detail Link](./pr-1907.md) |
| #1901 | [Fix worksheet reader type definitions](https://github.com/exceljs/exceljs/pull/1901) | [@SpudNyk](https://github.com/SpudNyk) | *None* | Nov 10, 2021 | [Detail Link](./pr-1901.md) |
| #1889 | [Support nested columns feature](https://github.com/exceljs/exceljs/pull/1889) | [@jeka1985](https://github.com/jeka1985) | *None* | Nov 3, 2021 | [Detail Link](./pr-1889.md) |
| #1886 | [Fix Row.values type definition](https://github.com/exceljs/exceljs/pull/1886) | [@sergejostir](https://github.com/sergejostir) | *None* | Nov 1, 2021 | [Detail Link](./pr-1886.md) |
| #1885 | [Add table support for streaming Mode Fixes issue #1412](https://github.com/exceljs/exceljs/pull/1885) | [@mrawdon](https://github.com/mrawdon) | *None* | Nov 1, 2021 | [Detail Link](./pr-1885.md) |
| #1869 | [Lint fixes](https://github.com/exceljs/exceljs/pull/1869) | [@bno1](https://github.com/bno1) | *None* | Oct 19, 2021 | [Detail Link](./pr-1869.md) |
| #1796 | [resolves #1033 - Make date1904 property on CellFormulaValue interface optional](https://github.com/exceljs/exceljs/pull/1796) | [@Barobi](https://github.com/Barobi) | *None* | Jul 22, 2021 | [Detail Link](./pr-1796.md) |
| #1789 | [Add support image accessibilities requirements](https://github.com/exceljs/exceljs/pull/1789) | [@samuraitruong](https://github.com/samuraitruong) | *None* | Jul 19, 2021 | [Detail Link](./pr-1789.md) |
| #1767 | [Add expression support for x14:cfRule](https://github.com/exceljs/exceljs/pull/1767) | [@bno1](https://github.com/bno1) | *None* | Jul 15, 2021 | [Detail Link](./pr-1767.md) |
| #1746 | [Add removeNote method](https://github.com/exceljs/exceljs/pull/1746) | [@dolbyzerr](https://github.com/dolbyzerr) | *None* | Jun 12, 2021 | [Detail Link](./pr-1746.md) |
| #1743 | [fix CSV reading large number](https://github.com/exceljs/exceljs/pull/1743) | [@Harmonickey](https://github.com/Harmonickey) | *None* | Jun 9, 2021 | [Detail Link](./pr-1743.md) |
| #1688 | [fix issue #894](https://github.com/exceljs/exceljs/pull/1688) | [@SuyongSun](https://github.com/SuyongSun) | *None* | Apr 25, 2021 | [Detail Link](./pr-1688.md) |
| #1665 | [fix: parse-sax distructs multi-byte char](https://github.com/exceljs/exceljs/pull/1665) | [@kouqon](https://github.com/kouqon) | *None* | Apr 14, 2021 | [Detail Link](./pr-1665.md) |
| #1664 | [FIXES #713 Remove 'use strict' strings brute force to enable module packaging](https://github.com/exceljs/exceljs/pull/1664) | [@laurisvan](https://github.com/laurisvan) | *None* | Apr 13, 2021 | [Detail Link](./pr-1664.md) |
| #1600 | [Fix spliceRows() issues with delete](https://github.com/exceljs/exceljs/pull/1600) | [@iva2k](https://github.com/iva2k) | *None* | Jan 29, 2021 | [Detail Link](./pr-1600.md) |
| #1596 | [return destination stream when piping in StreamBuf](https://github.com/exceljs/exceljs/pull/1596) | [@GabrielLomba](https://github.com/GabrielLomba) | *None* | Jan 23, 2021 | [Detail Link](./pr-1596.md) |
| #1573 | [fix: cell.style.fill problems](https://github.com/exceljs/exceljs/pull/1573) | [@huyunan](https://github.com/huyunan) | *None* | Dec 19, 2020 | [Detail Link](./pr-1573.md) |
| #1570 | [fix a handful of streaming parser bugs](https://github.com/exceljs/exceljs/pull/1570) | [@yocontra](https://github.com/yocontra) | *None* | Dec 18, 2020 | [Detail Link](./pr-1570.md) |
| #1563 | [col listed in different order in the excel xml breaks props load](https://github.com/exceljs/exceljs/pull/1563) | [@teodormarianmck](https://github.com/teodormarianmck) | *None* | Dec 15, 2020 | [Detail Link](./pr-1563.md) |
| #1531 | [docs: fix default options for streaming xlsx reader](https://github.com/exceljs/exceljs/pull/1531) | [@yocontra](https://github.com/yocontra) | *None* | Nov 14, 2020 | [Detail Link](./pr-1531.md) |
| #1516 | [Corretly serialize and deserialize multiple print areas on one worksh…](https://github.com/exceljs/exceljs/pull/1516) | [@peterkooijmans](https://github.com/peterkooijmans) | *None* | Oct 27, 2020 | [Detail Link](./pr-1516.md) |
| #1457 | [browser: add streaming xlsx reader for blob](https://github.com/exceljs/exceljs/pull/1457) | [@myfreeer](https://github.com/myfreeer) | *None* | Sep 12, 2020 | [Detail Link](./pr-1457.md) |
| #1448 | [Add addImage method validation](https://github.com/exceljs/exceljs/pull/1448) | [@Yangeok](https://github.com/Yangeok) | *None* | Sep 8, 2020 | [Detail Link](./pr-1448.md) |
| #1383 | [[F] #1363 - Add support for excluding AutoFilter columns](https://github.com/exceljs/exceljs/pull/1383) | [@remzh](https://github.com/remzh) | *None* | Jul 10, 2020 | [Detail Link](./pr-1383.md) |
| #1378 | [fix issue #791 - modify a cell style on existing excel file may affec…](https://github.com/exceljs/exceljs/pull/1378) | [@DantSu](https://github.com/DantSu) | *None* | Jul 8, 2020 | [Detail Link](./pr-1378.md) |
| #1345 | [Improved table handling](https://github.com/exceljs/exceljs/pull/1345) | [@delcon](https://github.com/delcon) | *None* | Jun 19, 2020 | [Detail Link](./pr-1345.md) |
| #1061 | [Add ability to set fill style for a range ](https://github.com/exceljs/exceljs/pull/1061) | [@iabukai](https://github.com/iabukai) | *None* | Dec 23, 2019 | [Detail Link](./pr-1061.md) |

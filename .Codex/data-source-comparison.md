# Recommended data sources

User selected B on 2026-11-15. B is the default in the editor, PNG renderer and HTTP SVG naming: bundled Meodai Short names, exact hex lookup followed by nearest OKLab distance through Color.js, plus a bundled Fontsource catalog. Original visual design remains intact; font search is inside the existing Style & Font dialog. No comparison panel, randomized experiment or analytics is shipped. `source=a` remains an explicit recipe fallback; `name` overrides generated labels.

Snapshots retrieved 2026-11-15:
- `src/data/shortColors.json`: https://unpkg.com/color-name-list/dist/colornames.short.json (3,099 names; MIT, https://github.com/meodai/color-names). License included locally and at `/color-names.LICENSE`.
- `src/data/fontCatalog.json`: https://api.fontsource.org/v1/fonts?type=google&subsets=latin&weights=400,700&styles=normal. Locally filtered again to Google families with Latin, normal style, and 400/700 weights (807 families). Family/category retained. Individual font licenses apply to served files.
- `src/data/baselineFonts.json`: existing editor's 143-family font list. B includes these and system fallbacks for 836 choices. Legacy entries retain their previous loading behavior.

Names are computed offline. Font files still load on demand from Google Fonts via shared renderTone. Fontsource metadata is a fixed snapshot, not fetched per visitor. Exact matching precedes perceptual matching; candidate coordinates and bounded repeated lookups are cached.

Implementation lessons: installed color-name-list 10.x lacks the upstream Short import, so use a local snapshot. Store gallery hex values and derive names on render. Concurrent chat edits overwrote the first editor integration; the final change was recovered in an isolated worktree based on the restored original design. Further overlapping editor work should also use isolated worktrees.

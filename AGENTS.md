# Codex project safety

- Safety level: **Low — automatic**, selected by the user on 2026-11-15; applies to Tonio until changed by the user.
- Verified remote: `https://github.com/nihalcshah/tonio.git`. Check visibility before publishing; never change access settings.

# Project guidance

- React 18 / Create React App; routes are `/`, `/customize`, `/recolor`, and `/agents`.
- Run `npm start` for development, `CI=true npm run build` for production, and `CI=true npm test -- --watchAll=false --runInBand` for tests.
- Photo processing is local. Keep original pixel data separate from the preview, and export the edited result even while comparison is active.
- Swatch preview and export must share `renderTone` in `src/imageExport.js`.

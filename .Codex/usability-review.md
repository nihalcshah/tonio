# Tonio app and usability review — 2026-11-15

## Outcome and scope

The original visual design is retained. The first UX pass changed the landing page and editor layout too broadly; the user rejected that direction. The original landing page, large color hero, shade sidebar, cards, typography, and orange export controls were restored. Functional fixes now live within those existing screens.

This review examined the React source, routes, image renderer, local-photo processing, configuration, dependencies, and tests, with browser checks of the principal workflows. It is an engineering and usability audit, not a user study or proof of product-market fit.

## Product value

Tone.io has two useful jobs: produce a reusable color artifact (PNG, CSS palette, or recipe link), and test a replacement color on a surface in a photo. Its strengths are immediate use, no account requirement, local photo processing, and repeatable exports. More features alone will not establish value; test whether people actually reuse the saved outputs or make a design decision from a recolored photo.

## Findings and fixes

| Area | Finding | Final change |
| --- | --- | --- |
| Initial startup | Checkout imported a missing image-export module | Integrated the completed image API release; preview/export share its renderer |
| Color controls | Picker tabs depended on global DOM initialization | All five original picker modes retained, controlled by React; keyboard arrow navigation |
| Manual color entry | No direct validated input in the main picker | Small hex-entry form inside the existing Change Color dialog with actionable validation |
| Readability | No text-contrast guidance | Black/white contrast ratios inside the same dialog; normal-text 4.5:1 threshold |
| Dialog accessibility | Div overlays lacked focus trap and Escape behavior | Native dialogs retain the original visual panels while providing browser-managed focus/Escape |
| Radio controls | Hidden radios were not keyboard reachable and selected styles could disagree | Focusable visually-hidden radios, accessible names, controlled checked state |
| Discovery | Hover-only generic Select buttons | Focus-visible actions with color-specific accessible names; random choices called Explore Tones |
| Export | Repeated export actions could overlap | Export controls disabled while rendering; shared recipe/PNG behavior retained |
| Photo onboarding | Required a personal image to try the feature | Optional local sample room in the existing upload panel |
| File handling | No size guard; same file could not be reselected | 25 MB guard, input reset, load/error feedback; supported-format and 1100px export guidance |
| Touch input | Subtract required Shift-click | Add/remove modes in the existing selection panel; Shift-click retained |
| Keyboard input | Canvas-only selection had no keyboard equivalent | Optional coordinate form under “Select with a keyboard” |
| Comparison | Mouse-only hold control | Original/edited toggle accessible by touch and keyboard; export remains the edited image |
| Recolor fidelity | Target lightness discarded, making black/white/gray nearly identical | Target brightness contributes to shaded output, preserving original luminance variation |
| Performance | Flood-fill masks rebuilt on every color change | Selection-mask cache keyed by original image, selections, tolerance, and global mode |
| Preview layout | Photo area stretched to match a tall sidebar | Top-aligned preview prevents large blank space |
| Routing | Missing pages and unexpected errors showed router internals | Useful not-found and recovery screens; existing /agents, /image, /serverless retained |
| Branding | Install metadata still named React App | Tone.io manifest name and useful description |
| Dependencies | Initial npm audit: 82 advisories including 5 critical | Compatible fixes plus patched React Router 7.18.5: 34 remain, 0 critical; direct remaining flagged dependency is react-scripts |

## Verification

- Production compilation is required with `CI=true npm run build`.
- Tests cover recipe validation/SVG escaping, editor state and exports, hex input, contrast, recolor queue ordering, original comparison/export, invalid input, neutral brightness, subtraction, and undo/reset.
- Browser checks confirmed the restored design, 390px page width without horizontal overflow, React picker tabs, hex updates, contrast values, native dialog dismissal, sample loading, keyboard point selection, and original/edited comparison.
- Mocked canvas tests are not a substitute for real pixel rendering. The separate image API release also performed production browser/render/download checks; preserve its shared renderer.

## Remaining limitations and priorities

1. Recoloring uses RGB-tolerance flood fill, not semantic object selection. Similar colors can bleed into adjoining objects; hair, reflections, transparent materials, and textured edges need manual tolerance/subtraction. Do not market it as accurate paint simulation.
2. Photo output is capped at 1100 pixels on the longest side. Full-resolution export needs a separate worker/downsample pipeline and measured memory budgets; simply removing the cap risks freezing the UI.
3. Browser image decoding occurs before resizing. The file-size guard does not bound decoded pixel memory. Very large or hostile images need a stronger decoding pipeline.
4. Photos are session-local. Reload/navigation does not restore the source image. A local project file with image and recipe would add recoverability without an account.
5. External fonts need network access. Default Arial export works without Google Fonts. Offline/PWA support is not promised.
6. The 34 remaining advisories (16 low, 5 moderate, 13 high) sit in the older CRA build/test dependency tree. `npm audit fix --force` proposes replacing react-scripts with 0.0.0, which would break the app; do not apply it. Migrate the toolchain in a separately verified change. Development servers should remain bound to localhost.
7. Test real usage before expanding scope: can someone find a color, export a useful swatch/CSS palette, recolor a surface, and explain what decision the output helped them make?

## Project retrospective

Preserve the user's existing visual design during functional work. Do not infer permission for a visual overhaul from a broad usability request. Two concurrent chats initially edited the same checkout; file ownership and release order were coordinated. A .cjs renderer passed Jest but CRA emitted it as a media URL, crashing the editor; real browser checks caught this. The final renderer uses normal ESM. Keep browser verification in addition to component mocks.

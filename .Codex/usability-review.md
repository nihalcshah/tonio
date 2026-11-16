# Tonio usability review — 2026-11-15

## Product assessment

Tone.io has a useful small-tool premise: turn a color into a reusable design artifact, or test a new surface color in a local photo. The original landing copy did not explain either output clearly. The two tools lacked consistent navigation, and discovery, picker, typography, and export controls were split across hidden panels. Useful outcomes are now explicit: inspect color values and contrast, export a swatch/CSS palette, save a recipe link, or compare and download a recolored photo.

This review inspected the complete React source, routes, configuration, export code, and tests, then exercised the main browser flows. It is an engineering/UX audit, not a user study or evidence of product-market fit.

## Fixed

| Area | Finding | Result |
| --- | --- | --- |
| Startup | Initial checkout referenced a missing imageExport module | Integrated the parallel image API release and shared preview/export renderer |
| Navigation | Editors linked home but not to each other; unknown paths showed router internals | Shared navigation and a usable not-found page; retained /agents, /image, /serverless |
| Onboarding | Vague “Develop Your Tones” and decorative hero | Clear tool descriptions, output-oriented actions, local-photo privacy statement |
| Color input | Picker modes depended on Flowbite global DOM initialization and mobile duplicated controls | One controlled responsive picker, native color input, validated manual hex input |
| Color utility | No text-readability guidance | Black/white WCAG contrast ratios with AA normal/large-text labels |
| Discovery | Random cards required hover to reveal generic Select buttons | Focus-visible controls with color-specific accessible names; shade sidebar and inline discovery |
| Export | Preview/PNG could diverge; hidden styles/fonts were not reflected by radio state | One renderer retained from image API release; controlled style/font/size options and explicit square download |
| Accessibility | Hidden radios were unreachable; div modals lacked focus trap/Escape behavior | Native dialogs and keyboard-focusable radio inputs; visible focus and reduced-motion support |
| Photo onboarding | Required a personal image to understand the tool | Local sample-room illustration, file limit guidance, load/error states |
| Photo input | No file size guard; same file could not be selected twice | 25 MB pre-decode guard, reset input after selection, retained decode validation |
| Photo selection | Subtraction required Shift-click, unavailable on touch | Add/remove modes, keyboard coordinate form, undo/reset preserved |
| Comparison | Mouse-only hold control | Persistent accessible original/edited toggle; export still always uses edited pixels |
| Recolor fidelity | Target lightness was discarded; black/white/gray targets looked alike | Target lightness now contributes to shaded output while preserving source luminance variation |
| Recolor performance | Flood-fill masks recomputed for every color change | Cached selection mask keyed by original, selection, tolerance, and global mode |
| Layout | Photo preview stretched to sidebar height, leaving a large blank area | Preview aligns to the top; responsive layout retains all controls |
| Branding | Install metadata still said React App | Tone.io install name and useful description |
| Tests | Starter test asserted absent Learn React link | Real home, hex-validation, contrast, recipe, selection, comparison, and neutral-color regressions |

## Important limits and next opportunities

- Recoloring is RGB-tolerance flood fill, not semantic object selection. Similar colors can bleed into adjacent objects; reflections, hair, transparent surfaces, and textured boundaries need manual tolerance/subtraction. State this clearly rather than promising realistic paint simulation.
- Photo output remains limited to 1100 pixels on its longest side. This is disclosed before upload. High-resolution export needs a separate full-resolution pipeline; removing the cap would make main-thread processing expensive.
- Images are decoded by the browser before resizing. A 25 MB file limit is not a decoded-pixel memory bound. A worker/downsample pipeline and measured budgets are the next reliability investment for very large or hostile images.
- Selected photos are session-local and not restored after navigation/reload. Recipes/links preserve swatches, not source photos. A local project format would add recoverability without an account.
- External display fonts require network access. Default exported Arial works without Google Fonts. Errors should direct the user to a system font. No offline/PWA guarantee is made.
- No account, billing, analytics, or remote photo upload was added. Validate repeat use with real users before expanding scope. The strongest next user test is: select a color, export a useful card/CSS palette, recolor a surface, and explain whether the result informed a decision.
- CRA emits existing maintenance warnings (outdated Browserslist and Babel preset dependency). Production compilation must still pass with CI=true. Toolchain migration deserves a separate controlled change.

## Integration and retrospective

Two chats were editing the same root concurrently. Ownership was coordinated with explicit user approval; the image API chat isolated and released commit 96dd64e first. The UX work preserves the production routes, deterministic APIs, permanent shades, RGB/HSL readout, and CSS export. Random discovery is described as exploration rather than falsely claiming random colors are similar.

A .cjs renderer initially passed Jest but was emitted as a media URL by CRA, crashing the actual editor. Browser verification caught it; the final image API release uses normal ESM. Test browser startup and actual image rendering in addition to mocked component tests. A browser download-event wait stalled; subsequent checks use bounded operations and visible export results.

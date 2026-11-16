# Tone.io by CJ Shah
## A Tone-matching and tone finder system built with React ([tone.cjshah.org](tone.cjshah.org))
<img width="952" alt="image" src="https://github.com/user-attachments/assets/77533f7b-31a2-4439-9838-2cb995410518">

### Find Randomized Colors (Updated Daily)
<div style="display:flex;">
<img width="500" alt="image" src="https://github.com/user-attachments/assets/27b9c2b0-cd93-4da9-96ef-8a85cb71049c">

<div>Color Selection: You can choose from a variety of colors like *Dove Gray*, *Ebony Clay*, *Screamin’ Green*, and more.</div>
</div>
<br/>
<hr/>
<img t width="500" alt="image" src="https://github.com/user-attachments/assets/9fc7fd90-d123-4f74-8b25-7734e29ea9af">

## Agent image access

See `/agents` or `/llms.txt` on the live site. `/api/image?color=%234f46e5&style=square&size=1024` returns a standalone SVG directly. `/image` accepts the same query and exposes an inspectable PNG plus `window.tonioImage.ready`. The normal `/customize` editor exposes `window.tonio` for configuration, state, preview, PNG export, and fully specified permalinks. `/recolor` exposes `window.tonioRecolor` for loading, selections, matching, undo/reset, comparison, and PNG export. Both interfaces use the same rendering paths as their UI.

Run `npm start`, `npm run build`, and `CI=true npm test -- --watchAll=false --runInBand`. Netlify builds `build/` and the function in `netlify/functions`; preserve the `/api/image` redirect before the SPA fallback. Explicit output dimensions and loaded fonts make PNG exports repeatable within a browser/font environment; portable SVG font appearance depends on the viewer's installed fonts.

import React, { useEffect, useState } from 'react';
import { normalizeTone, renderTone } from './imageExport';

export function ImageView() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const api = { version: 1, status: 'loading' };
    window.tonioImage = api;
    api.ready = renderTone(Object.fromEntries(new URLSearchParams(window.location.search))).then(value => {
      api.status = 'ready'; api.result = value;
      if (active) setResult(value);
      return value;
    }).catch(reason => { api.status = 'error'; api.error = reason.message; if (active) setError(reason.message); return null; });
    return () => { active = false; if (window.tonioImage === api) delete window.tonioImage; };
  }, []);
  return <main className="min-h-screen p-6 flex flex-col items-center gap-4">
    {error ? <p role="alert">{error}</p> : result ? <>
      <img id="tone-image" src={result.dataUrl} width={result.width} height={result.height} style={{ maxWidth: '100%', maxHeight: '75vh', width: 'auto', height: 'auto' }} alt={`${result.options.name} (${result.options.color}), ${result.options.style}`} />
      <a className="underline" download={`tone-${result.options.color.slice(1)}-${result.options.style}.png`} href={result.dataUrl}>Download PNG · {result.width} × {result.height}</a>
    </> : <p role="status">Rendering image…</p>}
    <a href="/customize" className="underline">Open editor</a><a href="/agents" className="underline">Image API guide</a>
  </main>;
}

export default function AgentImages() {
  const sample = normalizeTone({ color: '#4f46e5', name: 'Royal Blue', style: 'square', size: 1024 });
  const query = new URLSearchParams(sample).toString();
  return <main className="max-w-3xl mx-auto p-6 space-y-6 leading-relaxed">
    <a href="/" className="font-display text-2xl font-bold">Tone.io</a>
    <h1 className="text-4xl font-bold">Images for people and agents</h1>
    <p>Choose explicit settings, inspect the image, and reuse the same recipe. No account or API key required.</p>
    <div className="flex flex-wrap gap-4"><a className="underline" href={`/image?${query}`}>Inspect square PNG</a><a className="underline" href={`/api/image?${query}`}>Open direct SVG</a><a className="underline" href={`/customize?${query}`}>Edit this recipe</a><a className="underline" href="/recolor">Recolor a photo</a></div>
    <h2 className="text-2xl font-bold">Fetch an image directly</h2>
    <pre className="p-4 bg-white rounded-xl overflow-auto text-sm">{`GET /api/image?color=%234f46e5&style=square&size=1024\nGET /image?color=%234f46e5&style=square&size=1024`}</pre>
    <p><code>/api/image</code> returns standalone SVG with text, an image content type, and CORS enabled. <code>/image</code> renders a PNG in an ordinary image element: await <code>window.tonioImage.ready</code>, then read <code>window.tonioImage.result.dataUrl</code>. If rendering fails, status is <code>error</code> and <code>error</code> explains why. This page requires a browser; fetching its HTML does not return PNG bytes.</p>
    <h2 className="text-2xl font-bold">Recipe options</h2>
    <div className="overflow-auto"><table className="w-full text-left bg-white"><thead><tr><th className="p-2">Option</th><th>Values / default</th></tr></thead><tbody>
      {[
        ['color', '#RGB or #RRGGBB / #4f46e5 (URL encode # as %23)'],
        ['style', 'outlined, croptop, buzzcut, square / square'],
        ['name', 'Label, up to 120 characters / color name'],
        ['size', 'Output width, integer 128–4096 / 1024; square gives equal height'],
        ['fontSize', '8–32 pixels at base width 288 / 14; scales with output'],
        ['font', 'Browser PNG: Google Fonts family or system font / Arial. HTTP SVG: Arial, Helvetica, Georgia, Verdana, monospace, serif, sans-serif.'],
      ].map(([key, value]) => <tr key={key} className="border-t"><td className="p-2 font-mono">{key}</td><td>{value}</td></tr>)}
    </tbody></table></div>
    <p>All settings are explicit in editor permalinks. No clock, random seed, viewport, or device pixel ratio affects exports. PNGs repeat pixel-for-pixel with the same recipe, fonts, and browser environment. Font rasterization can differ between platforms; Google Fonts requires network access. Standalone SVG uses the viewer’s installed fonts.</p>
    <h2 className="text-2xl font-bold">Control the normal editor</h2>
    <p>On <a className="underline" href="/customize">/customize</a>, the same controls and exports are available through the versioned browser API. Returned data URLs can be saved or loaded into an image viewer.</p>
    <pre className="p-4 bg-white rounded-xl overflow-auto text-sm">{`window.tonio.getState()\nwindow.tonio.configure({color:'#4f46e5', style:'square', font:'Arial'})\nconst image = await window.tonio.exportImage({size:1024})\n// {dataUrl, mimeType, width, height, options}\nawait window.tonio.preview() // inspect exported image in editor\nwindow.tonio.permalink() // all current recipe settings`}</pre>
    <h2 className="text-2xl font-bold">Recolor photos</h2>
    <p>On <a className="underline" href="/recolor">/recolor</a>, load a local Blob or data URL and use the same selection, tolerance, global matching, comparison, undo, reset, and export operations as the UI. Coordinates refer to the processed original image (maximum dimension 1100), reported by state. Calls are serialized and await rendering.</p>
    <pre className="p-4 bg-white rounded-xl overflow-auto text-sm">{`await window.tonioRecolor.ready()\nawait window.tonioRecolor.load(blobOrImageDataUrl)\nawait window.tonioRecolor.configure({color:'#4f46e5', tolerance:35, globalMatch:false})\nawait window.tonioRecolor.select({x:100, y:120, mode:'add'})\nawait window.tonioRecolor.select({x:110, y:120, mode:'subtract'})\nwindow.tonioRecolor.state()\nawait window.tonioRecolor.undo()\nawait window.tonioRecolor.compare(true)\nconst image = await window.tonioRecolor.export()\n// {dataUrl, mimeType, width, height, recipe, original}\n// compare does not change export; export({original:true}) gets source\nawait window.tonioRecolor.reset()`}</pre>
    <p>Keep the source image and exported recipe to repeat a recolor: reload the source, configure the saved settings, and replay selections in order. Processing stays in your browser.</p>
    <a className="underline" href="/llms.txt">Plain text agent guide</a>
  </main>;
}

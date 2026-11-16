const path = require('path');
const fs = require('fs/promises');
const { createHash } = require('crypto');

// Ship fonts explicitly: function hosts need not have system fonts installed.
process.env.FONTCONFIG_FILE = path.join(process.cwd(), 'netlify/fonts/fonts.conf');
const sharp = require('sharp');
const fonts = new Map();
const aliases = { Georgia: 'Noto Serif', Verdana: 'Noto Sans', 'Courier New': 'Noto Sans Mono', serif: 'Noto Serif', monospace: 'Noto Sans Mono' };

async function fetchFont(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: 'error' });
  if (!response.ok) throw new Error('Font unavailable. Try Arial or retry.');
  return response;
}

async function loadFont(requested) {
  if (['Arial', 'Helvetica', 'sans-serif'].includes(requested)) return requested;
  const family = aliases[requested] || requested;
  if (!fonts.has(family)) {
    // Bound font registrations and temporary files per warm function instance.
    if (fonts.size >= 64) throw new Error('Font capacity reached. Try Arial or retry later.');
    fonts.set(family, (async () => {
      const response = await fetchFont(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700`);
      const css = await response.text();
      const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(match => match[1]))];
      if (!urls.length || urls.length > 4) throw new Error('Font unavailable. Try Arial.');
      const directory = '/tmp/tonio-fonts';
      await fs.mkdir(directory, { recursive: true });
      for (const url of urls) {
        const font = await fetchFont(url);
        const bytes = Buffer.from(await font.arrayBuffer());
        if (bytes.length > 2000000) throw new Error('Font file is too large. Try Arial.');
        const file = path.join(directory, `${createHash('sha256').update(url).digest('hex')}.ttf`);
        await fs.writeFile(file, bytes);
        // Pango registers the font file for subsequent SVG rendering in this process.
        await sharp({ text: { text: 'A', font: `${family} 12`, fontfile: file } }).png().toBuffer();
      }
      return family;
    })().catch(error => { fonts.delete(family); throw error; }));
  }
  return fonts.get(family);
}

async function rasterizeSvg(svg, options) {
  const family = await loadFont(options.font);
  if (family !== options.font) svg = svg.replace(/font-family="[^"]*"/, `font-family="${family}, Arial, sans-serif"`);
  // Match Canvas fillText: preserve natural glyph width and shrink only on overflow.
  // The portable SVG endpoint's estimated textLength is not a font measurement.
  const labels = [...svg.matchAll(/<text([^>]*)>([^<]*)<\/text>/g)];
  for (const [index, [label, attributes, text]] of labels.entries()) {
    const maxWidth = index === 0 ? 104 : 152;
    let measuredWidth = 0;
    if (text) {
      const measured = await sharp({ text: { text, font: `${family} ${index === 0 ? '' : 'Bold '}${options.fontSize * 4}` } }).metadata();
      measuredWidth = measured.width / 4;
    }
    const fitting = measuredWidth > maxWidth ? ` textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs"` : '';
    svg = svg.replace(label, `<text${attributes.replace(/ textLength="[^"]*" lengthAdjust="[^"]*"/, '')}${fitting}>${text}</text>`);
  }
  return sharp(Buffer.from(svg), { limitInputPixels: 26000000 }).png().toBuffer();
}

module.exports = { rasterizeSvg };

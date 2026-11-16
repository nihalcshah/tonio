import { colorNameFor } from './colorSources';
const STYLES = ['outlined', 'croptop', 'buzzcut', 'square'];
const SYSTEM_FONTS = ['Arial', 'Helvetica', 'Georgia', 'Verdana', 'Courier New', 'monospace', 'serif', 'sans-serif'];
function normalizeTone(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Recipe must be an object');
  let color = String(input.color ?? '#4f46e5');
  if (/^#[\da-f]{3}$/i.test(color)) color = '#' + color.slice(1).split('').map(c => c + c).join('');
  if (!/^#[\da-f]{6}$/i.test(color)) throw new Error('color must be #RGB or #RRGGBB');
  color = color.toLowerCase();
  const style = input.style ?? 'square';
  if (!STYLES.includes(style)) throw new Error('style must be outlined, croptop, buzzcut, or square');
  const size = Number(input.size ?? 1024), fontSize = Number(input.fontSize ?? 14);
  if (!Number.isInteger(size) || size < 128 || size > 4096) throw new Error('size must be an integer from 128 to 4096');
  if (!Number.isFinite(fontSize) || fontSize < 8 || fontSize > 32) throw new Error('fontSize must be from 8 to 32');
  const source = input.source ?? 'b';
  if (!['a', 'b'].includes(source)) throw new Error('source must be a or b');
  const font = String(input.font ?? 'Arial'), name = String(input.name ?? colorNameFor(color, source));
  if (!/^[\p{L}\p{N} -]{1,80}$/u.test(font)) throw new Error('font must be a font family name');
  if (name.length > 120 || [...name].some(character => character.charCodeAt(0) < 32)) throw new Error('name must be at most 120 characters without control characters');
  return { color, name, style, font, fontSize, size, source };
}
function layoutTone(input) {
  const options = normalizeTone(input), { color, style, size } = options;
  const white = style === 'outlined' || style === 'croptop';
  // Filled swatches keep a square canvas, including the labels inside its bounds.
  const baseHeight = style === 'square' || style === 'buzzcut' ? 288 : style === 'outlined' ? 400 : 428;
  const inset = style === 'outlined' ? 16 : 0, top = style === 'outlined' ? 24 : 0;
  const rgb = color.slice(1).match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  const luminance = .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  return { options, width: size, height: Math.round(size * baseHeight / 288), baseHeight, inset, top,
    blockHeight: white ? baseHeight - top - 44 : baseHeight, ink: white || luminance > .179 ? '#000000' : '#ffffff', labelY: baseHeight - 16 };
}
const escapeXml = value => String(value).replace(/[<>&"']/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' }[c]));
function toneSvg(input) {
  const l = layoutTone(input), { color, name, font, fontSize } = l.options;
  const label = (value, x, width, bold) => `<svg x="${x}" y="${l.labelY-fontSize}" width="${width}" height="${fontSize+6}" viewBox="0 0 ${width} ${fontSize+6}"><text x="${bold?width:0}" y="${fontSize}" text-anchor="${bold?'end':'start'}" font-weight="${bold?700:400}" textLength="${Math.min(width, Math.max(1,[...value].length)*fontSize*.56)}" lengthAdjust="spacingAndGlyphs">${escapeXml(value)}</text></svg>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${l.width}" height="${l.height}" viewBox="0 0 288 ${l.baseHeight}" role="img" aria-label="${escapeXml(name)} ${color}"><title>${escapeXml(name)} ${color}</title><rect width="288" height="${l.baseHeight}" fill="white"/><rect x="${l.inset}" y="${l.top}" width="${288-l.inset*2}" height="${l.blockHeight}" fill="${color}"/><g fill="${l.ink}" font-family="${escapeXml(font)}, Arial, sans-serif" font-size="${fontSize}">${label(color,12,104,false)}${label(name,124,152,true)}</g></svg>`;
}
const fontLoads = new Map();
async function loadFont(font) {
  if (SYSTEM_FONTS.includes(font)) return;
  if (!fontLoads.has(font)) fontLoads.set(font, (async () => {
    const link = document.createElement('link'); link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;700&display=block`;
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Font ${font} did not load. Try Arial or retry.`)),12000);
      link.onload = () => { clearTimeout(timer); resolve(); };
      link.onerror = () => { clearTimeout(timer); reject(new Error(`Font ${font} could not load. Try Arial.`)); };
      document.head.appendChild(link);
    });
    const loaded = await document.fonts.load(`14px "${font}"`), bold = await document.fonts.load(`700 14px "${font}"`);
    if (!loaded.length || !bold.length) throw new Error(`Font ${font} is unavailable. Try Arial.`);
    await document.fonts.ready;
  })().catch(error => { fontLoads.delete(font); throw error; }));
  await fontLoads.get(font);
}
function pngUrl(input = {}) {
  return `/api/image.png?${new URLSearchParams(normalizeTone(input))}`;
}
async function renderTone(input = {}, { rasterizeSvg } = {}) {
  const l = layoutTone(input), { color, name, font, fontSize } = l.options;
  // The HTTP renderer uses the same recipe, geometry, contrast and labels without a DOM.
  if (rasterizeSvg) return { buffer: await rasterizeSvg(toneSvg(l.options), l.options), url: pngUrl(l.options), mimeType: 'image/png', width: l.width, height: l.height, options: l.options };
  await loadFont(font);
  const canvas = document.createElement('canvas'); canvas.width=l.width; canvas.height=l.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas rendering is unavailable');
  ctx.scale(l.width/288,l.height/l.baseHeight);
  ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,288,l.baseHeight);
  ctx.fillStyle=color; ctx.fillRect(l.inset,l.top,288-2*l.inset,l.blockHeight);
  ctx.fillStyle=l.ink; ctx.textBaseline='alphabetic';
  ctx.font=`400 ${fontSize}px "${font}", Arial, sans-serif`; ctx.fillText(color,12,l.labelY,104);
  ctx.font=`700 ${fontSize}px "${font}", Arial, sans-serif`; ctx.textAlign='right'; ctx.fillText(name,276,l.labelY,152);
  return { dataUrl:canvas.toDataURL('image/png'), url: pngUrl(l.options), mimeType:'image/png', width:l.width, height:l.height, options:l.options };
}
export { STYLES, normalizeTone, layoutTone, toneSvg, renderTone, pngUrl };

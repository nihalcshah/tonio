import Color from 'colorjs.io';
import { GetColorName } from 'hex-color-to-color-name';
import shortColors from './data/shortColors.json';
import fontCatalog from './data/fontCatalog.json';

import baselineFonts from './data/baselineFonts.json';
export { baselineFonts };
export const recommendedFonts = [...new Set([...baselineFonts, 'Arial', 'Georgia', 'Courier New', ...fontCatalog.map(font => font.family)])].sort();
export { fontCatalog };

let candidates;
const exactNames = new Map(shortColors.map(color => [color.hex.toLowerCase(), color.name]));
const cache = new Map();

export function colorNameFor(hex, source = 'b') {
    if (source === 'a') return GetColorName(hex);
    const normalized = new Color(hex);
    const key = '#' + normalized.to('srgb').coords.map(channel => Math.round(channel * 255).toString(16).padStart(2, '0')).join('');
    if (exactNames.has(key)) return exactNames.get(key);
    if (cache.has(key)) return cache.get(key);
    // Convert the reference list once; OKLab distance is perceptual and fast enough for a picker.
    if (!candidates) candidates = shortColors.map(color => ({ name: color.name, coords: new Color(color.hex).to('oklab').coords }));
    const coords = normalized.to('oklab').coords;
    let closest, distance = Infinity;
    for (const candidate of candidates) {
        const next = candidate.coords.reduce((sum, channel, i) => sum + (channel - coords[i]) ** 2, 0);
        if (next < distance) { closest = candidate.name; distance = next; }
    }
    if (cache.size >= 512) cache.clear();
    cache.set(key, closest);
    return closest;
}

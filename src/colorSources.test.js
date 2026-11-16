import Color from 'colorjs.io';
import { GetColorName } from 'hex-color-to-color-name';
import { colorNameFor, baselineFonts, recommendedFonts } from './colorSources';
import shortColors from './data/shortColors.json';
import { normalizeTone } from './imageExport';

test('keeps A unchanged and gives exact short-list names priority in B', () => {
    for (const hex of ['#4f46e5', '#abcdef', '#000000']) expect(colorNameFor(hex, 'a')).toBe(GetColorName(hex));
    for (const entry of [shortColors[0], ...shortColors.filter(color => ['#ffffff', '#000000'].includes(color.hex))]) {
        expect(colorNameFor(entry.hex, 'b')).toBe(entry.name);
    }
    expect(colorNameFor('#fff', 'b')).toBe(colorNameFor('#ffffff', 'b'));
});

test('B selects the perceptual nearest entry for a hex outside the list', () => {
    const hex = '#123457';
    expect(shortColors.some(color => color.hex === hex)).toBe(false);
    const color = new Color(hex);
    const expected = shortColors.reduce((best, entry) => {
        const distance = color.distance(new Color(entry.hex), 'oklab');
        return distance < best.distance ? { distance, name: entry.name } : best;
    }, { distance: Infinity });
    expect(colorNameFor(hex, 'b')).toBe(expected.name);
});

test('recipes preserve the source and explicit labels, and font B expands A', () => {
    expect(normalizeTone({ color: '#123457' }).name).toBe(colorNameFor('#123457', 'b'));
    expect(normalizeTone({ source: 'b', name: 'My label' })).toMatchObject({ source: 'b', name: 'My label' });
    expect(() => normalizeTone({ source: 'c' })).toThrow('source');
    expect(recommendedFonts.length).toBeGreaterThan(baselineFonts.length);
    baselineFonts.forEach(font => expect(recommendedFonts).toContain(font));
});

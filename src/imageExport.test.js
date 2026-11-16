const { normalizeTone, layoutTone, toneSvg, renderTone } = require('./imageExport');
const { handler } = require('../netlify/functions/image');

test('normalizes repeatable recipes and rejects malformed or oversized input', () => {
  expect(normalizeTone({ color: '#AbC' }).color).toBe('#aabbcc');
  expect(layoutTone({ style: 'square', size: 1024 })).toMatchObject({ width: 1024, height: 1024 });
  for (const recipe of [{ color: 'red' }, { style: 'unknown' }, { size: 99999 }, { size: 128.1 }, { fontSize: 0 }, { name: 'x'.repeat(121) }, { font: 'Arial; color:red' }]) {
    expect(() => normalizeTone(recipe)).toThrow();
  }
});

test.each([
  ['square', '#4F46E5', 'Royal Blue'],
  ['square', '#8B1E2D', 'Old Brick'],
  ['buzzcut', '#4F46E5', 'Royal Blue'],
  ['buzzcut', '#8B1E2D', 'Old Brick'],
])('%s PNG preserves DM Sans MD labels on a square canvas for %s', async (style, color, name) => {
  const labels = [];
  const ctx = {
    scale: jest.fn(), fillRect: jest.fn(),
    fillText: jest.fn(function (text, x, y, maxWidth) {
      labels.push({ text, x, y, maxWidth, font: this.font, ink: this.fillStyle });
    }),
  };
  const originalFonts = document.fonts;
  Object.defineProperty(document, 'fonts', { configurable: true, value: {
    load: jest.fn().mockResolvedValue([{}]), ready: Promise.resolve(),
  } });
  const context = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);
  const encode = jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,test');
  const append = jest.spyOn(document.head, 'appendChild').mockImplementation(link => {
    Promise.resolve().then(() => link.onload());
    return link;
  });
  try {
    const image = await renderTone({ color, name, style, font: 'DM Sans', fontSize: 16, size: 512 });
    expect(image).toMatchObject({ width: 512, height: 512, mimeType: 'image/png' });
    expect(labels).toEqual([
      { text: color.toLowerCase(), x: 12, y: 272, maxWidth: 104, font: '400 16px "DM Sans", Arial, sans-serif', ink: '#ffffff' },
      { text: name, x: 276, y: 272, maxWidth: 152, font: '700 16px "DM Sans", Arial, sans-serif', ink: '#ffffff' },
    ]);
    expect(encode).toHaveBeenCalledWith('image/png');
    expect(toneSvg({ color, name, style, font: 'DM Sans', fontSize: 16, size: 512 })).toContain('width="512" height="512"');
  } finally {
    context.mockRestore(); encode.mockRestore(); append.mockRestore();
    Object.defineProperty(document, 'fonts', { configurable: true, value: originalFonts });
  }
});

test('direct images are deterministic, correctly escaped and use contrasting labels', async () => {
  const recipe = { color: '#000000', name: '<script>&"\'' };
  expect(toneSvg(recipe)).toBe(toneSvg(recipe));
  expect(toneSvg(recipe)).toContain('&lt;script&gt;&amp;&quot;&apos;');
  expect(toneSvg(recipe)).not.toContain('<script>');
  expect(layoutTone(recipe).ink).toBe('#ffffff');
  expect(layoutTone({ color: '#ffffff' }).ink).toBe('#000000');
  expect(layoutTone({ color: '#000000', style: 'outlined' }).ink).toBe('#000000');
  const response = await handler({ httpMethod: 'GET', queryStringParameters: recipe });
  expect(response.statusCode).toBe(200);
  expect(response.headers['Content-Type']).toContain('image/svg+xml');
  expect(response.body).toContain('width="1024" height="1024"');
  expect((await handler({ httpMethod: 'GET', queryStringParameters: { color: 'bad' } })).statusCode).toBe(400);
  expect((await handler({ httpMethod: 'POST' })).statusCode).toBe(405);
  expect((await handler({ httpMethod: 'HEAD' })).body).toBe('');
});

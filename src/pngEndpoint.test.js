/** @jest-environment node */
const sharp = require('sharp');
const { handler } = require('../netlify/functions/image-png');
const { pngUrl } = require('./imageExport');

test.each(['square', 'buzzcut', 'outlined', 'croptop'])('HTTP %s export contains real PNG pixels, dimensions and labels', async style => {
  const response = await handler({ httpMethod: 'GET', queryStringParameters: { color: '#8b1e2d', style, size: '1024', name: 'Old Brick' } });
  expect(response.statusCode).toBe(200);
  expect(response.headers['Content-Type']).toBe('image/png');
  expect(response.headers['Content-Disposition']).toBe(`attachment; filename="tone-8b1e2d-${style}.png"`);
  expect(response.isBase64Encoded).toBe(true);
  const bytes = Buffer.from(response.body, 'base64');
  expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  expect(Number(response.headers['Content-Length'])).toBe(bytes.length);
  const height = { square: 1024, buzzcut: 1024, outlined: 1422, croptop: 1522 }[style];
  expect(await sharp(bytes).metadata()).toMatchObject({ format: 'png', width: 1024, height });
  const pixel = await sharp(bytes).extract({ left: 512, top: 512, width: 1, height: 1 }).removeAlpha().raw().toBuffer();
  expect([...pixel]).toEqual([139, 30, 45]);
  // Both labels produce visible glyphs at the bottom, even without host system fonts.
  for (const region of [{ left: 42, width: 370 }, { left: 441, width: 540 }]) {
    const { data, info } = await sharp(bytes).extract({ ...region, top: height - 120, height: 80 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const background = ['square', 'buzzcut'].includes(style) ? [139, 30, 45] : [255, 255, 255];
    expect(Array.from({ length: info.width * info.height }, (_, i) => background.some((value, channel) => data[i * 3 + channel] !== value)).filter(Boolean).length).toBeGreaterThan(100);
  }
});

test('HEAD is bodyless; invalid input and unsupported methods fail explicitly', async () => {
  const head = await handler({ httpMethod: 'HEAD' });
  expect(head).toMatchObject({ statusCode: 200, body: '', headers: { 'Content-Type': 'image/png' } });
  for (const queryStringParameters of [{ color: 'bad' }, { size: '4097' }, { style: 'unknown' }]) {
    expect(await handler({ httpMethod: 'GET', queryStringParameters })).toMatchObject({ statusCode: 400, headers: { 'Content-Type': 'application/json' } });
    expect(await handler({ httpMethod: 'HEAD', queryStringParameters })).toMatchObject({ statusCode: 400, body: '' });
  }
  expect(await handler({ httpMethod: 'POST' })).toMatchObject({ statusCode: 405, headers: { Allow: 'GET, HEAD' } });
});

test('download URL round trips every recipe setting with URL-safe labels', () => {
  const url = new URL(pngUrl({ color: '#8b1e2d', name: 'Brick & Wine', font: 'DM Sans', fontSize: 16, size: 512, source: 'b' }), 'https://tone.cjshah.org');
  expect(url.pathname).toBe('/api/image.png');
  expect(Object.fromEntries(url.searchParams)).toEqual({ color: '#8b1e2d', name: 'Brick & Wine', font: 'DM Sans', fontSize: '16', size: '512', source: 'b', style: 'square' });
});

test('font fetch failure returns JSON and allows a subsequent retry', async () => {
  const original = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({ ok: false });
  try {
    for (const httpMethod of ['GET', 'HEAD']) {
      const result = await handler({ httpMethod, queryStringParameters: { font: 'DM Sans' } });
      expect(result).toMatchObject({ statusCode: 502, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
      if (httpMethod === 'HEAD') expect(result.body).toBe('');
    }
    expect(global.fetch).toHaveBeenCalledTimes(2);
  } finally { global.fetch = original; }
});

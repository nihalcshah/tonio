const { normalizeTone, layoutTone, toneSvg } = require('./imageExport');
const { handler } = require('../netlify/functions/image');

test('normalizes repeatable recipes and rejects malformed or oversized input', () => {
  expect(normalizeTone({ color: '#AbC' }).color).toBe('#aabbcc');
  expect(layoutTone({ style: 'square', size: 1024 })).toMatchObject({ width: 1024, height: 1024 });
  for (const recipe of [{ color: 'red' }, { style: 'unknown' }, { size: 99999 }, { size: 128.1 }, { fontSize: 0 }, { name: 'x'.repeat(121) }, { font: 'Arial; color:red' }]) {
    expect(() => normalizeTone(recipe)).toThrow();
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

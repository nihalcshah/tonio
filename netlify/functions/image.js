const { normalizeTone, toneSvg } = require('../../src/imageExport');
exports.handler = async event => {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') return { statusCode: 405, headers: { Allow: 'GET, HEAD' }, body: 'Use GET or HEAD' };
  try {
    const options = normalizeTone(event.queryStringParameters || {});
    // Standalone SVG cannot load Google Fonts reliably. Explicitly use portable fonts.
    if (!['Arial', 'Helvetica', 'Georgia', 'Verdana', 'Courier New', 'monospace', 'serif', 'sans-serif'].includes(options.font)) throw new Error('HTTP SVG supports Arial, Helvetica, Georgia, Verdana, Courier New, monospace, serif, sans-serif. Use /image for custom-font PNG.');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*', 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': `inline; filename="tone-${options.color.slice(1)}-${options.style}.svg"` },
      body: event.httpMethod === 'HEAD' ? '' : toneSvg(options),
    };
  } catch (error) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: error.message }) };
  }
};

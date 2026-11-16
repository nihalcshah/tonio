const { normalizeTone, renderTone } = require('../../src/imageExport');
const { rasterizeSvg } = require('../lib/pngRenderer');

const headers = { 'Access-Control-Allow-Origin': '*', 'X-Content-Type-Options': 'nosniff' };
exports.handler = async event => {
  const head = event.httpMethod === 'HEAD';
  const error = (statusCode, message, extra = {}) => ({ statusCode, headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra }, body: head ? '' : JSON.stringify({ error: message }) });
  if (!['GET', 'HEAD'].includes(event.httpMethod)) return error(405, 'Use GET or HEAD', { Allow: 'GET, HEAD' });
  let options;
  try { options = normalizeTone(event.queryStringParameters || {}); }
  catch (reason) { return error(400, reason.message); }
  try {
    const { buffer } = await renderTone(options, { rasterizeSvg });
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600', 'Content-Length': String(buffer.length), 'Content-Disposition': `attachment; filename="tone-${options.color.slice(1)}-${options.style}.png"` },
      // Netlify decodes this transport envelope; HTTP clients receive raw PNG bytes.
      isBase64Encoded: true,
      body: head ? '' : buffer.toString('base64'),
    };
  } catch (reason) { return error(502, reason.message); }
};

import { render, screen } from '@testing-library/react';
import { ImageView } from './AgentImages';
import { renderTone } from './imageExport';

jest.mock('./imageExport', () => ({ ...jest.requireActual('./imageExport'), renderTone: jest.fn() }));

test('image download uses the HTTP PNG endpoint with the complete rendered recipe', async () => {
  const options = { color: '#8b1e2d', name: 'Brick & Wine', style: 'square', font: 'DM Sans', fontSize: 16, size: 1024, source: 'b' };
  renderTone.mockResolvedValue({ dataUrl: 'data:image/png;base64,c3dhdGNo', width: 1024, height: 1024, options });
  render(<ImageView />);
  const download = await screen.findByRole('link', { name: /Download PNG/ });
  const url = new URL(download.href);
  expect(url.protocol).toMatch(/^https?:$/);
  expect(url.pathname).toBe('/api/image.png');
  expect(Object.fromEntries(url.searchParams)).toEqual(Object.fromEntries(Object.entries(options).map(([key, value]) => [key, String(value)])));
  expect(screen.getByRole('img')).toHaveAttribute('src', 'data:image/png;base64,c3dhdGNo');
});

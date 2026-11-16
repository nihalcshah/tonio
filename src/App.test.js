import { render, screen } from '@testing-library/react';
import Home from './Home';

test('home exposes both image workflows and the agent guide', () => {
  render(<Home />);
  expect(screen.getByRole('link', { name: /develop your tones/i })).toHaveAttribute('href', '/customize');
  expect(screen.getByRole('link', { name: /recolor a photo/i })).toHaveAttribute('href', '/recolor');
  expect(screen.getByRole('link', { name: /agent guide/i })).toHaveAttribute('href', '/agents');
});

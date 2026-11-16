import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

test('home explains both tools and links to working destinations', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A color worth');
  expect(screen.getByRole('link', { name: /Create a swatch/ })).toHaveAttribute('href', '/customize');
  expect(screen.getByRole('link', { name: /Try a photo/ })).toHaveAttribute('href', '/recolor');
  expect(screen.getByRole('link', { name: /Image API guide/ })).toHaveAttribute('href', '/agents');
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

test('home explains both tools and links to working destinations', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText('Add Some Color to Your Life')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Develop Your Tones/ })).toHaveAttribute('href', '/customize');
  expect(screen.getByRole('link', { name: /Recolor a Photo/ })).toHaveAttribute('href', '/recolor');
  expect(screen.getByRole('link', { name: /Image API & agent guide/ })).toHaveAttribute('href', '/agents');
});

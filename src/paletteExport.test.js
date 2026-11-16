import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import Info from './Inf';
import { renderTone } from './imageExport';

jest.mock('./imageExport', () => ({
  ...jest.requireActual('./imageExport'),
  renderTone: jest.fn(),
}));
jest.mock('react-color', () => ({
  SwatchesPicker: () => null, CirclePicker: () => null, SliderPicker: () => null,
  BlockPicker: () => null, SketchPicker: () => null,
}));

afterEach(cleanup);

test.each(['cleancut', 'buzzcut'])('manual %s export preserves selected DM Sans and MD typography', async styleId => {
  window.history.replaceState({}, '', '/customize?color=%234f46e5&name=Royal+Blue&size=512');
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  renderTone.mockReset().mockResolvedValue({ dataUrl: 'data:image/png;base64,c3dhdGNo', width: 512, height: 512 });
  const { container } = render(<Info />);
  fireEvent.click(screen.getByRole('button', { name: 'Style & Font' }));
  fireEvent.click(container.querySelector(`#${styleId}`));
  fireEvent.click(screen.getByRole('radio', { name: /DM Sans/ }));
  fireEvent.click(screen.getByLabelText('MD', { selector: 'input' }));
  fireEvent.click(screen.getByRole('button', { name: 'Done' }));
  fireEvent.click(screen.getByRole('button', { name: 'Export Palette' }));
  await waitFor(() => expect(screen.getByRole('dialog', { name: 'Export image' })).toHaveAttribute('open'));
  expect(renderTone).toHaveBeenLastCalledWith(expect.objectContaining({
    color: '#4f46e5', name: 'Royal Blue', style: styleId === 'cleancut' ? 'square' : 'buzzcut',
    font: 'DM Sans', fontSize: 16, size: 512,
  }));
});

import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import Info from './Inf';
import { renderTone } from './imageExport';

jest.mock('./imageExport', () => ({
    ...jest.requireActual('./imageExport'),
    renderTone: jest.fn(),
}));
jest.mock('react-color', () => ({
    SwatchesPicker: () => null,
    CirclePicker: () => null,
    SliderPicker: () => null,
    BlockPicker: () => null,
    SketchPicker: () => null,
}));

beforeEach(() => {
    window.history.replaceState({}, '', '/customize');
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
    renderTone.mockReset().mockResolvedValue({ dataUrl: 'data:image/png;base64,c3dhdGNo', width: 1024, height: 1024 });
});
afterEach(cleanup);

test('recommended sources are the default and persist in exports and links', async () => {
    render(<MemoryRouter><Info /></MemoryRouter>);
    await screen.findByAltText(/Warm Blue/);
    expect(window.tonio.getState()).toMatchObject({ source: 'b', name: 'Warm Blue' });
    expect(new URL(window.tonio.permalink()).searchParams.get('source')).toBe('b');
    await window.tonio.exportImage();
    expect(renderTone).toHaveBeenLastCalledWith(window.tonio.getState());
});

test('saved labels survive and the recommended font catalog can be searched', async () => {
    window.history.replaceState({}, '', '/customize?color=%23123457&name=Saved');
    render(<MemoryRouter><Info /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Image style and font' }));
    fireEvent.change(screen.getByLabelText('Search fonts'), { target: { value: 'Roboto' } });
    expect(screen.getByRole('option', { name: 'Roboto' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Montserrat' })).not.toBeInTheDocument();
    await screen.findByAltText(/Saved/);
});

test('square shortcut exports a 1024 square directly and selects its preview', async () => {
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<MemoryRouter><Info /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Download square PNG/ }));
    await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
    expect(renderTone).toHaveBeenCalledWith(expect.objectContaining({ style: 'square', size: 1024 }));
    expect(screen.getByLabelText('Image style')).toHaveValue('3');
    expect(screen.getByRole('link', { name: /Repeat this image/ })).toHaveAttribute('href', expect.stringContaining('style=square'));
    click.mockRestore();
});

test('agent configuration and permalink preserve all explicit image settings', async () => {
    window.history.replaceState({}, '', '/customize?color=%23abcdef&style=square&font=Arial&fontSize=18&size=512&name=Example');
    render(<MemoryRouter><Info /></MemoryRouter>);
    await screen.findByAltText(/Example/);
    expect(window.tonio.getState()).toEqual(expect.objectContaining({ color: '#abcdef', style: 'square', font: 'Arial', fontSize: 18, size: 512, name: 'Example' }));
    const result = await window.tonio.exportImage();
    expect(result.dataUrl).toMatch(/^data:image\/png/);
    expect(renderTone).toHaveBeenLastCalledWith(window.tonio.getState());
    const url = new URL(window.tonio.permalink());
    expect(url.searchParams.get('name')).toBe('Example');
    expect(url.searchParams.get('size')).toBe('512');
});

 test('validates manual hex input and keeps color contrast tied to the current color', async () => {
    render(<MemoryRouter><Info /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Change Color', exact: true }));
    const input = screen.getByLabelText('Hex color');
    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByRole('dialog', { name: 'Change color' })).toHaveTextContent(/color must/);
    fireEvent.change(input, { target: { value: '#ffffff' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(window.tonio.getState().color).toBe('#ffffff'));
    expect(screen.getByText(/Text contrast:/)).toHaveTextContent('black 21.00:1; white 1.00:1');
 });

import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import PhotoRecolor from './PhotoRecolor';

jest.mock('react-color', () => ({ SketchPicker: () => null }));

const pixels = [100, 100, 100, 255, 20, 180, 20, 255];
let contexts;
let NativeImage;
let NativeImageData;

beforeEach(() => {
    contexts = new WeakMap();
    NativeImage = window.Image;
    NativeImageData = window.ImageData;
    window.Image = class {
        width = 2;
        height = 1;
        set src(value) { Promise.resolve().then(() => this.onload()); }
    };
    window.ImageData = class {
        constructor(data, width, height) { this.data = data; this.width = width; this.height = height; }
    };
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function () {
        if (!contexts.has(this)) contexts.set(this, {
            data: pixels.slice(),
            drawImage() { this.data = pixels.slice(); },
            getImageData(x, y, width, height) { return new ImageData(new Uint8ClampedArray(this.data), width, height); },
            putImageData(image) { this.data = Array.from(image.data); },
        });
        return contexts.get(this);
    });
    jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(function () {
        return 'data:image/png;base64,' + btoa(JSON.stringify(contexts.get(this).data));
    });
});

afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
    window.Image = NativeImage;
    window.ImageData = NativeImageData;
});

test('queued load/configure/select/export reads current settings and preserves original comparison', async () => {
    render(<MemoryRouter><PhotoRecolor /></MemoryRouter>);
    const api = window.tonioRecolor;
    let exported;
    await act(async () => {
        // Do not await individual mutations: queue ordering is part of the API.
        const loaded = api.load('data:image/png;base64,fixture');
        const configured = api.configure({ color: '#ff0000', tolerance: 1, globalMatch: false });
        const selected = api.select({ x: 0, y: 0 });
        const output = api.export();
        await Promise.all([loaded, configured, selected]);
        exported = await output;
    });
    expect(exported).toMatchObject({ width: 2, height: 1, mimeType: 'image/png', original: false });
    const recolored = JSON.parse(atob(exported.dataUrl.split(',')[1]));
    expect(recolored.slice(0, 4)).toEqual([200, 0, 0, 255]);
    expect(recolored.slice(4)).toEqual(pixels.slice(4));
    expect(exported.recipe.selections).toEqual([{ x: 0, y: 0, mode: 'add' }]);

    await act(async () => { await api.compare(true); });
    expect(api.state().showOriginal).toBe(true);
    expect((await api.export()).dataUrl).toBe(exported.dataUrl);
    expect(JSON.parse(atob((await api.export({ original: true })).dataUrl.split(',')[1]))).toEqual(pixels);

    await act(async () => { await api.undo(); });
    expect(api.state().selections).toEqual([]);
    await act(async () => { await api.reset(); });
    expect(api.state().showOriginal).toBe(false);
});

test('rejects invalid inputs without poisoning subsequent operations and cleans up on unmount', async () => {
    const view = render(<MemoryRouter><PhotoRecolor /></MemoryRouter>);
    const api = window.tonioRecolor;
    await expect(api.export()).rejects.toThrow('Load a photo first');
    await expect(api.load('https://example.com/photo.png')).rejects.toThrow('local image');
    await act(async () => { await api.load('data:image/png;base64,fixture'); });
    await expect(api.select({ x: 2, y: 0 })).rejects.toThrow('inside the loaded image');
    await expect(api.select({ x: 0.5, y: 0 })).rejects.toThrow('integer pixels');
    await expect(api.select({ x: 0, y: 0, mode: 'bad' })).rejects.toThrow('add or subtract');
    await expect(api.configure({ color: 'red' })).rejects.toThrow('#RRGGBB');
    await expect(api.configure({ tolerance: 101 })).rejects.toThrow('between 1 and 100');
    await expect(api.configure({ globalMatch: 'yes' })).rejects.toThrow('boolean');
    await expect(api.configure({ unsupported: true })).rejects.toThrow('Unknown option');
    await act(async () => { await api.configure({ color: '#0000ff' }); });
    expect((await api.ready()).color).toBe('#0000ff');
    view.unmount();
    expect(window.tonioRecolor).toBeUndefined();
});

test('neutral target brightness affects output and subtraction restores source pixels', async () => {
    render(<MemoryRouter><PhotoRecolor /></MemoryRouter>);
    const api = window.tonioRecolor;
    await act(async () => { await api.load('data:image/png;base64,fixture'); await api.configure({ tolerance: 1, color: '#000000' }); await api.select({ x: 0, y: 0 }); });
    const read = image => JSON.parse(atob(image.dataUrl.split(',')[1]));
    const dark = read(await api.export());
    await act(async () => { await api.configure({ color: '#ffffff' }); });
    const light = read(await api.export());
    expect(dark[0]).toBeLessThan(100);
    expect(light[0]).toBeGreaterThan(100);
    expect(dark.slice(4)).toEqual(pixels.slice(4));
    expect(light.slice(4)).toEqual(pixels.slice(4));
    await act(async () => { await api.select({ x: 0, y: 0, mode: 'subtract' }); });
    expect(read(await api.export())).toEqual(pixels);
});

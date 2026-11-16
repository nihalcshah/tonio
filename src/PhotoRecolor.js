import React, { useRef, useState, useEffect, useCallback } from "react";
import { SketchPicker } from "react-color";
import "./index.css";

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hexToRgb(hex) {
    const m = hex.replace("#", "");
    return [parseInt(m.substring(0, 2), 16), parseInt(m.substring(2, 4), 16), parseInt(m.substring(4, 6), 16)];
}

const MAX_DIM = 1100;
const QUICK_PALETTE = ["#E7E5E4", "#F87171", "#FB923C", "#FACC15", "#4ADE80", "#60A5FA", "#4F46E5", "#A78BFA", "#F472B6", "#1C1917"];

function matchRegion(data, width, height, point, tolSq, global) {
        const mask = new Uint8Array(width * height);
        const startIdx = (point.y * width + point.x) * 4;
        const sr = data[startIdx], sg = data[startIdx + 1], sb = data[startIdx + 2];
        const withinTol = (idx) => {
            const dr = data[idx] - sr, dg = data[idx + 1] - sg, db = data[idx + 2] - sb;
            return dr * dr + dg * dg + db * db <= tolSq;
        };

        if (global) {
            for (let p = 0; p < width * height; p++) {
                if (withinTol(p * 4)) mask[p] = 1;
            }
        } else {
            const stack = [point.y * width + point.x];
            const visited = new Uint8Array(width * height);
            visited[stack[0]] = 1;
            while (stack.length) {
                const p = stack.pop();
                if (!withinTol(p * 4)) continue;
                mask[p] = 1;
                const px = p % width, py = (p - px) / width;
                const neighbors = [];
                if (px > 0) neighbors.push(p - 1);
                if (px < width - 1) neighbors.push(p + 1);
                if (py > 0) neighbors.push(p - width);
                if (py < height - 1) neighbors.push(p + width);
                for (const n of neighbors) {
                    if (!visited[n]) {
                        visited[n] = 1;
                        stack.push(n);
                    }
                }
            }
        }
        return mask;
    }

function PhotoRecolor() {
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const originalDataRef = useRef(null);
    const maskCache = useRef(null);
    const [hasImage, setHasImage] = useState(false);
    const [selections, setSelections] = useState([]);
    const [tolerance, setTolerance] = useState(35);
    const [color, setColor] = useState("#4f6df5");
    const [globalMatch, setGlobalMatch] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectionMode, setSelectionMode] = useState("add");
    const [keyboardPoint, setKeyboardPoint] = useState({ x: 0, y: 0 });
    const [error, setError] = useState("");
    // The synchronous model also backs UI actions, so export never observes a
    // previous React render when agents configure and export in the same turn.
    const modelRef = useRef({ color: "#4f6df5", tolerance: 35, globalMatch: false, selections: [], showOriginal: false });
    const loadGeneration = useRef(0);

    const state = useCallback(() => {
        const original = originalDataRef.current;
        return { version: 1, loaded: !!original, width: original?.width || 0, height: original?.height || 0,
            ...modelRef.current, selections: modelRef.current.selections.map(point => ({ ...point })) };
    }, []);

    const renderImage = useCallback((originalOnly = false, target = canvasRef.current) => {
        const original = originalDataRef.current;
        if (!original) throw new Error("Load a photo first.");
        const { width, height, data } = original;
        const model = modelRef.current;
        const out = new Uint8ClampedArray(data);
        if (!originalOnly && model.selections.length) {
            const tolSq = (model.tolerance * 2.55) ** 2;
            const cached = maskCache.current;
            const reusable = cached && cached.original === original && cached.selections === model.selections && cached.tolerance === model.tolerance && cached.globalMatch === model.globalMatch;
            const mask = reusable ? cached.mask : new Uint8Array(width * height);
            if (!reusable) for (const point of model.selections) {
                const region = matchRegion(data, width, height, point, tolSq, model.globalMatch);
                for (let p = 0; p < mask.length; p++) {
                    if (region[p]) mask[p] = point.mode === "subtract" ? 0 : 1;
                }
            }
            maskCache.current = { original, selections: model.selections, tolerance: model.tolerance, globalMatch: model.globalMatch, mask };
            const [th, ts, targetLightness] = rgbToHsl(...hexToRgb(model.color));
            const midpoint = Math.max(0.08, Math.min(0.92, targetLightness));
            for (let p = 0; p < mask.length; p++) {
                if (!mask[p]) continue;
                const idx = p * 4;
                const [, , l] = rgbToHsl(data[idx], data[idx + 1], data[idx + 2]);
                const shaded = l < 0.5 ? l * 2 * midpoint : midpoint + (l - 0.5) * 2 * (1 - midpoint);
                const [r, g, b] = hslToRgb(th, ts, shaded);
                out[idx] = r; out[idx + 1] = g; out[idx + 2] = b;
            }
        }
        target.width = width;
        target.height = height;
        target.getContext("2d").putImageData(new ImageData(out, width, height), 0, 0);
        return target;
    }, []);

    const update = useCallback((patch) => {
        modelRef.current = { ...modelRef.current, ...patch };
        const model = modelRef.current;
        setColor(model.color); setTolerance(model.tolerance); setGlobalMatch(model.globalMatch);
        setSelections(model.selections); setShowOriginal(model.showOriginal);
        if (originalDataRef.current) renderImage(model.showOriginal);
        return state();
    }, [renderImage, state]);

    const configure = useCallback((options = {}) => {
        if (!options || typeof options !== "object" || Array.isArray(options)) throw new Error("Options must be an object.");
        const patch = {};
        for (const key of Object.keys(options)) {
            if (!["color", "tolerance", "globalMatch"].includes(key)) throw new Error(`Unknown option: ${key}`);
        }
        if (options.color !== undefined) {
            if (typeof options.color !== "string" || !/^#[0-9a-f]{6}$/i.test(options.color)) throw new Error("Color must be #RRGGBB.");
            patch.color = options.color.toLowerCase();
        }
        if (options.tolerance !== undefined) {
            if (!Number.isFinite(options.tolerance) || options.tolerance < 1 || options.tolerance > 100) throw new Error("Tolerance must be between 1 and 100.");
            patch.tolerance = options.tolerance;
        }
        if (options.globalMatch !== undefined) {
            if (typeof options.globalMatch !== "boolean") throw new Error("globalMatch must be a boolean.");
            patch.globalMatch = options.globalMatch;
        }
        return update(patch);
    }, [update]);

    const load = useCallback(async (source) => {
        if (!(source instanceof Blob) && (typeof source !== "string" || !/^data:image\//i.test(source))) {
            throw new Error("Load a local image Blob/File or image data URL.");
        }
        if (source instanceof Blob && source.size > 25 * 1024 * 1024) throw new Error("Choose an image smaller than 25 MB.");
        setLoading(true);
        const generation = ++loadGeneration.current;
        const objectUrl = source instanceof Blob ? URL.createObjectURL(source) : null;
        const img = new Image();
        try {
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error("This image could not be decoded."));
                img.src = objectUrl || source;
            });
            if (generation !== loadGeneration.current) throw new Error("Image load was superseded by a newer image.");
            const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
            const width = Math.max(1, Math.round(img.width * scale));
            const height = Math.max(1, Math.round(img.height * scale));
            const canvas = canvasRef.current;
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            originalDataRef.current = ctx.getImageData(0, 0, width, height);
            setHasImage(true); setKeyboardPoint({ x: Math.floor(width / 2), y: Math.floor(height / 2) }); setError("");
            return update({ selections: [], showOriginal: false });
        } finally {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            if (generation === loadGeneration.current) setLoading(false);
        }
    }, [update]);

    const select = useCallback(({ x, y, mode = "add" } = {}) => {
        const original = originalDataRef.current;
        if (!original) throw new Error("Load a photo first.");
        if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= original.width || y >= original.height) {
            throw new Error("Selection coordinates must be integer pixels inside the loaded image.");
        }
        if (!["add", "subtract"].includes(mode)) throw new Error("Selection mode must be add or subtract.");
        return update({ selections: [...modelRef.current.selections, { x, y, mode }] });
    }, [update]);

    const undoSelection = useCallback(() => update({ selections: modelRef.current.selections.slice(0, -1) }), [update]);
    const reset = useCallback(() => update({ selections: [], showOriginal: false }), [update]);
    const toggleOriginal = useCallback((show) => {
        if (typeof show !== "boolean") throw new Error("compare expects a boolean.");
        return update({ showOriginal: show });
    }, [update]);

    const exportImage = useCallback((options = {}) => {
        if (!options || typeof options !== "object" || Array.isArray(options)) throw new Error("Export options must be an object.");
        if (Object.keys(options).some(key => key !== "original")) throw new Error("Only the original export option is supported.");
        if (options.original !== undefined && typeof options.original !== "boolean") throw new Error("original must be a boolean.");
        const canvas = renderImage(options.original === true, document.createElement("canvas"));
        return { dataUrl: canvas.toDataURL("image/png"), mimeType: "image/png", width: canvas.width, height: canvas.height,
            recipe: state(), original: options.original === true };
    }, [renderImage, state]);

    useEffect(() => {
        // Serializing mutations means an un-awaited load followed immediately by
        // configure/select/export still operates on the newly loaded photo.
        let queue = Promise.resolve();
        let active = true;
        const enqueue = operation => (...args) => {
            const result = queue.then(() => {
                if (!active) throw new Error("The photo editor is no longer open.");
                return operation(...args);
            });
            queue = result.catch(() => {});
            return result;
        };
        const api = { version: 1, state, ready: enqueue(state), load: enqueue(load), configure: enqueue(configure),
            select: enqueue(select), undo: enqueue(undoSelection), reset: enqueue(reset), compare: enqueue(toggleOriginal),
            export: enqueue(exportImage) };
        window.tonioRecolor = api;
        const generationRef = loadGeneration;
        return () => {
            active = false;
            ++generationRef.current;
            if (window.tonioRecolor === api) delete window.tonioRecolor;
        };
    }, [state, load, configure, select, undoSelection, reset, toggleOriginal, exportImage]);

    function handleFile(event) {
        const file = event.target.files[0];
        event.target.value = "";
        if (file) load(file).catch(err => setError(err.message));
    }

    function handleCanvasClick(event) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.min(canvas.width - 1, Math.max(0, Math.floor((event.clientX - rect.left) * canvas.width / rect.width)));
        const y = Math.min(canvas.height - 1, Math.max(0, Math.floor((event.clientY - rect.top) * canvas.height / rect.height)));
        select({ x, y, mode: event.shiftKey ? "subtract" : selectionMode });
    }

    function handleDownload() {
        const link = document.createElement("a");
        link.download = "recolored.png";
        try { link.href = exportImage().dataUrl; link.click(); setError(""); }
        catch (error) { setError(error.message); }
    }

    return (
        <div className="relative w-full min-h-screen flex flex-col bg-[#FAF8F5]">
            <header className="relative w-full px-6 py-4 flex items-center justify-between bg-white border-b border-[#EFECE6] z-10">
                <a className="flex items-center gap-3" href="/">
                    <img src="./tonio.png" className="w-9 aspect-square rounded-lg shadow-lg shadow-indigo-100" alt="" />
                    <div className="font-display font-bold text-2xl tracking-tight">Tone.io</div>
                </a>
                <a href="/customize" className="text-sm text-indigo-600 underline">Discover colors</a>
                <div className="hidden md:block text-stone-400 font-medium border-l border-stone-100 pl-6 h-6 leading-6">Recolor a Photo</div>
            </header>

            {error && <p role="alert" className="px-6 py-3 text-red-700">{error}</p>}
            <main className="flex flex-col md:flex-row flex-1 p-6 gap-6 max-w-[1440px] mx-auto w-full">
                <div className="flex-1 min-w-0 self-start w-full flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-100 shadow-sm p-8 min-h-[400px]">
                    {!hasImage && (
                        <div className="flex flex-col items-center gap-6 text-center max-w-md">
                            <div className="text-stone-500">Upload a photo of a wall, door, chair, or anything else you want to try a new color on.</div>
                            <button
                                className="bg-[#1A1A1A] hover:bg-indigo-600 transition-all hover:-translate-y-0.5 text-white font-bold px-8 py-4 rounded-2xl"
                                disabled={loading} onClick={() => fileInputRef.current.click()}
                            >
                                {loading ? "Opening photo…" : "Upload photo"}
                            </button>
                            <button className="underline text-indigo-700" disabled={loading} onClick={() => {
                                const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="wall" x2="1" y2="1"><stop stop-color="#c8b9a5"/><stop offset="1" stop-color="#8d7e6a"/></linearGradient></defs><path fill="url(#wall)" d="M0 0h800v460H0z"/><path fill="#d6d0c6" d="M0 460h800v140H0z"/><path fill="#e7f0ef" stroke="#fff" stroke-width="16" d="M80 60h190v230H80z"/><path fill="#424b3e" d="M540 280h120v200H540z"/><path fill="#424b3e" d="M520 390h160v70H520z"/><path stroke="#443c32" stroke-width="14" d="M535 455v90m130-90v90"/><path fill="#6e8056" d="M360 430q-80-160 20-230 80 110-20 230"/><path fill="#be8061" d="M325 405h75l-12 80h-50z"/></svg>`;
                                load('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)).catch(error => setError(error.message));
                            }}>Try a sample room</button>
                            <p className="text-sm text-stone-600">JPEG, PNG, WebP, or another image supported by your browser. Up to 25 MB.</p>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                        </div>
                    )}
                    <canvas
                        aria-label={showOriginal ? "Original photo preview" : "Recolored photo preview"}
                        data-testid="recolor-preview"
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className={hasImage ? "max-w-full max-h-[70vh] cursor-crosshair rounded-xl shadow-2xl border border-stone-100" : "hidden"}
                    />
                    {hasImage && (
                        <div className="mt-4 px-4 py-2 bg-stone-50 border border-stone-100 rounded-full text-xs font-medium text-stone-500">
                            {selections.length === 0
                                ? "Click on the object or surface you want to recolor."
                                : `${selections.length} selection step${selections.length === 1 ? "" : "s"}. Tap to ${selectionMode === "add" ? "add an area" : "remove an area"}.`}
                        </div>
                    )}
                </div>

                {loading && <p role="status">Opening photo…</p>}
                {hasImage && (
                    <aside className="w-full md:w-80 flex flex-col gap-5">
                        <section className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <span className="font-bold text-sm uppercase tracking-widest text-stone-400">Palette</span>
                                <div className="w-7 h-7 rounded-lg shadow-sm border-2 border-white ring-1 ring-stone-100" style={{ backgroundColor: color }}></div>
                            </div>
                            <div className="grid grid-cols-5 gap-3 mb-6">
                                {QUICK_PALETTE.map((swatch) => (
                                    <button
                                        key={swatch}
                                        type="button"
                                        aria-label={swatch}
                                        onClick={() => configure({ color: swatch })}
                                        className={"w-full aspect-square rounded-lg transition-all ring-offset-2 " + (color.toLowerCase() === swatch.toLowerCase() ? "ring-2 ring-indigo-600" : "hover:ring-2 hover:ring-indigo-600")}
                                        style={{ backgroundColor: swatch }}
                                    />
                                ))}
                            </div>
                            <label htmlFor="photo-color" className="text-sm font-bold">Replacement color</label><input id="photo-color" type="color" value={color} onChange={event => configure({ color: event.target.value })} className="w-full h-12 my-3" />
                            <SketchPicker disableAlpha color={color} onChangeComplete={(c) => configure({ color: c.hex })} className="!w-full !shadow-none !border !border-stone-100 !rounded-xl" />
                        </section>

                        <section className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
                            <fieldset><legend className="font-bold mb-2">Selection mode</legend><div className="flex gap-4">
                                {['add', 'subtract'].map(mode => <label key={mode} className="flex items-center gap-2"><input type="radio" name="selection-mode" value={mode} checked={selectionMode === mode} onChange={() => setSelectionMode(mode)} />{mode === 'add' ? 'Add area' : 'Remove area'}</label>)}
                            </div></fieldset>
                            <details><summary className="cursor-pointer text-sm underline">Select with a keyboard</summary>
                                <form className="flex flex-wrap gap-2 mt-3" onSubmit={event => { event.preventDefault(); try { select({ ...keyboardPoint, mode: selectionMode }); setError(''); } catch (error) { setError(error.message); } }}>
                                    {['x', 'y'].map(axis => <label key={axis}>{axis.toUpperCase()}<input className="border rounded p-2 w-24 block" type="number" min="0" max={(axis === 'x' ? state().width : state().height) - 1} value={keyboardPoint[axis]} onChange={event => setKeyboardPoint({ ...keyboardPoint, [axis]: Number(event.target.value) })} required /></label>)}
                                    <button className="secondary-action" type="submit">Select point</button>
                                </form>
                            </details>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-sm">Selection Tolerance</span>
                                    <span className="text-xs font-bold font-mono px-2 py-0.5 bg-stone-50 rounded border border-stone-100 text-stone-600">{tolerance}%</span>
                                </div>
                                <input
                                    aria-label="Selection tolerance" type="range" min="1" max="100" value={tolerance}
                                    onChange={(e) => configure({ tolerance: Number(e.target.value) })}
                                    className="w-full accent-indigo-600"
                                />
                                <div className="text-[11px] text-stone-400 mt-2">Higher = selects a wider range of shades near the click point.</div>
                            </div>

                            <label className="flex items-center gap-3 text-sm cursor-pointer">
                                <input type="checkbox" checked={globalMatch} onChange={(e) => configure({ globalMatch: e.target.checked })} className="w-5 h-5 rounded accent-indigo-600" />
                                <span className="text-stone-600 font-medium">Match color anywhere in photo (not just connected area)</span>
                            </label>

                            {selections.length > 0 && (
                                <div className="flex items-center justify-between text-sm pt-3 border-t border-stone-50">
                                    <div className="text-stone-400 text-xs font-medium">{selections.length} region{selections.length > 1 ? "s" : ""} selected</div>
                                    <button className="text-xs font-bold text-stone-900 hover:text-indigo-600 transition-colors uppercase tracking-tight" onClick={undoSelection}>Undo last</button>
                                </div>
                            )}

                            <button
                                className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors text-left uppercase tracking-wide"
                                aria-pressed={showOriginal}
                                onClick={() => toggleOriginal(!showOriginal)}
                            >
                                {showOriginal ? 'Show edited photo' : 'Show original photo'}
                            </button>
                        </section>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100" disabled={loading || selections.length === 0} onClick={handleDownload}>
                                Download PNG
                            </button>
                            <button disabled={selections.length === 0} className="px-6 py-4 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors font-bold" onClick={reset}>
                                Reset
                            </button>
                        </div>
                        <button className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-wide" disabled={loading} onClick={() => fileInputRef.current.click()}>
                            Upload a different photo
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    </aside>
                )}
            </main>
        </div>
    );
}

export default PhotoRecolor;

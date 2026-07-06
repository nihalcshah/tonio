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

function PhotoRecolor() {
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const originalDataRef = useRef(null);
    const [hasImage, setHasImage] = useState(false);
    const [selections, setSelections] = useState([]);
    const [tolerance, setTolerance] = useState(35);
    const [color, setColor] = useState("#4f6df5");
    const [globalMatch, setGlobalMatch] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false);

    function handleFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                const scale = Math.min(1, MAX_DIM / Math.max(width, height));
                width = Math.round(width * scale);
                height = Math.round(height * scale);
                const canvas = canvasRef.current;
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                originalDataRef.current = ctx.getImageData(0, 0, width, height);
                setHasImage(true);
                setSelections([]);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function handleCanvasClick(event) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
        const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
        const mode = event.shiftKey ? "subtract" : "add";
        setSelections((prev) => [...prev, { x, y, mode }]);
    }

    function undoSelection() {
        setSelections((prev) => prev.slice(0, -1));
    }

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

    const recolor = useCallback(() => {
        const original = originalDataRef.current;
        if (!original || selections.length === 0) return;
        const { width, height, data } = original;
        const out = new Uint8ClampedArray(data);
        const tolSq = (tolerance * 2.55) * (tolerance * 2.55);
        const mask = new Uint8Array(width * height);

        for (const point of selections) {
            const regionMask = matchRegion(data, width, height, point, tolSq, globalMatch);
            if (point.mode === "subtract") {
                for (let p = 0; p < mask.length; p++) if (regionMask[p]) mask[p] = 0;
            } else {
                for (let p = 0; p < mask.length; p++) if (regionMask[p]) mask[p] = 1;
            }
        }

        const [tr, tg, tb] = hexToRgb(color);
        const [th, ts] = rgbToHsl(tr, tg, tb);

        for (let p = 0; p < width * height; p++) {
            if (!mask[p]) continue;
            const idx = p * 4;
            const [, , l] = rgbToHsl(data[idx], data[idx + 1], data[idx + 2]);
            const [nr, ng, nb] = hslToRgb(th, ts, l);
            out[idx] = nr; out[idx + 1] = ng; out[idx + 2] = nb;
        }

        const ctx = canvasRef.current.getContext("2d");
        ctx.putImageData(new ImageData(out, width, height), 0, 0);
    }, [selections, tolerance, color, globalMatch]);

    useEffect(() => {
        if (showOriginal) return;
        if (selections.length === 0) {
            if (originalDataRef.current) {
                canvasRef.current.getContext("2d").putImageData(originalDataRef.current, 0, 0);
            }
        } else {
            recolor();
        }
    }, [recolor, showOriginal, selections]);

    function toggleOriginal(show) {
        setShowOriginal(show);
        const ctx = canvasRef.current.getContext("2d");
        if (show && originalDataRef.current) {
            ctx.putImageData(originalDataRef.current, 0, 0);
        } else {
            recolor();
        }
    }

    function handleDownload() {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "recolored.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    function reset() {
        setSelections([]);
    }

    return (
        <div className="relative w-full min-h-screen flex flex-col bg-[#FAF8F5]">
            <header className="relative w-full px-6 py-4 flex items-center justify-between bg-white border-b border-[#EFECE6] z-10">
                <a className="flex items-center gap-3" href="/">
                    <img src="./tonio.png" className="w-9 aspect-square rounded-lg shadow-lg shadow-indigo-100" alt="" />
                    <div className="font-display font-bold text-2xl tracking-tight">Tone.io</div>
                </a>
                <div className="hidden md:block text-stone-400 font-medium border-l border-stone-100 pl-6 h-6 leading-6">Recolor a Photo</div>
            </header>

            <main className="flex flex-col md:flex-row flex-1 p-6 gap-6 max-w-[1440px] mx-auto w-full">
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-100 shadow-sm p-8 min-h-[400px]">
                    {!hasImage && (
                        <div className="flex flex-col items-center gap-6 text-center max-w-md">
                            <div className="text-stone-500">Upload a photo of a wall, door, chair, or anything else you want to try a new color on.</div>
                            <button
                                className="bg-[#1A1A1A] hover:bg-indigo-600 transition-all hover:-translate-y-0.5 text-white font-bold px-8 py-4 rounded-2xl"
                                onClick={() => fileInputRef.current.click()}
                            >
                                Upload Photo
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                        </div>
                    )}
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className={hasImage ? "max-w-full max-h-[70vh] cursor-crosshair rounded-xl shadow-2xl border border-stone-100" : "hidden"}
                    />
                    {hasImage && (
                        <div className="mt-4 px-4 py-2 bg-stone-50 border border-stone-100 rounded-full text-xs font-medium text-stone-500">
                            {selections.length === 0
                                ? "Click on the object or surface you want to recolor."
                                : "Click to add more area to the selection. Shift+click to remove an area."}
                        </div>
                    )}
                </div>

                {hasImage && (
                    <aside className="w-full md:w-80 flex flex-col gap-5">
                        <section className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <span className="font-bold text-sm uppercase tracking-widest text-stone-400">Palette</span>
                                <div className="w-7 h-7 rounded-lg shadow-sm border-2 border-white ring-1 ring-stone-100" style={{ backgroundColor: color }}></div>
                            </div>
                            <SketchPicker color={color} onChangeComplete={(c) => setColor(c.hex)} className="!w-full !shadow-none !border !border-stone-100 !rounded-xl" />
                        </section>

                        <section className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-sm">Selection Tolerance</span>
                                    <span className="text-xs font-bold font-mono px-2 py-0.5 bg-stone-50 rounded border border-stone-100 text-stone-600">{tolerance}%</span>
                                </div>
                                <input
                                    type="range" min="1" max="100" value={tolerance}
                                    onChange={(e) => setTolerance(Number(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                                <div className="text-[11px] text-stone-400 mt-2">Higher = selects a wider range of shades near the click point.</div>
                            </div>

                            <label className="flex items-center gap-3 text-sm cursor-pointer">
                                <input type="checkbox" checked={globalMatch} onChange={(e) => setGlobalMatch(e.target.checked)} className="w-5 h-5 rounded accent-indigo-600" />
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
                                onMouseDown={() => toggleOriginal(true)}
                                onMouseUp={() => toggleOriginal(false)}
                                onMouseLeave={() => showOriginal && toggleOriginal(false)}
                            >
                                Hold to compare with original
                            </button>
                        </section>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100" onClick={handleDownload}>
                                Download
                            </button>
                            <button className="px-6 py-4 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors font-bold" onClick={reset}>
                                Reset
                            </button>
                        </div>
                        <button className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-wide" onClick={() => fileInputRef.current.click()}>
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

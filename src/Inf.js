import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import { normalizeTone, renderTone } from './imageExport';
import { colorNameFor, baselineFonts, recommendedFonts } from './colorSources';
import { SwatchesPicker, CirclePicker, SliderPicker, BlockPicker, SketchPicker } from "react-color";
import getContrastRatio from 'get-contrast-ratio';
import shader from 'shader';
import { contrastRatio } from './colorContrast';


function generateRandomColors(count) {
    var colors = []
    for (var i = 0; i < count; i++) {
        colors.push("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"))
    }
    return colors
}

function hexToRgb(hex) {
    var h = hex.replace("#", "")
    if (h.length === 3) h = h.split("").map(c => c + c).join("")
    var num = parseInt(h, 16)
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255
    var max = Math.max(r, g, b), min = Math.min(r, g, b)
    var h, s, l = (max + min) / 2
    if (max === min) {
        h = s = 0
    } else {
        var d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            default: h = (r - g) / d + 4
        }
        h /= 6
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function getShadeList(baseColor) {
    return [
        { label: "50", hex: shader(baseColor, 0.6) },
        { label: "100", hex: shader(baseColor, 0.4) },
        { label: "400", hex: shader(baseColor, 0.15) },
        { label: "600 (Base)", hex: baseColor, isBase: true },
        { label: "800", hex: shader(baseColor, -0.3) },
        { label: "950", hex: shader(baseColor, -0.55) },
    ]
}

function Gallery({ galleryRef, selectedFont, selectedFontImport, setColor, setColorName, paletteColors, setPaletteColors, source }) {
    const GetColorName = hex => colorNameFor(hex, source);

    function CloseGallery(event) {
        galleryRef.current.close();
    }

    function regenerate(event) {
        setPaletteColors(generateRandomColors(16))
    }

    function SelectColor(event) {
        galleryRef.current.close();
        setColor(event.currentTarget.value)
        setColorName(GetColorName(event.currentTarget.value))
    }

    return (
        <dialog aria-label="Color inspiration" id="galleryModal" ref={galleryRef} tabIndex="-1" className="tone-dialog fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">

            <div className="relative w-full max-w-4xl max-h-full z-20">
                <div className="relative bg-white rounded-lg shadow ">
                    <div className="flex items-start justify-between p-4 pb-0  rounded-t ">
                        <h3 className="text-xl font-semibold text-gray-900 ">
                            Tone Inspiration Gallery
                        </h3>

                        <button type="button" onClick={CloseGallery} data-modal-hide="galleryModal" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center  " >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="flex px-4 pb-4 border-b">
                        <div className=" font-medium pt-1">Select a Tone for Inspiration</div>
                        <button type="button" aria-label="Shuffle inspiration colors" onClick={regenerate} className="p-2 mx-2 z-30 text-sm font-medium text-white inline-flex items-center bg-gray-700 hover:bg-white hover:text-black rounded-lg text-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {paletteColors.map(function (data, index) {
                            var textColor = "black"
                            if (getContrastRatio("black", data) - 3 < getContrastRatio("white", data)) {
                                textColor = "white"
                            }
                            return (
                                <div key={index}>
                                    <div className="h-auto max-w-full object-cover rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-full h-full object-fit  z-20 rounded-lg opacity-0 block hover:opacity-100 focus-within:opacity-100">
                                            <div className="w-full h-full bg-black absolute z-20 opacity-50">
                                            </div>
                                            <div className="w-full h-full flex z-30">
                                                <button type="button" aria-label={`Use ${GetColorName(data)} ${data}`} value={data} onClick={SelectColor} data-modal-hide="galleryModal" className="px-5 m-auto z-30 py-2.5 text-sm font-medium text-white inline-flex items-center bg-gray-700 hover:bg-white hover:text-black rounded-lg text-center ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 mr-2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                                    </svg>
                                                    Select Color
                                                </button>
                                            </div>
                                        </div>
                                        <div className=" w-full">
                                            <link rel="stylesheet" href={selectedFontImport} crossOrigin="anonymous" />
                                            <div className="grow w-full m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: selectedFont, color: textColor }}>
                                                <div className="relative aspect-[3/4] w-full mx-auto" style={{ background: data }}>
                                                    <div className="absolute bottom-7 left-2 font-medium text-sm">{data}</div>
                                                    <div className="absolute bottom-2 left-2 font-extrabold whitespace-nowrap text-sm">{GetColorName(data)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </dialog>
    )
}

function readInitialTone() {
    try {
        return { tone: normalizeTone(Object.fromEntries(new URLSearchParams(window.location.search))), error: "" };
    } catch (error) {
        return { tone: normalizeTone({}), error: error.message };
    }
}

function Info() {
    const [initial] = useState(readInitialTone);
    const [source, setSource] = useState(initial.tone.source);
    const [fontSearch, setFontSearch] = useState("");
    const GetColorName = hex => colorNameFor(hex, source);
    const [color, setColor] = useState(initial.tone.color)
    const [colorName, setColorName] = useState(initial.tone.name)
    const [saved, setSaved] = useState(false)
    const [selectedFont, setSelectedFont] = useState(initial.tone.font)
    const [selectedFontImport, setSelectedFontImport] = useState(`https://fonts.googleapis.com/css?family=${encodeURIComponent(initial.tone.font)}`)
    const modalRef = useRef(null);
    const colorPickerRef = useRef(null);
    const exportRef = useRef(null);
    const galleryRef = useRef(null);
    const [fontSize, setFontSize] = useState(initial.tone.fontSize)
    const [elemInd, setElemInd] = useState(["outlined", "croptop", "buzzcut", "square"].indexOf(initial.tone.style))
    const [imgLink, setImgLink] = useState("")
    const [exporting, setExporting] = useState(false)
    const [imgSrc, setImgSrc] = useState("")
    const fontList = source === 'a' ? baselineFonts : recommendedFonts
    const [exportLoaded, setExportLoaded] = useState(false)
    const [exportError, setExportError] = useState(initial.error)
    const [outputSize, setOutputSize] = useState(initial.tone.size)
    const [pickerTab, setPickerTab] = useState("swatches");
    const [hexInput, setHexInput] = useState(initial.tone.color);
    useEffect(() => { setHexInput(color); }, [color]);
    const [preview, setPreview] = useState("")
    const styleNames = ['outlined', 'croptop', 'buzzcut', 'square'];
    const configRef = useRef(null);
    configRef.current = { source, color, name: colorName, style: styleNames[elemInd], font: selectedFont, fontSize, size: outputSize };
    const fontPixels = { 'text-sm': 14, 'text-base': 16, 'text-lg': 18, 'text-xl': 20, 'text-2xl': 24, 'text-3xl': 30 };

    useEffect(() => {
        let cancelled = false;
        setPreview("");
        renderTone({ source, color, name: colorName, style: ['outlined', 'croptop', 'buzzcut', 'square'][elemInd], font: selectedFont,
            fontSize, size: outputSize })
            .then(result => { if (!cancelled) { setPreview(result.dataUrl); } })
            .catch(error => { if (!cancelled) setExportError(error.message || "Could not render the image. Please try again."); });
        return () => { cancelled = true; };
    }, [source, color, colorName, elemInd, selectedFont, fontSize, outputSize]);


    useEffect(() => {
        function configure(options = {}) {
            const next = normalizeTone({ ...configRef.current, ...options, ...((options.color || options.source) && options.name === undefined ? { name: undefined } : {}) });
            configRef.current = next;
            setSource(next.source);
            setColor(next.color);
            setColorName(next.name);
            setElemInd(['outlined', 'croptop', 'buzzcut', 'square'].indexOf(next.style));
            setSelectedFont(next.font);
            setSelectedFontImport(`https://fonts.googleapis.com/css?family=${encodeURIComponent(next.font)}`);
            setFontSize(next.fontSize);
            setOutputSize(next.size);
            return next;
        }
        window.tonio = {
            version: 1,
            getState: () => ({ ...configRef.current }),
            configure,
            exportImage: (overrides = {}) => renderTone({ ...configRef.current, ...overrides, ...((overrides.color || overrides.source) && overrides.name === undefined ? { name: undefined } : {}) }),
            preview: async (overrides = {}) => {
                const image = await renderTone({ ...configRef.current, ...overrides, ...((overrides.color || overrides.source) && overrides.name === undefined ? { name: undefined } : {}) });
                setImgSrc(image.dataUrl);
                setExportLoaded(false);
                const link = document.createElement('a');
                link.href = image.dataUrl;
                link.download = 'tone.png';
                setImgLink(link);
                if (!exportRef.current.open) exportRef.current.showModal();
                return image;
            },
            permalink: () => `${window.location.origin}/customize?${new URLSearchParams(configRef.current)}`,
        };
        return () => { delete window.tonio; };
    }, [source, color, colorName, elemInd, selectedFont, fontSize, outputSize]);

    const [paletteColors, setPaletteColors] = useState(() => generateRandomColors(16))




    function handleChange(newColor, event) {
        setExportError("");
        setColor(newColor["hex"])
        setColorName(GetColorName(newColor["hex"]))
        setSaved(false)
    }

    function selectShade(hex) {
        setColor(hex)
        setColorName(GetColorName(hex))
        setSaved(false)
    }

    async function exportImage(style, download = false) {
        setExporting(true);
        setExportLoaded(false);
        setExportError("");
        try {
            const result = await renderTone({ source, color, name: colorName, style, font: selectedFont, fontSize, size: style === 'square' && download ? 1024 : outputSize });
            const link = document.createElement("a");
            link.download = `${colorName}-${style}.png`;
            link.href = result.dataUrl;
            setImgLink(link);
            setImgSrc(result.dataUrl);
            setSaved(false);
            if (download) link.click();
            if (!exportRef.current.open) exportRef.current.showModal();
        } catch (error) {
            setExportError(error.message || "Could not export the image. Please try again.");
        } finally {
            setExporting(false);
        }
    }

    function handleSave() {
        exportImage(styleNames[elemInd]);
    }

    function handleSquareDownload() {
        setElemInd(3);
        setOutputSize(1024);
        exportImage('square', true);
    }

    function handleExportCss(event) {
        var shades = getShadeList(color)
        var cssVars = shades.map(function (s) {
            return "  --color-" + s.label.replace(/\s.*$/, "").toLowerCase() + ": " + s.hex + ";"
        }).join("\n")
        var cssText = ":root {\n" + cssVars + "\n}\n"
        var blob = new Blob([cssText], { type: "text/css" })
        var url = URL.createObjectURL(blob)
        var link = document.createElement("a")
        link.href = url
        link.download = (colorName || "tone").replaceAll(" ", "-").toLowerCase() + ".css"
        link.click()
        URL.revokeObjectURL(url)
    }

    function handleStyleChange(event) {
        setElemInd(Number(event.currentTarget.value))
    }

    function getFontsList(event) {
        return [...new Set([selectedFont, ...fontList.filter(font => font.toLowerCase().includes(fontSearch.toLowerCase()))])].map(font =>
            <option key={font} value={font}>{font}</option>
        );
    }

    function handleFontChange(event) {
        var newFont = event.currentTarget.value.trim().replaceAll(" ", "+")
        setSelectedFont(event.currentTarget.value.trim());
        setSelectedFontImport("https://fonts.googleapis.com/css?family=" + newFont)
    }

    function changeFontSize(event) {
        setFontSize(fontPixels[event.currentTarget.value])
    }

    function OpenModal(event) {
        if (!modalRef.current.open) modalRef.current.showModal();
    }

    function imgClickLink(event) {
        if (imgLink) { imgLink.click(); setSaved(true); }
    }

    function CloseModal(event) {
        modalRef.current.close();
    }

    function CloseExport(event) {
        exportRef.current.close();
    }

    function OpenGallery(event) {
        if (!galleryRef.current.open) galleryRef.current.showModal();
    }

    function OpenColorPicker(event) {
        if (!colorPickerRef.current.open) colorPickerRef.current.showModal();
    }

    function CloseColorPicker(event) {
        colorPickerRef.current.close();
    }

    function exportLoad(event) {
        setExportLoaded(true)
    }

    function setRandomFont(event) {
        const randomFont = fontList[Math.floor(Math.random() * fontList.length)];
        var newFont = randomFont.trim().replaceAll(" ", "+")
        setSelectedFont(randomFont.trim());
        setSelectedFontImport("https://fonts.googleapis.com/css?family=" + newFont)
    }

    var [r, g, b] = hexToRgb(color)
    var [h, s, l] = rgbToHsl(r, g, b)
    var shadeList = getShadeList(color)
    var heroInk = getContrastRatio("black", color) >= getContrastRatio("white", color) ? "#000000" : "#ffffff"

    return (
        <div className="relative w-screen min-h-screen flex flex-col overflow-x-hidden bg-[#FAF8F5]">
            <div className="relative w-full p-4 shadow-sm bg-white flex items-center justify-between">
                <a className="flex items-center" href="/">
                    <img src="./tonio.png" alt="Tone.io" className="w-8 aspect-square my-auto mx-2 rounded-lg" />
                    <div className="font-display font-bold text-2xl tracking-tight">Tone.io</div>
                </a>
                <div className="flex items-center gap-x-3 md:gap-x-6 mr-2">
                    <button onClick={OpenGallery} className="text-xs md:text-sm font-semibold text-stone-500 hover:text-[#1A1A1A]">Gallery</button>
                    <button onClick={OpenModal} className="text-xs md:text-sm font-semibold text-stone-500 hover:text-[#1A1A1A] whitespace-nowrap">Style &amp; Font</button>
                    <button aria-label="Random color" onClick={() => selectShade(generateRandomColors(1)[0])} className="p-2.5 rounded-full bg-[#1A1A1A] text-white transition-colors hover:bg-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                    </button>
                </div>
            </div>

            <dialog aria-label="Export image" id="exportModal" ref={exportRef} tabIndex="-1" className="tone-dialog fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">

                <div className="relative w-full max-w-2xl max-h-full z-20">
                    <div className="relative bg-white rounded-lg shadow ">
                        <div className="flex items-start justify-between p-4 border-b rounded-t ">
                            <h3 className="text-xl font-semibold text-gray-900 ">
                                Exported Image:
                            </h3>
                            <button type="button" onClick={CloseExport} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center  " data-modal-hide="exportModal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="flex m-auto">
                            <img id="tone-export" src={imgSrc} alt="Exported swatch" onLoad={exportLoad} className={exportLoaded ? "mx-auto w-1/3 m-3 shadow-lg" : "mx-auto w-1/3 m-3 shadow-lg hidden"} />
                            <div className={exportLoaded ? "hidden" : "flex items-center justify-center mx-auto h-max p-5 w-1/3 m-3 bg-gray-300 rounded "}>
                                <svg className="w-10 h-10 text-gray-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center self-center justify-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
                            {saved ?
                                <button className="appearance-none my-2 mt-4 flex font-bold px-4 py-1 bg-white text-black gap-x-1 rounded-2xl hover:bg-black hover:text-white" onClick={imgClickLink}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <div className="">Download again</div>
                                </button> :
                                <button className="appearance-none my-2 mt-4 flex font-bold px-4 bg-black text-white gap-x-1 rounded-2xl hover:bg-white hover:text-black" onClick={imgClickLink}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <div className="pt-1 pb-2">Save</div>
                                </button>
                            }<span className="font-bold px-2 pt-1 pb-2 my-2 mt-4">OR</span>
                            <div className="pt-1 pb-2 my-2 mt-4 rounded-lg shadow px-2"> Hold Image and Add To Photos</div>
                        </div>
                    </div>
                </div>
            </dialog>

            <Gallery source={source} galleryRef={galleryRef} selectedFont={selectedFont} selectedFontImport={selectedFontImport} setColor={setColor} setColorName={setColorName} paletteColors={paletteColors} setPaletteColors={setPaletteColors} />

            <dialog aria-label="Change color" id="colorPickerModal" ref={colorPickerRef} tabIndex="-1" className="tone-dialog fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">

                <div className="relative w-full max-w-2xl max-h-full z-20 m-auto">
                    <div className="relative bg-white rounded-2xl shadow">
                        <div className="flex items-start justify-between p-4 border-b rounded-t">
                            <h3 className="text-xl font-semibold text-gray-900">Change Color</h3>
                            <button type="button" onClick={CloseColorPicker} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4" id="myTabContent">
                            <form className="flex gap-2 items-center mb-4" onSubmit={event => { event.preventDefault(); try { const tone = normalizeTone({ color: hexInput }); handleChange({ hex: tone.color }); setExportError(''); } catch (error) { setExportError(error.message); } }}>
                                <label htmlFor="hex-color" className="text-sm font-bold">Hex color</label><input id="hex-color" value={hexInput} onChange={event => setHexInput(event.target.value)} maxLength={7} spellCheck="false" className="min-w-0 w-32 border border-stone-200 rounded-lg p-2" /><button className="px-3 py-2 rounded-lg bg-stone-100" type="submit">Apply</button>
                            </form>
                            {exportError && <p role="alert" className="text-sm text-red-700 mb-3">{exportError}</p>}
                            <p className="text-xs text-stone-500 mb-4">Text contrast: black {contrastRatio(color, '#000000').toFixed(2)}:1; white {contrastRatio(color, '#ffffff').toFixed(2)}:1. Normal text needs 4.5:1.</p>
                            <div className="mb-4 flex flex-shrink border-b border-gray-200">
                                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" onKeyDown={event => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const tabs = ["swatches", "Circles", "Slider", "Block", "colorful"]; const index = event.key === "Home" ? 0 : event.key === "End" ? 4 : (tabs.indexOf(pickerTab) + (event.key === "ArrowRight" ? 1 : 4)) % 5; setPickerTab(tabs[index]); event.currentTarget.querySelectorAll("button")[index].focus(); }} role="tablist">
                                    <li className="mr-2" role="presentation">
                                        <button className="inline-block p-4 border-b-2 rounded-t-lg" id="swatches-tab" onClick={() => setPickerTab("swatches")} tabIndex={pickerTab === "swatches" ? 0 : -1} type="button" role="tab" aria-controls="swatches" aria-selected={pickerTab === "swatches"}>Swatches</button>
                                    </li>
                                    <li className="mr-2" role="presentation">
                                        <button className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="Circles-tab" onClick={() => setPickerTab("Circles")} tabIndex={pickerTab === "Circles" ? 0 : -1} type="button" role="tab" aria-controls="Circles" aria-selected={pickerTab === "Circles"}>Circles</button>
                                    </li>
                                    <li className="mr-2" role="presentation">
                                        <button className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="Slider-tab" onClick={() => setPickerTab("Slider")} tabIndex={pickerTab === "Slider" ? 0 : -1} type="button" role="tab" aria-controls="Slider" aria-selected={pickerTab === "Slider"}>Slider</button>
                                    </li>
                                    <li className="mr-2" role="presentation">
                                        <button className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="Block-tab" onClick={() => setPickerTab("Block")} tabIndex={pickerTab === "Block" ? 0 : -1} type="button" role="tab" aria-controls="Block" aria-selected={pickerTab === "Block"}>Block</button>
                                    </li>
                                    <li className="mr-2" role="presentation">
                                        <button className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="colorful-tab" onClick={() => setPickerTab("colorful")} tabIndex={pickerTab === "colorful" ? 0 : -1} type="button" role="tab" aria-controls="colorful" aria-selected={pickerTab === "colorful"}>Colorful</button>
                                    </li>
                                </ul>
                            </div>
                            <div id="pickerTabContent">
                                <div hidden={pickerTab !== "swatches"} className="p-4 rounded-lg bg-gray-50" id="swatches" role="tabpanel" aria-labelledby="swatches-tab">
                                    <SwatchesPicker className="w-full m-auto" color={color} onChange={handleChange} />
                                </div>
                                <div hidden={pickerTab !== "Circles"} className="p-4 rounded-lg bg-gray-50" id="Circles" role="tabpanel" aria-labelledby="Circles-tab">
                                    <CirclePicker className="left-1/2" color={color} onChange={handleChange} />
                                </div>
                                <div hidden={pickerTab !== "Slider"} className="p-4 rounded-lg bg-gray-50" id="Slider" role="tabpanel" aria-labelledby="Slider-tab">
                                    <SliderPicker className="w-full m-auto" color={color} onChange={handleChange} />
                                </div>
                                <div hidden={pickerTab !== "Block"} className="p-4 rounded-lg bg-gray-50" id="Block" role="tabpanel" aria-labelledby="Block-tab">
                                    <BlockPicker className="w-full m-auto" color={color} onChange={handleChange} />
                                </div>
                                <div hidden={pickerTab !== "colorful"} className="p-4 rounded-lg bg-gray-50" id="colorful" role="tabpanel" aria-labelledby="colorful-tab">
                                    <SketchPicker disableAlpha className="w-full m-auto" color={color} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>

            <dialog aria-label="Customize image" id="staticModal" ref={modalRef} tabIndex="-1" className="tone-dialog fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">

                <div className="relative w-full max-w-2xl max-h-full z-20">
                    <div className="relative bg-white rounded-lg shadow ">
                        <div className="flex items-start justify-between p-4 border-b rounded-t ">
                            <h3 className="text-xl font-semibold text-gray-900 ">
                                Customize your image
                            </h3>
                        </div>
                        <div className="p-6 h-min ">
                            <h3 className="mb-5 text-lg font-medium text-gray-900 ">Preferred Style</h3>
                            <link rel="stylesheet" href={selectedFontImport} crossOrigin="anonymous" />
                            <ul className="grid w-full place-center grid-cols-2 md:grid-cols-4 gap-1" style={{ fontFamily: selectedFont }}>
                                <li className="m-auto">
                                    <input type="radio" onChange={handleStyleChange} id="outlined" aria-label="Outlined style" name="type" value={0} checked={elemInd === 0} className="sr-only peer" required />
                                    <label htmlFor="outlined" className="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="block">
                                            <div className="w-max flex">
                                                <div className="aspect-[3/4] h-36 flex flex-col shadow-xl p-2 m-auto">
                                                    <div className="h-3/4 aspect-[4/5] m-auto bg-black w-full">
                                                    </div>
                                                    <div className="flex w-full mx-auto justify-between gap-x-1">
                                                        <div className="text-xs font-medium">#000000</div>
                                                        <div className="text-xs font-bold whitespace-nowrap">Black</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                                <li className="m-auto">
                                    <input type="radio" onChange={handleStyleChange} id="croptop" aria-label="Crop top style" name="type" value={1} checked={elemInd === 1} className="sr-only peer" required />
                                    <label htmlFor="croptop" className="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="block">
                                            <div className="w-max flex">
                                                <div className="aspect-[3/4] h-36 flex flex-col shadow-xl m-auto">
                                                    <div className="h-3/4 aspect-[4/5] m-auto bg-black w-full">
                                                    </div>
                                                    <div className="flex w-full mx-auto justify-between gap-x-1 p-2">
                                                        <div className="text-xs font-medium">#000000</div>
                                                        <div className="text-xs font-bold whitespace-nowrap">Black</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                                <li className="m-auto">
                                    <input type="radio" id="buzzcut" onChange={handleStyleChange} name="type" value={2} checked={elemInd === 2} className="sr-only peer" required />
                                    <label htmlFor="buzzcut" className="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="block">
                                            <div className="w-max flex">
                                                <div className="aspect-[3/4] h-36 flex flex-col shadow-xl m-auto">
                                                    <div className="relative h-full m-auto bg-black  w-full">
                                                        <div className="absolute text-white left-1 bottom-1 text-xs font-medium">#000000</div>
                                                        <div className="absolute text-white right-1 bottom-1 text-xs font-bold ">Black</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                                <li className="m-auto">
                                    <input type="radio" id="cleancut" aria-label="Square style" name="type" onChange={handleStyleChange} value={3} checked={elemInd === 3} className="sr-only peer" required />
                                    <label htmlFor="cleancut" className="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="block">
                                            <div className="w-max flex">
                                                <div className="aspect-[3/4] h-36 flex flex-col m-auto">
                                                    <div className="relative aspect-square m-auto bg-black  w-full">
                                                        <div className="absolute text-white left-1 bottom-1 text-xs font-medium">#000000</div>
                                                        <div className="absolute text-white right-1 bottom-1 text-xs font-bold ">Black</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                            </ul>

                        </div>
                        <div className="p-6 h-min ">
                            <h3 className="mb-5 text-lg font-medium text-gray-900 ">Preferred Font</h3>

                            <ul className="grid w-full grid-cols-2 md:grid-cols-3 gap-2">
                                <li className="m-auto w-full" style={{ fontFamily: "Montserrat" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Montserrat" name="font" value="Montserrat" checked={selectedFont === "Montserrat"} className="sr-only peer" required />
                                    <label htmlFor="Montserrat" className="text-left flex flex-col w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left ">Montserrat</div>
                                        <div className="font-semibold text-lighter text-xs text-left ">Geometric.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "DM Sans" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=DM+Sans" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="DM Sans" name="font" value="DM Sans" checked={selectedFont === "DM Sans"} className="sr-only peer" required />
                                    <label htmlFor="DM Sans" className="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left">DM Sans</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Modern.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Sacramento" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sacramento" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Sacramento" name="font" value="Sacramento" checked={selectedFont === "Sacramento"} className="sr-only peer" required />
                                    <label htmlFor="Sacramento" className="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left">Sacramento</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Sweet.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Raleway" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Raleway" name="font" value="Raleway" checked={selectedFont === "Raleway"} className="sr-only peer" required />
                                    <label htmlFor="Raleway" className="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left">Raleway</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Minimalist.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Josefin Sans" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Josefin Sans" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Josefin Sans" name="font" value="Josefin Sans" checked={selectedFont === "Josefin Sans"} className="sr-only peer" required />
                                    <label htmlFor="Josefin Sans" className="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left">Josefin Sans</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Art Deco.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full">
                                    <label className="text-left flex flex-col p-3 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left mb-1">Get a random font</div>
                                        <button type="button" onClick={setRandomFont} className="p-2 mx-2 z-30 text-sm font-medium text-white inline-flex items-center bg-gray-700 hover:bg-white hover:text-black rounded-lg text-center ">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-3.5 h-3.5 mr-2"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                            Randomize
                                        </button>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div className="p-6 pt-3 pb-2 h-min">
                            <label htmlFor="countries" className="mb-2 block text-sm font-medium text-gray-900 ">More Font Options</label>
                            {source === 'b' && <><label htmlFor="font-search">Search fonts</label><input id="font-search" value={fontSearch} onChange={event => setFontSearch(event.target.value)} className="w-full border rounded-lg p-2 mb-3" /></>}
                            <select value={selectedFont} onChange={handleFontChange} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5      ">
                                <option value="" disabled>Choose From Dropdown</option>
                                {getFontsList()}
                            </select>
                        </div>
                        <div className="p-6 h-min flex flex-col">
                            <h3 className="mb-5 text-lg font-medium text-gray-900 ">Font Size</h3>
                            <div className="inline-flex rounded-md shadow-sm mx-auto">
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="sm" name="fontsize" value="text-sm" checked={fontSize === fontPixels["text-sm"]} className="sr-only peer" required />
                                    <label htmlFor="sm" className="px-4 py-2 text-md font-medium text-gray-900 bg-white border rounded-l-lg border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        SM
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="md" name="fontsize" value="text-base" checked={fontSize === fontPixels["text-base"]} className="sr-only peer" required />
                                    <label htmlFor="md" className="px-4 py-2 text-md font-semibold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        MD
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="lg" name="fontsize" value="text-lg" checked={fontSize === fontPixels["text-lg"]} className="sr-only peer" required />
                                    <label htmlFor="lg" className="px-4 py-2 text-md font-bold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        LG
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="xl" name="fontsize" value="text-xl" checked={fontSize === fontPixels["text-xl"]} className="sr-only peer" required />
                                    <label htmlFor="xl" className="px-4 py-2 text-md font-extrabold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        XL
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="2xl" name="fontsize" value="text-2xl" checked={fontSize === fontPixels["text-2xl"]} className="sr-only peer" required />
                                    <label htmlFor="2xl" className="px-4 py-2 text-md font-black text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        2XL
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="3xl" name="fontsize" value="text-3xl" checked={fontSize === fontPixels["text-3xl"]} className="sr-only peer" required />
                                    <label htmlFor="3xl" className="px-4 py-2 text-md font-black text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        3XL
                                    </label>
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
                            <button data-modal-hide="staticModal" onClick={CloseModal} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center   ">Done</button>
                        </div>
                    </div>
                </div>
            </dialog>

            <div className="w-full max-w-[1512px] mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-start">

                {/* Left sidebar: permanent shades panel + export palette */}
                <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-6">
                    <section className="bg-white border border-[#EFECE6] rounded-3xl shadow-sm p-5 flex flex-col items-center">
                        <h2 className="font-bold text-sm mb-4">Image preview</h2>
                        <label htmlFor="image-style" className="font-bold text-sm mb-2">Image style</label>
                        <select id="image-style" value={elemInd} onChange={handleStyleChange} className="rounded-xl border border-stone-200 bg-white mb-4 px-4 py-2">
                            <option value={0}>Outlined</option>
                            <option value={1}>Crop top</option>
                            <option value={2}>Buzzcut</option>
                            <option value={3}>Square (1:1)</option>
                        </select>
                        {preview ? <img id="tone-preview" src={preview} alt={`${colorName} (${color}), ${styleNames[elemInd]} swatch`} className="w-72 max-w-full shadow-xl" /> : <p role="status">Rendering preview…</p>}
                        <button type="button" onClick={handleSquareDownload} disabled={exporting} className="mt-5 px-5 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl">Download square PNG · 1024 × 1024</button>
                        <a className="mt-3 text-sm text-indigo-700 underline" href={`/customize?${new URLSearchParams({ source, color, name: colorName, style: styleNames[elemInd], font: selectedFont, fontSize, size: outputSize })}`}>Repeat this image · permalink</a>
                        <a className="mt-2 text-sm text-indigo-700 underline" href="/agents">Image API for agents</a>
                        {exportError && <p role="alert" className="mt-3 text-red-700">{exportError}</p>}
                    </section>
                    <div className="bg-white border border-[#EFECE6] rounded-3xl shadow-sm p-6 flex flex-col gap-2">
                        <div className="font-bold text-xs tracking-[0.15em] uppercase text-stone-400 mb-2">Color Shades</div>
                        {shadeList.map(function (shade) {
                            return (
                                <button
                                    key={shade.label} type="button"
                                    onClick={() => selectShade(shade.hex)}
                                    className={"flex items-center gap-3 p-2 rounded-xl w-full text-left hover:bg-stone-50 " + (shade.isBase ? "ring-2 ring-orange-600/20 bg-stone-50" : "")}
                                >
                                    <div className="rounded-lg w-12 h-12 flex-shrink-0" style={{ background: shade.hex }}></div>
                                    <div className="flex flex-col">
                                        <div className="text-xs font-bold text-[#1A1A1A]">{shade.label}</div>
                                        <div className="text-[10px] text-stone-400">{shade.hex.toUpperCase()}</div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    <div className="relative bg-orange-600 rounded-3xl shadow-lg shadow-orange-200 p-6 flex flex-col gap-4">
                        <div className="font-bold text-[10px] tracking-widest uppercase text-white/70">Export Palette</div>
                        <div className="flex gap-2">
                            <button onClick={handleExportCss} className="flex-1 flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-3 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                </svg>
                                <div className="text-[10px] font-medium">CSS</div>
                            </button>
                            <button disabled={exporting} onClick={handleSave} className="flex-1 flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-3 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <div className="text-[10px] font-medium">PNG</div>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Center: main swatch display */}
                <main className="flex-1 min-w-0 w-full flex flex-col gap-8">
                    <div className="bg-white border border-[#EFECE6] rounded-[40px] shadow-sm overflow-hidden">
                        <div className="relative w-full h-[320px] md:h-[454px]" style={{ background: color }}>
                            <div className="absolute top-8 right-8 flex gap-2">
                                <button aria-label="Image style and font" onClick={OpenModal} className="backdrop-blur w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                    </svg>
                                </button>
                                <button aria-label="Explore colors" onClick={OpenGallery} className="backdrop-blur w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="absolute bottom-8 left-8 flex flex-col gap-4 max-w-[80%]">
                                <div className="backdrop-blur-md bg-white/20 rounded-full px-3 py-2 w-max">
                                    <div className="text-[10px] font-bold tracking-wider uppercase" style={{ color: heroInk }}>Primary UI Tone</div>
                                </div>
                                <div className="font-display text-4xl md:text-6xl font-bold tracking-tight" style={{ color: heroInk }}>{colorName}</div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 md:p-10">
                            <div className="flex flex-col gap-1">
                                <div className="font-display font-bold text-3xl uppercase tracking-tight text-[#1A1A1A]">{color}</div>
                                <div className="text-stone-400 text-sm font-medium">RGB({r}, {g}, {b}) &bull; HSL({h}, {s}%, {l}%)</div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={OpenColorPicker} className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 rounded-2xl px-6 py-4 font-bold text-[#1A1A1A]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                                    </svg>
                                    Change Color
                                </button>
                                <button disabled={exporting} onClick={handleSave} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 rounded-2xl px-6 py-4 font-bold text-white">
                                    {exporting ?
                                        <svg aria-hidden="true" className="w-4 h-4 text-orange-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    }
                                    Export Palette
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="font-display font-bold text-lg text-[#1A1A1A]">Explore Tones</div>
                        <button onClick={OpenGallery} className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-4">
                        {paletteColors.slice(0, 4).map(function (hex) {
                            return (
                                <button
                                    key={hex} type="button"
                                    onClick={() => selectShade(hex)}
                                    className="text-left bg-white border border-[#EFECE6] rounded-3xl shadow-sm p-[17px] flex flex-col gap-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="aspect-square rounded-2xl w-full" style={{ background: hex }}></div>
                                    <div className="flex flex-col">
                                        <div className="font-bold text-sm text-[#1A1A1A]">{GetColorName(hex)}</div>
                                        <div className="text-xs text-stone-400">{hex.toUpperCase()}</div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Info;

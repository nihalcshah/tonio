import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import Navigation from './Navigation';
import { contrastRatio, textOn } from './colorContrast';
import { normalizeTone, renderTone } from './imageExport';
import { GetColorName } from 'hex-color-to-color-name';
import { SketchPicker } from "react-color";
import getContrastRatio from 'get-contrast-ratio';
import shader from 'shader';


function Gallery({ closeGallery, galleryRef, selectedFont, selectedFontImport, fontSize, setColor, setColorName, colorMap, setColorMap, generateColorMap }) {


    function CloseGallery(event) {
        closeGallery()
    }

    function setCol(event) {
        setColorMap(generateColorMap())
    }

    return (
        <dialog aria-label="Color inspiration" id="galleryModal" ref={galleryRef} tabIndex="-1" className="tone-dialog fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">

            <div className="relative w-full max-w-4xl max-h-full z-20">
                <div className="relative bg-white rounded-[28px] shadow-2xl">
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
                        <button type="button" aria-label="Shuffle inspiration colors" onClick={setCol} className="p-2 mx-2 z-30 text-sm font-medium text-white inline-flex items-center bg-indigo-600 hover:bg-indigo-700 rounded-lg text-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                            {/* Randomize */}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {colorMap}
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
    const [color, setColor] = useState(initial.tone.color)
    const [colorName, setColorName] = useState(initial.tone.name)
    const [saved, setSaved] = useState(false)
    const [selectedFont, setSelectedFont] = useState(initial.tone.font)
    const [selectedFontImport, setSelectedFontImport] = useState(`https://fonts.googleapis.com/css?family=${encodeURIComponent(initial.tone.font)}`)
    const modalRef = useRef(null);
    const exportRef = useRef(null);
    const galleryRef = useRef(null);
    const shadeRef = useRef(null);
    const [fontSize, setFontSize] = useState(initial.tone.fontSize)
    const [elemInd, setElemInd] = useState(["outlined", "croptop", "buzzcut", "square"].indexOf(initial.tone.style))
    const [notice, setNotice] = useState("");
    const [renderWarning, setRenderWarning] = useState("");
    const [hexInput, setHexInput] = useState(initial.tone.color);
    const [imgLink, setImgLink] = useState("")
    const [exporting, setExporting] = useState(false)
    const [imgSrc, setImgSrc] = useState("")
    const [fontList, setFontList] = useState([])
    const [exportLoaded, setExportLoaded] = useState(false)
    const [exportError, setExportError] = useState(initial.error)
    const [outputSize, setOutputSize] = useState(initial.tone.size)
    const [preview, setPreview] = useState("")
    const styleNames = ['outlined', 'croptop', 'buzzcut', 'square'];
    const configRef = useRef(null);
    configRef.current = { color, name: colorName, style: styleNames[elemInd], font: selectedFont, fontSize, size: outputSize };
    const fontPixels = { 'text-sm': 14, 'text-base': 16, 'text-lg': 18, 'text-xl': 20, 'text-2xl': 24, 'text-3xl': 30 };

    useEffect(() => { setHexInput(color); }, [color]);

    useEffect(() => {
        let cancelled = false;
        setPreview("");
        renderTone({ color, name: colorName, style: ['outlined', 'croptop', 'buzzcut', 'square'][elemInd], font: selectedFont,
            fontSize, size: outputSize })
            .then(result => { if (!cancelled) { setPreview(result.dataUrl); setRenderWarning(result.warning); } })
            .catch(error => { if (!cancelled) setExportError(error.message || "Could not render the image. Please try again."); });
        return () => { cancelled = true; };
    }, [color, colorName, elemInd, selectedFont, fontSize, outputSize]);


    useEffect(() => {
        function configure(options = {}) {
            const next = normalizeTone({ ...configRef.current, ...options, ...(options.color && options.name === undefined ? { name: undefined } : {}) });
            configRef.current = next;
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
            exportImage: (overrides = {}) => renderTone({ ...configRef.current, ...overrides, ...(overrides.color && overrides.name === undefined ? { name: undefined } : {}) }),
            preview: async (overrides = {}) => {
                const image = await renderTone({ ...configRef.current, ...overrides, ...(overrides.color && overrides.name === undefined ? { name: undefined } : {}) });
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
    }, [color, colorName, elemInd, selectedFont, fontSize, outputSize]);

    useEffect(() => {
        var fontL = ["Montserrat", "DM Sans", "Sacramento", "Raleway", "Josefin Sans", "Georgia", "Arial", "Courier New"];
        fontL.sort();
        setFontList(fontL)
        // return() =>{ }
    }, []);

    function SelectShade(event) {
        shadeRef.current.close()
        setColor(event.currentTarget.value)
        setColorName(GetColorName(event.currentTarget.value))
    }

    function OpenShade(event) {
        !shadeRef.current.open && shadeRef.current.showModal()
    }

    function SelectColor(event) {
        galleryRef.current.close()
        setColor(event.currentTarget.value)
        setColorName(GetColorName(event.currentTarget.value))
    }

    function generateColorMap() {
        var colors = []
        for (var i = 0; i < 16; i++) {
            colors.push("#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0"))
        }
        var cm = colors.map(function (data, index) {
            var textColor = "black"
            if (getContrastRatio("black", data) < getContrastRatio("white", data)) {
                textColor = "white"
            }

            return (
                <div key={index}>
                    <div className="h-auto max-w-full object-cover rounded-lg relative">
                        <div className="absolute top-0 left-0 w-full h-full object-fit  z-20 rounded-lg opacity-0 block hover:opacity-100 focus-within:opacity-100">
                            <div className="w-full h-full bg-black absolute z-20 opacity-50">
                            </div>
                            <div className="w-full h-full flex z-30">
                                <button type="button" aria-label={`Use ${GetColorName(data)} ${data}`} value={data} onClick={SelectColor} data-modal-hide="galleryModal" className="px-5 m-auto z-30 py-2.5 text-sm font-medium text-white inline-flex items-center bg-indigo-600 hover:bg-indigo-700 rounded-lg text-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                    Select Color
                                </button>
                            </div>
                        </div>
                        {/* <img className="rounded-lg z-10" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg" alt="" /> */}
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
        })
        return cm
    }

    const [colorMap, setColorMap] = useState(generateColorMap)

    function handleChange(newColor, event) {
        setExportError("");
        setColor(newColor["hex"])
        setColorName(GetColorName(newColor["hex"]))
        setSaved(false)
    }

    async function exportImage(style, download = false) {
        setExporting(true);
        setExportLoaded(false);
        setExportError("");
        try {
            const result = await renderTone({ color, name: colorName, style, font: selectedFont, fontSize, size: style === 'square' && download ? 1024 : outputSize });
            const link = document.createElement("a");
            link.download = `${colorName}-${style}.png`;
            link.href = result.dataUrl;
            setImgLink(link);
            setImgSrc(result.dataUrl);
            setSaved(false);
            if (download) link.click();
            !exportRef.current.open && exportRef.current.showModal();
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

    function handleStyleChange(event) {
        setElemInd(Number(event.currentTarget.value))
    }

    function getFontsList(event) {
        return fontList.map(font =>
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
        !modalRef.current.open && modalRef.current.showModal()
    }

    function imgClickLink(event) {
        if (imgLink) { imgLink.click(); setSaved(true); }
    }

    function CloseModal(event) {
        modalRef.current.close()
    }

    function CloseExport(event) {
        exportRef.current.close()
    }

    function OpenGallery(event) {
        !galleryRef.current.open && galleryRef.current.showModal()
    }

    function exportLoad(event) {
        setExportLoaded(true)
    }

    function CloseShade(event) {
        shadeRef.current.close();
    }

    function setRandomFont(event) {
        const randomFont = fontList[Math.floor(Math.random() * fontList.length)];
        var newFont = randomFont.trim().replaceAll(" ", "+")
        setSelectedFont(randomFont.trim());
        setSelectedFontImport("https://fonts.googleapis.com/css?family=" + newFont)
    }

    const getTextColor = textOn;
    const rgb = color.slice(1).match(/../g).map(channel => parseInt(channel, 16));
    const channels = rgb.map(channel => channel / 255);
    const maxChannel = Math.max(...channels), minChannel = Math.min(...channels);
    const lightness = (maxChannel + minChannel) / 2;
    const delta = maxChannel - minChannel;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    const hue = delta === 0 ? 0 : (maxChannel === channels[0] ? (channels[1] - channels[2]) / delta : maxChannel === channels[1] ? (channels[2] - channels[0]) / delta + 2 : (channels[0] - channels[1]) / delta + 4) * 60;
    const hsl = `${Math.round((hue + 360) % 360)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
    function downloadCSS() {
        const contents = `:root {\n  --tone: ${color};\n  --tone-on: ${textOn(color)};\n${[-0.4, -0.2, 0.2, 0.4].map((amount, i) => `  --tone-shade-${i + 1}: ${shader(color, amount)};`).join('\n')}\n}\n`;
        const url = URL.createObjectURL(new Blob([contents], { type: 'text/css' }));
        const link = document.createElement('a'); link.download = 'tone-palette.css'; link.href = url; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function getShades() {
        var shades = [
            shader(color, 0.4),
            shader(color, 0.2),
            color,
            shader(color, -0.2),
            shader(color, -0.4),
        ]

        return shades.map((shade, index) =>
            <div key={index} className="w-full flex object-cover relative items-center h-16" style={{ backgroundColor: shade }}>
                <div className="m-auto" style={{ color: getTextColor(shade) }}>{GetColorName(shade)}</div>
                <div className="absolute top-0 left-0 w-full h-full object-fit  z-20 rounded-lg opacity-0 block hover:opacity-100 focus-within:opacity-100">
                    <div className="w-full h-full bg-black absolute z-20 opacity-50">
                    </div>
                    <div className="w-full h-full flex z-30">
                        <button type="button" value={shade} onClick={SelectShade} data-modal-hide="galleryModal" className="px-5 m-auto z-30 py-2.5 text-sm font-medium text-white inline-flex items-center bg-indigo-600 hover:bg-indigo-700 rounded-lg text-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                            Select Color
                        </button>
                    </div>
                </div>
            </div>
        );

    }

    return (
        <div className="relative w-screen min-h-screen flex flex-col overflow-x-hidden bg-[#FAF8F5]">
            <Navigation />
            <dialog ref={shadeRef} aria-label="Color shades" className="tone-dialog p-4 bg-white w-80" tabIndex="-1">

                <h5 id="drawer-label" className="relative inline-flex z-50 items-center mb-4 text-base font-semibold text-gray-500 ">Shades</h5>
                <button type="button" onClick={CloseShade} className=" z-40 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center  " >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
                <p className="relative mb-6 text-sm text-gray-500  z-50">Select Shades of the Current Color</p>
                <div className="relative flex flex-col pt-0 p-4 z-50">
                    {getShades()}
                </div>
            </dialog>

            <dialog aria-label="Export image" id="exportModal" ref={exportRef} tabIndex="-1" className="tone-dialog fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">

                <div className="relative w-full max-w-2xl max-h-full z-20">

                    <div className="relative bg-white rounded-[28px] shadow-2xl">

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
                            <img id="tone-export" src={imgSrc} onLoad={exportLoad} alt="Exported swatch" className={exportLoaded ? "mx-auto w-1/3 m-3 shadow-lg" : "mx-auto w-1/3 m-3 shadow-lg hidden"} />
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
                                    <div className="pt-1 pb-2">Download PNG</div>
                                </button>
                            }<span className="font-bold px-2 pt-1 pb-2 my-2 mt-4">OR</span>
                            <div className="pt-1 pb-2 my-2 mt-4 rounded-lg shadow px-2"> Hold Image and Add To Photos</div>
                        </div>
                    </div>
                </div>
            </dialog>

            <Gallery closeGallery={() => galleryRef.current.close()} galleryRef={galleryRef} selectedFont={selectedFont} selectedFontImport={selectedFontImport} fontSize={fontSize} setColor={setColor} setColorName={setColorName} colorMap={colorMap} setColorMap={setColorMap} generateColorMap={generateColorMap} />

            <dialog aria-label="Customize image" id="staticModal" ref={modalRef} tabIndex="-1" className="tone-dialog fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">

                <div className="relative w-full max-w-2xl max-h-full z-20">
                    <div className="relative bg-white rounded-[28px] shadow-2xl">
                        <div className="flex items-start justify-between p-4 border-b rounded-t ">
                            <h3 className="text-xl font-semibold text-gray-900 ">Customize your image</h3><button onClick={CloseModal} aria-label="Close image options">Close</button>
                        </div>
                        <div className="p-6 h-min ">
                            <h3 className="mb-5 text-lg font-medium text-gray-900 ">Preferred Style</h3>
                            <link rel="stylesheet" href={selectedFontImport} crossOrigin="anonymous" />
                            <ul className="grid w-full place-center grid-cols-2 md:grid-cols-4 gap-1" style={{ fontFamily: selectedFont }}>
                                <li className="m-auto">
                                    <input type="radio" onChange={handleStyleChange} id="outlined" aria-label="Outlined style" name="type" value={0} checked={elemInd === 0} className="sr-only peer" required />
                                    <label htmlFor="outlined" className="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
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
                                    <label htmlFor="croptop" className="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
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
                                    <label htmlFor="buzzcut" className="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
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
                                    <label htmlFor="cleancut" className="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
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
                                    <label htmlFor="Montserrat" className="text-left flex flex-col w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left ">Montserrat</div>
                                        <div className="font-semibold text-lighter text-xs text-left ">Geometric.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "DM Sans" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=DM+Sans" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="DM Sans" name="font" value="DM Sans" checked={selectedFont === "DM Sans"} className="sr-only peer" required />
                                    <label htmlFor="DM Sans" className="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left">DM Sans</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Modern.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Sacramento" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sacramento" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Sacramento" name="font" value="Sacramento" checked={selectedFont === "Sacramento"} className="sr-only peer" required />
                                    <label htmlFor="Sacramento" className="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left">Sacramento</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Sweet.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Raleway" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Raleway" name="font" value="Raleway" checked={selectedFont === "Raleway"} className="sr-only peer" required />
                                    <label htmlFor="Raleway" className="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left">Raleway</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Minimalist.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Josefin Sans" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Josefin Sans" crossOrigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Josefin Sans" name="font" value="Josefin Sans" checked={selectedFont === "Josefin Sans"} className="sr-only peer" required />
                                    <label htmlFor="Josefin Sans" className="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left">Josefin Sans</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Art Deco.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full">
                                    <label className="text-left flex flex-col p-3 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer    peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100   ">
                                        <div className="font-semibold text-md text-black text-left mb-1">Get a random font</div>
                                        <button type="button" onClick={setRandomFont} className="p-2 mx-2 z-30 text-sm font-medium text-white inline-flex items-center bg-indigo-600 hover:bg-indigo-700 rounded-lg text-center ">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-3.5 h-3.5 mr-2"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                            Randomize
                                        </button>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div className="p-6 pt-3 pb-2 h-min">
                            <label htmlFor="countries" className="mb-2 block text-sm font-medium text-gray-900 ">More Font Options</label>
                            <label htmlFor="countries">Font family</label><select value={selectedFont} onChange={handleFontChange} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5      ">
                                <option value="" disabled>Choose From Dropdown</option>
                                {getFontsList()}
                            </select>
                        </div>
                        <div className="p-6 h-min flex flex-col">
                            <h3 className="mb-5 text-lg font-medium text-gray-900 ">Font Size</h3>
                            <div className="inline-flex rounded-md shadow-sm mx-auto">
                                {/* <button onClickCapture={changeFontSize} className="px-4 py-2 text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600       ">
                                        XS
                                    </button> */}
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="sm" name="fontsize" value="text-sm" checked={fontSize === fontPixels["text-sm"]} className="sr-only peer" required />
                                    <label htmlFor="sm" className="px-4 py-2 text-md font-medium text-gray-900 bg-white border rounded-l-lg border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600 cursor-pointer peer-checked:text-indigo-600 peer-checked:border-indigo-600">
                                        SM
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="md" name="fontsize" value="text-base" checked={fontSize === fontPixels["text-base"]} className="sr-only peer" required />
                                    <label htmlFor="md" className="px-4 py-2 text-md font-semibold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600 cursor-pointer peer-checked:text-indigo-600 peer-checked:border-indigo-600">
                                        MD
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="lg" name="fontsize" value="text-lg" checked={fontSize === fontPixels["text-lg"]} className="sr-only peer" required />
                                    <label htmlFor="lg" className="px-4 py-2 text-md font-bold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600 cursor-pointer peer-checked:text-indigo-600 peer-checked:border-indigo-600">
                                        LG
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="xl" name="fontsize" value="text-xl" checked={fontSize === fontPixels["text-xl"]} className="sr-only peer" required />
                                    <label htmlFor="xl" className="px-4 py-2 text-md font-extrabold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600 cursor-pointer peer-checked:text-indigo-600 peer-checked:border-indigo-600">
                                        XL
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="2xl" name="fontsize" value="text-2xl" checked={fontSize === fontPixels["text-2xl"]} className="sr-only peer" required />
                                    <label htmlFor="2xl" className="px-4 py-2 text-md font-black text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600 cursor-pointer peer-checked:text-indigo-600 peer-checked:border-indigo-600">
                                        2XL
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="3xl" name="fontsize" value="text-3xl" checked={fontSize === fontPixels["text-3xl"]} className="sr-only peer" required />
                                    <label htmlFor="3xl" className="px-4 py-2 text-md font-black text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:text-indigo-600 cursor-pointer peer-checked:text-indigo-600 peer-checked:border-indigo-600">
                                        3XL
                                    </label>
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
                            <button data-modal-hide="staticModal" onClick={CloseModal} type="button" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-200 font-medium rounded-xl text-sm px-5 py-2.5 text-center">Done</button>
                        </div>
                    </div>
                </div>
            </dialog>

            <div className="studio-frame">
            <aside className="studio-shades" aria-label="Color shades">
                <h2 className="text-lg font-bold mb-3">Color shades</h2>
                <p className="text-sm text-stone-600 mb-4">Lighter and darker versions of your current color.</p>
                {[-0.55, -0.3, 0, 0.15, 0.4, 0.6].map((amount, index) => {
                    const hex = shader(color, amount);
                    return <button key={amount} className="shade-button" onClick={() => handleChange({ hex })}>
                        <span style={{ background: hex }} /><span>{amount === 0 ? 'Current color' : amount < 0 ? `Darker ${index + 1}` : `Lighter ${index - 2}`}<small>{hex.toUpperCase()}</small></span>
                    </button>;
                })}
                <button onClick={downloadCSS} className="secondary-action">Download CSS palette</button>
            </aside>
            <main className="md:p-5 p-4 mx-auto w-full max-w-6xl ">
                <h1 className="font-display font-bold md:text-4xl text-2xl">Color studio</h1>
                <div className="font-medium md:text-md text-sm text-stone-500">Choose a color. Check its contrast. Keep a swatch for your next project.</div>
                <button onClick={OpenGallery} className="flex p-2 px-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 gap-2 mt-3 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 m-auto" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <div className="text-sm" >Explore colors</div>
                </button>
                <div className="grid md:grid-cols-2">
                    <div className="md:p-8 p-4 flex flex-col items-center"  >
                        <label htmlFor="image-style" className="font-bold text-sm mb-2">Image style</label>
                        <select id="image-style" value={elemInd} onChange={handleStyleChange} className="rounded-xl border border-stone-200 bg-white mb-4 px-4 py-2">
                            <option value={0}>Outlined</option>
                            <option value={1}>Crop top</option>
                            <option value={2}>Buzzcut</option>
                            <option value={3}>Square (1:1)</option>
                        </select>
                        {preview ? <img id="tone-preview" src={preview} alt={`${colorName} (${color}), ${styleNames[elemInd]} swatch`} className="w-72 max-w-full shadow-xl" /> : <p role="status">{exportError ? "Preview unavailable. Change the settings below or choose Arial in image options." : "Rendering preview…"}</p>}
                        <button type="button" onClick={handleSquareDownload} disabled={exporting} className="mt-5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl">Download square PNG · 1024 × 1024</button>
                        <a className="mt-3 text-sm text-indigo-700 underline" href={`/customize?${new URLSearchParams({ color, name: colorName, style: styleNames[elemInd], font: selectedFont, fontSize, size: outputSize })}`}>Save this color link</a>
                        <a className="mt-2 text-sm text-indigo-700 underline" href="/agents">Image API documentation</a>
                        {renderWarning && <p role="status" className="mt-3 text-sm text-stone-600">{renderWarning}</p>}
                        {exportError && <p role="alert" className="mt-3 text-red-700">{exportError}</p>}
                        <div className="flex flex-wrap gap-x-3 mx-auto">
                            <button disabled={exporting} className="appearance-none my-2 mt-4 flex font-bold px-4 bg-[#1A1A1A] text-white gap-x-1 rounded-2xl hover:bg-indigo-600 transition-colors" onClick={handleSave}>
                                {exporting ?
                                    <svg aria-hidden="true" className="w-4 aspect-square my-auto mr-2 text-gray-200 animate-spin fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25" />
                                    </svg>
                                }

                                <div className="pt-1 pb-2">Preview export</div>
                            </button>
                            <button onClick={OpenModal} className="flex gap-x-1 text-stone-600 my-auto mt-4 my-2 px-4 hover:text-indigo-600 hover:underline">
                                <svg className="w-4 aspect-square my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                <div className="font-bold pt-1 pb-1">Image options</div>
                            </button>
                        </div>
                        <div className="flex mx-auto">
                            <button onClick={OpenShade} type="button" data-drawer-target="drawer-example" data-drawer-show="drawer-example" aria-controls="drawer-example" className="flex gap-x-1 text-stone-700 my-auto px-4 bg-white hover:bg-[#1A1A1A] hover:text-white rounded-xl shadow-sm border border-stone-100">
                                {/* <svg className="w-4 aspect-square my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg> */}
                                <div className="font-bold pt-1 pb-1">Edit Shades</div>
                            </button>
                        </div>
                    </div>
                    <div className="m-auto w-full py-4">
                        <section className="color-controls" aria-label="Color controls">
                            <label htmlFor="hex-color">Hex color</label>
                            <form onSubmit={event => {
                                event.preventDefault();
                                try { const tone = normalizeTone({ color: hexInput }); handleChange({ hex: tone.color }); }
                                catch (error) { setExportError(error.message); }
                            }} className="hex-form">
                                <input id="hex-color" value={hexInput} onChange={event => setHexInput(event.target.value)} spellCheck="false" maxLength={7} />
                                <button type="submit">Apply</button>
                            </form>
                            <label htmlFor="color-native" className="block mb-2">Choose a color</label><input id="color-native" type="color" value={color} onChange={event => handleChange({ hex: event.target.value })} className="w-full h-12 mb-4" />
                            <SketchPicker disableAlpha color={color} onChange={handleChange} width="100%" />
                            <div className="my-4 text-sm text-stone-600"><p>RGB {rgb.join(", ")}</p><p>HSL {hsl}</p></div><button onClick={downloadCSS} className="secondary-action">Download CSS palette</button>
                            <h2 className="font-bold mt-6">Text contrast</h2>
                            <p className="text-sm text-stone-600">Ratios for text placed on this color. Normal text needs 4.5:1; large text needs 3:1.</p>
                            {['#000000', '#ffffff'].map(ink => {
                                const ratio = contrastRatio(color, ink);
                                return <div key={ink} className="contrast-sample" style={{ background: color, color: ink }}>
                                    <strong>{ink === '#000000' ? 'Black' : 'White'} text</strong>
                                    <span>{ratio.toFixed(2)}:1 · {ratio >= 4.5 ? 'AA normal text' : ratio >= 3 ? 'AA large text only' : 'Below AA'}</span>
                                </div>;
                            })}
                            <button className="secondary-action" onClick={async () => {
                                try { await navigator.clipboard.writeText(color.toUpperCase()); setNotice('Hex color copied.'); }
                                catch { setNotice('Copy is unavailable. Select and copy the hex value above.'); }
                            }}>Copy hex color</button>
                            <p role="status">{notice}</p>
                        </section>
                    </div>
                </div>
                <section className="my-10"><h2 className="text-2xl font-bold mb-4">Explore more tones</h2><p className="mb-4 text-stone-600">Choose a swatch to use it in the studio.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{colorMap}</div></section>
            </main>
            </div>
        </div>
    );
}

export default Info;

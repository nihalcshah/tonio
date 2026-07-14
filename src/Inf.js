import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import { toPng } from 'html-to-image';
import { GetColorName } from 'hex-color-to-color-name';
import { SwatchesPicker, CirclePicker, SliderPicker, BlockPicker, SketchPicker } from "react-color";
import getContrastRatio from 'get-contrast-ratio';
import shader from 'shader';


function Outlined({ elementRef, selectedFont, selectedFontImport, color, colorName, fontSize }) {
    return (
        <div ref={elementRef} className="w-max">
            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
            <div className="px-4 pt-6 pb-4 min-w-[60%] m-auto flex flex-col shadow-xl bg-white " style={{ fontFamily: selectedFont }}>
                <div className="aspect-[3/4] w-full mx-auto p-2" style={{ background: color }}></div>
                <div className="flex w-full mx-auto justify-between p-2 gap-x-4">
                    <div className={"font-medium " + fontSize}>{color}</div>
                    <div className={" font-extrabold whitespace-nowrap " + fontSize}>{colorName}</div>
                </div>
            </div>
        </div>
    )
}

function Croptop({ elementRef, selectedFont, selectedFontImport, color, colorName, fontSize }) {
    return (
        <div ref={elementRef} className="w-max">
            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
            <div className="pb-3 grow w-max min-w-[60%] m-auto flex flex-col shadow-xl bg-white" style={{ fontFamily: selectedFont }}>
                <div className="aspect-[3/4] w-full mx-auto" style={{ background: color }}></div>
                <div className="flex w-full mx-auto justify-between p-2 pb-1 gap-x-4">
                    <div className={"font-medium " + fontSize}>{color}</div>
                    <div className={" font-extrabold whitespace-nowrap " + fontSize}>{colorName}</div>
                </div>
            </div>
        </div>
    )
}

function Buzzcut({ elementRef, selectedFont, selectedFontImport, color, colorName, fontSize }) {
    var textColor = "black"
    if (getContrastRatio("black", color) - 3 < getContrastRatio("white", color)) {
        textColor = "white"
    }
    return (
        <div ref={elementRef} className="w-max">
            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
            <div className="grow w-max m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: selectedFont, color: textColor }}>
                <div className="relative aspect-[5/6] w-64 mx-auto" style={{ background: color }}>
                    <div className={"absolute bottom-3 left-3 font-medium " + fontSize}>{color}</div>
                    <div className={"absolute bottom-3 right-3 font-extrabold whitespace-nowrap " + fontSize}>{colorName}</div>
                </div>
            </div>
        </div>
    )
}
function Cleancut({ elementRef, selectedFont, selectedFontImport, color, colorName, fontSize }) {
    var textColor = "black"
    if (getContrastRatio("black", color) - 2 < getContrastRatio("white", color)) {
        textColor = "white"
    }
    return (
        <div ref={elementRef} className="w-max">
            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
            <div className="grow w-max m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: selectedFont, color: textColor }}>
                <div className="relative aspect-square w-72 mx-auto" style={{ background: color }}></div>
            </div>
        </div>
    )
}

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

function Gallery({ galleryRef, selectedFont, selectedFontImport, setColor, setColorName, paletteColors, setPaletteColors }) {

    function CloseGallery(event) {
        galleryRef.current.classList.add("hidden")
    }

    function regenerate(event) {
        setPaletteColors(generateRandomColors(16))
    }

    function SelectColor(event) {
        galleryRef.current.classList.add("hidden")
        setColor(event.target.value)
        setColorName(GetColorName(event.target.value))
    }

    return (
        <div id="galleryModal" ref={galleryRef} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="fixed w-full h-full bg-black z-20 opacity-30 top-0 left-0"></div>
            <div class="relative w-full max-w-4xl max-h-full z-20">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-start justify-between p-4 pb-0  rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Tone Inspiration Gallery
                        </h3>

                        <button type="button" onClick={CloseGallery} data-modal-hide="galleryModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="flex px-4 pb-4 border-b">
                        <div className=" font-medium pt-1">Select a Tone for Inspiration</div>
                        <button type="button" onClick={regenerate} class="p-2 mx-2 z-30 text-sm font-medium text-white inline-flex items-center bg-gray-700 hover:bg-white hover:text-black rounded-lg text-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" class="w-3.5 h-3.5"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                        </button>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {paletteColors.map(function (data) {
                            var textColor = "black"
                            if (getContrastRatio("black", data) - 3 < getContrastRatio("white", data)) {
                                textColor = "white"
                            }
                            return (
                                <div>
                                    <div className="h-auto max-w-full object-cover rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-full h-full object-fit  z-20 rounded-lg opacity-0 block hover:opacity-100">
                                            <div className="w-full h-full bg-black absolute z-20 opacity-50">
                                            </div>
                                            <div className="w-full h-full flex z-30">
                                                <button type="button" value={data} onClick={SelectColor} data-modal-hide="galleryModal" class="px-5 m-auto z-30 py-2.5 text-sm font-medium text-white inline-flex items-center bg-gray-700 hover:bg-white hover:text-black rounded-lg text-center ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 mr-2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                                    </svg>
                                                    Select Color
                                                </button>
                                            </div>
                                        </div>
                                        <div className=" w-full">
                                            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
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
        </div>
    )
}

function Info() {
    const [color, setColor] = useState("#4F46E5")
    const [colorName, setColorName] = useState(GetColorName("#4F46E5"))
    const [saved, setSaved] = useState(false)
    const [selectedFont, setSelectedFont] = useState("Montserrat")
    const [selectedFontImport, setSelectedFontImport] = useState("https://fonts.googleapis.com/css?family=Montserrat")
    const elementRef = useRef(null);
    const modalRef = useRef(null);
    const colorPickerRef = useRef(null);
    const exportRef = useRef(null);
    const galleryRef = useRef(null);
    const [fontSize, setFontSize] = useState("text-md")
    const [elemInd, setElemInd] = useState(0)
    const [imgLink, setImgLink] = useState("")
    const [exporting, setExporting] = useState(false)
    const [imgSrc, setImgSrc] = useState("")
    const [fontList, setFontList] = useState([])
    const [exportLoaded, setExportLoaded] = useState(false)
    const [paletteColors, setPaletteColors] = useState(generateRandomColors(16))


    useEffect(() => {
        var fontL = ["Noto Sans NKo Unjoined", "AR One Sans", "Young Serif", "Gabarito", "Pixelify Sans", "Onest", "Dela Gothic One", "Martian Mono", "Sofia Sans Condensed", "Inria Sans", "Sofia Sans", "Autour One", "Instrument Sans", "Mohave", "Salsa", "Mooli", "Oxanium", "Besley", "REM", "Fanwood Text", "Catamaran", "Comme", "Wix Madefor Text", "Source Sans 3", "Inclusive Sans", "Iceland", "Kufam", "Georama", "Duru Sans", "Gayathri", "Boogaloo", "Paytone One", "JetBrains Mono", "Anek Latin", "Mina", "Fira Mono", "Roboto Serif", "Secular One", "Red Hat Mono", "Kalam", "Sriracha", "Sarabun", "Chango", "Gothic A1", "Metamorphous", "Rokkitt", "Barlow", "Indie Flower", "Space Grotesk", "Fredoka", "Sora", "Inconsolata", "Inter", "Dosis", "Cookie", "M PLUS 1p", "Great Vibes", "Cabin", "Playfair Display", "Libre Baskerville", "Jura", "Rancho", "Montserrat", "Cardo", "Overpass", "Oxygen", "Poppins", "Cormorant Garamond", "Merriweather", "Bebas Neue", "Quicksand", "Ubuntu", "Raleway", "Mitr", "Quattrocento Sans", "Lato", "Rubik", "Krub", "Baloo 2", "EB Garamond", "Nunito", "Anton", "Fira Sans", "Manrope", "Karla", "Josefin Sans", "Open Sans", "Bodoni Moda", "Yanone Kaffeesatz", "Rajdhani", "DM Sans", "Abel", "Caveat", "Work Sans", "Teko", "PT Serif", "Roboto Condensed", "Roboto Slab", "Roboto", "Righteous", "Zilla Slab", "Frank Ruhl Libre", "Urbanist", "Lobster", "Archivo", "Ubuntu Mono", "Lora", "Kanit", "Pridi", "PT Sans", "Oswald", "Petrona", "Vollkorn", "Blinker", "DM Serif Display", "Cinzel", "Exo 2", "Barlow Condensed", "Dancing Script", "Playfair Display SC", "Libre Franklin", "Bricolage Grotesque", "Manjari", "Nanum Gothic", "Space Mono", "Bitter", "Domine", "Spectral", "Inter Tight", "Newsreader", "Lexend", "Public Sans", "Sarabun", "Chivo", "Unbounded", "Sono", "Plus Jakarta Sans", "Albert Sans", "Figtree", "Outfit", "Epilogue", "Instrument Serif", "Sacramento", "Josefin Slab",]
        fontL.sort(() => Math.random() - 0.5);
        setFontList(fontL)
    }, []);

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    function handleChange(newColor, event) {
        setColor(newColor["hex"])
        setColorName(GetColorName(newColor["hex"]))
        setSaved(false)
    }

    function selectShade(hex) {
        setColor(hex)
        setColorName(GetColorName(hex))
        setSaved(false)
    }

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    function handleSave(event) {
        toPng(elementRef.current, { cacheBust: false }).then(async (dataUrl) => {
            const link = document.createElement("a");
            link.download = colorName + ".png";
            link.href = dataUrl;
            setImgLink(link)
            setImgSrc(dataUrl)
            setExporting(true);
            await timeout(1500);
            setExporting(false)
            exportRef.current.classList.remove("hidden")
        }).catch((err) => {
            console.log(err);
        });
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
        setElemInd(event.target.value)
    }

    function getFontsList(event) {
        return fontList.map(font =>
            <option value={font}>{font}</option>
        );
    }

    function handleFontChange(event) {
        var newFont = event.target.value.trim().replaceAll(" ", "+")
        setSelectedFont(toTitleCase(event.target.value.trim()));
        setSelectedFontImport("https://fonts.googleapis.com/css?family=" + newFont)
    }

    function changeFontSize(event) {
        setFontSize(event.target.value)
    }

    function OpenModal(event) {
        modalRef.current.classList.remove("hidden")
    }

    function imgClickLink(event) {
        imgLink.click()
    }

    function CloseModal(event) {
        modalRef.current.classList.add("hidden")
    }

    function CloseExport(event) {
        exportRef.current.classList.add("hidden")
    }

    function OpenGallery(event) {
        galleryRef.current.classList.remove("hidden")
    }

    function OpenColorPicker(event) {
        colorPickerRef.current.classList.remove("hidden")
    }

    function CloseColorPicker(event) {
        colorPickerRef.current.classList.add("hidden")
    }

    function exportLoad(event) {
        setExportLoaded(true)
    }

    function setRandomFont(event) {
        const randomFont = fontList[Math.floor(Math.random() * fontList.length)];
        var newFont = randomFont.trim().replaceAll(" ", "+")
        setSelectedFont(toTitleCase(randomFont.trim()));
        setSelectedFontImport("https://fonts.googleapis.com/css?family=" + newFont)
    }

    var [r, g, b] = hexToRgb(color)
    var [h, s, l] = rgbToHsl(r, g, b)
    var shadeList = getShadeList(color)

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
                    <button onClick={() => selectShade(generateRandomColors(1)[0])} className="p-2.5 rounded-full bg-[#1A1A1A] text-white transition-colors hover:bg-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                    </button>
                </div>
            </div>

            {/* off-screen node used only to render the chosen export style/font for PNG capture */}
            <div className="fixed -left-[9999px] top-0">
                {[
                    <Outlined color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                    <Croptop color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                    <Buzzcut color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                    <Cleancut color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                ][elemInd]}
            </div>

            <div id="exportModal" ref={exportRef} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="fixed w-full h-full bg-black z-20 opacity-30 top-0 left-0"></div>
                <div class="relative w-full max-w-2xl max-h-full z-20">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                Exported Image:
                            </h3>
                            <button type="button" onClick={CloseExport} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="exportModal">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="flex m-auto">
                            <img src={imgSrc} alt="" onLoad={exportLoad} className={exportLoaded ? "mx-auto w-1/3 m-3 shadow-lg" : "mx-auto w-1/3 m-3 shadow-lg hidden"} />
                            <div className={exportLoaded ? "hidden" : "flex items-center justify-center mx-auto h-max p-5 w-1/3 m-3 bg-gray-300 rounded dark:bg-gray-700"}>
                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex items-center self-center justify-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                            {saved ?
                                <button className="appearance-none my-2 mt-4 flex font-bold px-4 py-1 bg-white text-black gap-x-1 rounded-2xl hover:bg-black hover:text-white" onClick={imgClickLink}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" >
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <div className="">Saved</div>
                                </button> :
                                <button className="appearance-none my-2 mt-4 flex font-bold px-4 bg-black text-white gap-x-1 rounded-2xl hover:bg-white hover:text-black" onClick={imgClickLink}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <div className="pt-1 pb-2">Save</div>
                                </button>
                            }<span className="font-bold px-2 pt-1 pb-2 my-2 mt-4">OR</span>
                            <div className="pt-1 pb-2 my-2 mt-4 rounded-lg shadow px-2"> Hold Image and Add To Photos</div>
                        </div>
                    </div>
                </div>
            </div>

            <Gallery galleryRef={galleryRef} selectedFont={selectedFont} selectedFontImport={selectedFontImport} setColor={setColor} setColorName={setColorName} paletteColors={paletteColors} setPaletteColors={setPaletteColors} />

            <div id="colorPickerModal" ref={colorPickerRef} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="fixed w-full h-full bg-black z-20 opacity-30 top-0 left-0"></div>
                <div class="relative w-full max-w-2xl max-h-full z-20 m-auto">
                    <div class="relative bg-white rounded-2xl shadow">
                        <div class="flex items-start justify-between p-4 border-b rounded-t">
                            <h3 class="text-xl font-semibold text-gray-900">Change Color</h3>
                            <button type="button" onClick={CloseColorPicker} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4" id="myTabContent">
                            <div class="mb-4 flex flex-shrink border-b border-gray-200">
                                <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#pickerTabContent" role="tablist">
                                    <li class="mr-2" role="presentation">
                                        <button class="inline-block p-4 border-b-2 rounded-t-lg" id="swatches-tab" data-tabs-target="#swatches" type="button" role="tab" aria-controls="swatches" aria-selected="true">Swatches</button>
                                    </li>
                                    <li class="mr-2" role="presentation">
                                        <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="Circles-tab" data-tabs-target="#Circles" type="button" role="tab" aria-controls="Circles" aria-selected="false">Circles</button>
                                    </li>
                                    <li class="mr-2" role="presentation">
                                        <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="Slider-tab" data-tabs-target="#Slider" type="button" role="tab" aria-controls="Slider" aria-selected="false">Slider</button>
                                    </li>
                                    <li class="mr-2" role="presentation">
                                        <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="Block-tab" data-tabs-target="#Block" type="button" role="tab" aria-controls="Block" aria-selected="false">Block</button>
                                    </li>
                                    <li class="mr-2" role="presentation">
                                        <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300" id="colorful-tab" data-tabs-target="#colorful" type="button" role="tab" aria-controls="colorful" aria-selected="false">Colorful</button>
                                    </li>
                                </ul>
                            </div>
                            <div id="pickerTabContent">
                                <div class="p-4 rounded-lg bg-gray-50" id="swatches" role="tabpanel" aria-labelledby="swatches-tab">
                                    <SwatchesPicker className="w-full m-auto" color={color} onChange={handleChange} />
                                </div>
                                <div class="hidden p-4 rounded-lg bg-gray-50" id="Circles" role="tabpanel" aria-labelledby="Circles-tab">
                                    <CirclePicker className="left-1/2" color={color} onChange={handleChange} />
                                </div>
                                <div class="hidden p-4 rounded-lg bg-gray-50" id="Slider" role="tabpanel" aria-labelledby="Slider-tab">
                                    <SliderPicker className="w-full m-auto" color={color} onChange={handleChange} />
                                </div>
                                <div class="hidden p-4 rounded-lg bg-gray-50" id="Block" role="tabpanel" aria-labelledby="Block-tab">
                                    <BlockPicker className="w-full m-auto" color={color} onChange={handleChange} />
                                </div>
                                <div class="hidden p-4 rounded-lg bg-gray-50" id="colorful" role="tabpanel" aria-labelledby="colorful-tab">
                                    <SketchPicker className="w-full m-auto" color={color} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="staticModal" ref={modalRef} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="fixed w-full h-full bg-black z-20 opacity-30 top-0 left-0"></div>
                <div class="relative w-full max-w-2xl max-h-full z-20">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                Customize your image
                            </h3>
                        </div>
                        <div class="p-6 h-min ">
                            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">Preferred Style</h3>
                            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
                            <ul class="grid w-full place-center grid-cols-2 md:grid-cols-4 gap-1" style={{ fontFamily: selectedFont }}>
                                <li className="m-auto">
                                    <input type="radio" onChange={handleStyleChange} id="outlined" name="type" value={0} class="hidden peer" required />
                                    <label for="outlined" class="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div class="block">
                                            <div class="w-max flex">
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
                                    <input type="radio" onChange={handleStyleChange} id="croptop" name="type" value={1} class="hidden peer" required />
                                    <label for="croptop" class="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div class="block">
                                            <div class="w-max flex">
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
                                    <input type="radio" id="buzzcut" onChange={handleStyleChange} name="type" value={2} class="hidden peer" required />
                                    <label for="buzzcut" class="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div class="block">
                                            <div class="w-max flex">
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
                                    <input type="radio" id="cleancut" name="type" onChange={handleStyleChange} value={3} class="hidden peer" required />
                                    <label for="cleancut" class="flex items-center w-max p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div class="block">
                                            <div class="w-max flex">
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
                        <div class="p-6 h-min ">
                            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">Preferred Font</h3>

                            <ul class="grid w-full grid-cols-2 md:grid-cols-3 gap-2">
                                <li className="m-auto w-full" style={{ fontFamily: "Montserrat" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat" crossorigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Montserrat" name="font" value="Montserrat" class="hidden peer" required />
                                    <label for="Montserrat" class="text-left flex flex-col w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div className="font-semibold text-md text-black text-left ">Montserrat</div>
                                        <div className="font-semibold text-lighter text-xs text-left ">Geometric.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "DM Sans" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=DM+Sans" crossorigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="DM Sans" name="font" value="DM Sans" class="hidden peer" required />
                                    <label for="DM Sans" class="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div className="font-semibold text-md text-black text-left">DM Sans</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Modern.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Sacramento" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sacramento" crossorigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Sacramento" name="font" value="Sacramento" class="hidden peer" required />
                                    <label for="Sacramento" class="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div className="font-semibold text-md text-black text-left">Sacramento</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Sweet.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Raleway" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway" crossorigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Raleway" name="font" value="Raleway" class="hidden peer" required />
                                    <label for="Raleway" class="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div className="font-semibold text-md text-black text-left">Raleway</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Minimalist.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full" style={{ fontFamily: "Josefin Sans" }}>
                                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Josefin Sans" crossorigin="anonymous" />
                                    <input type="radio" onChange={handleFontChange} id="Josefin Sans" name="font" value="Josefin Sans" class="hidden peer" required />
                                    <label for="Josefin Sans" class="text-left flex flex-col p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div className="font-semibold text-md text-black text-left">Josefin Sans</div>
                                        <div className="font-semibold text-lighter text-xs text-left">Art Deco.</div>
                                    </label>
                                </li>
                                <li className="m-auto w-full">
                                    <label class="text-left flex flex-col p-3 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div className="font-semibold text-md text-black text-left mb-1">Get a random font</div>
                                        <button type="button" onClick={setRandomFont} class="p-2 mx-2 z-30 text-sm font-medium text-white inline-flex items-center bg-gray-700 hover:bg-white hover:text-black rounded-lg text-center ">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" class="w-3.5 h-3.5 mr-2"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                            Randomize
                                        </button>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div className="p-6 pt-3 pb-2 h-min">
                            <label for="countries" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">More Font Options</label>
                            <select onChange={handleFontChange} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected disabled>Choose From Dropdown</option>
                                {getFontsList()}
                            </select>
                        </div>
                        <div class="p-6 h-min flex flex-col">
                            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">Font Size</h3>
                            <div class="inline-flex rounded-md shadow-sm mx-auto">
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="sm" name="fontsize" value="text-sm" class="hidden peer" required />
                                    <label for="sm" class="px-4 py-2 text-md font-medium text-gray-900 bg-white border rounded-l-lg border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        SM
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="md" name="fontsize" value="text-md" class="hidden peer" required />
                                    <label for="md" class="px-4 py-2 text-md font-semibold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        MD
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="lg" name="fontsize" value="text-lg" class="hidden peer" required />
                                    <label for="lg" class="px-4 py-2 text-md font-bold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        LG
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="xl" name="fontsize" value="text-xl" class="hidden peer" required />
                                    <label for="xl" class="px-4 py-2 text-md font-extrabold text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        XL
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="2xl" name="fontsize" value="text-2xl" class="hidden peer" required />
                                    <label for="2xl" class="px-4 py-2 text-md font-black text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        2XL
                                    </label>
                                </div>
                                <div>
                                    <input type="radio" onChange={changeFontSize} id="3xl" name="fontsize" value="text-3xl" class="hidden peer" required />
                                    <label for="3xl" class="px-4 py-2 text-md font-black text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-600">
                                        3XL
                                    </label>
                                </div>
                            </div>
                        </div>


                        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <button data-modal-hide="staticModal" onClick={CloseModal} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1512px] mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-start">

                {/* Left sidebar: permanent shades panel + export palette */}
                <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-6">
                    <div className="bg-white border border-[#EFECE6] rounded-3xl shadow-sm p-6 flex flex-col gap-2">
                        <div className="font-bold text-xs tracking-[0.15em] uppercase text-stone-400 mb-2">Color Shades</div>
                        {shadeList.map(function (shade) {
                            return (
                                <button
                                    type="button"
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                </svg>
                                <div className="text-[10px] font-medium">CSS</div>
                            </button>
                            <button onClick={handleSave} className="flex-1 flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-3 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
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
                                <button onClick={OpenModal} className="backdrop-blur w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                    </svg>
                                </button>
                                <button onClick={OpenGallery} className="backdrop-blur w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="absolute bottom-8 left-8 flex flex-col gap-4 max-w-[80%]">
                                <div className="backdrop-blur-md bg-white/20 rounded-full px-3 py-2 w-max">
                                    <div className="text-white text-[10px] font-bold tracking-wider uppercase">Primary UI Tone</div>
                                </div>
                                <div className="font-display text-white text-4xl md:text-6xl font-bold tracking-tight">{colorName}</div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 md:p-10">
                            <div className="flex flex-col gap-1">
                                <div className="font-display font-bold text-3xl uppercase tracking-tight text-[#1A1A1A]">{color}</div>
                                <div className="text-stone-400 text-sm font-medium">RGB({r}, {g}, {b}) &bull; HSL({h}, {s}%, {l}%)</div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={OpenColorPicker} className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 rounded-2xl px-6 py-4 font-bold text-[#1A1A1A]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                                    </svg>
                                    Change Color
                                </button>
                                <button onClick={handleSave} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 rounded-2xl px-6 py-4 font-bold text-white">
                                    {exporting ?
                                        <svg aria-hidden="true" class="w-4 h-4 text-orange-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    }
                                    Export Palette
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="font-display font-bold text-lg text-[#1A1A1A]">Similar Tones</div>
                        <button onClick={OpenGallery} className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-4">
                        {paletteColors.slice(0, 4).map(function (hex) {
                            return (
                                <button
                                    type="button"
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

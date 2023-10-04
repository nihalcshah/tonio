import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import { toPng } from 'html-to-image';
import { GetColorName } from 'hex-color-to-color-name';
import { SwatchesPicker, CirclePicker, SliderPicker, BlockPicker, SketchPicker } from "react-color";
import getContrastRatio from 'get-contrast-ratio';


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



function Gallery({ galleryRef, selectedFont, selectedFontImport, fontSize, setColor, setColorName, colorMap, setColorMap, generateColorMap }) {


    function CloseGallery(event) {
        galleryRef.current.classList.add("hidden")
    }

    function setCol(event) {
        setColorMap(generateColorMap())
        console.log(colorMap)
    }

    return (
        <div id="galleryModal" ref={galleryRef} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div class="relative w-full max-w-4xl max-h-full">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div class="flex items-start justify-between p-4 pb-0  rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Tone Inspiration Gallery
                        </h3>

                        <button type="button" onClick={CloseGallery} data-modal-hide="galleryModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="galleryModal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="flex px-4 pb-4 border-b">
                        <div className=" font-medium pt-1">Select a Tone for Inspiration</div>
                        <button type="button" onClick={setCol} class="p-2 mx-2 z-30 text-sm font-medium text-white inline-flex items-center bg-gray-700 hover:bg-white hover:text-black rounded-lg text-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" class="w-3.5 h-3.5"><path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                            {/* Randomize */}
                        </button>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                        {colorMap}
                    </div>
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
                <div className="relative aspect-[3/4] w-64 mx-auto" style={{ background: color }}>
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
                <div className="relative aspect-square w-72 mx-auto" style={{ background: color }}>
                    <div className={"absolute bottom-3 left-3 font-medium " + fontSize}>{color}</div>
                    <div className={"absolute bottom-3 right-3 font-extrabold whitespace-nowrap " + fontSize}>{colorName}</div>
                </div>

            </div>
        </div>
    )
}

function Info() {
    const [color, setColor] = useState("#000000")
    const [colorName, setColorName] = useState("Black")
    const [saved, setSaved] = useState(false)
    const [selectedFont, setSelectedFont] = useState("Montserrat")
    const [selectedFontImport, setSelectedFontImport] = useState("https://fonts.googleapis.com/css?family=Montserrat")
    const elementRef = useRef(null);
    const modalRef = useRef(null);
    const exportRef = useRef(null);
    const galleryRef = useRef(null);
    const [fontSize, setFontSize] = useState("text-md")
    const [elemInd, setElemInd] = useState(0)
    const [imgLink, setImgLink] = useState("")
    const [imgSrc, setImgSrc] = useState("")



    function SelectColor(event) {
        galleryRef.current.classList.add("hidden")
        setColor(event.target.value)
        setColorName(GetColorName(event.target.value))
    }

    function generateColorMap() {
        var colors = []
        for (var i = 0; i < 16; i++) {
            colors.push("#" + Math.floor(Math.random() * 16777215).toString(16))
        }
        var cm = colors.map(function (data) {
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
                        {/* <img class="rounded-lg z-10" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg" alt="" /> */}
                        <div className=" w-full">
                            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
                            <div className="grow w-full m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: selectedFont, color: textColor }}>
                                <div className="relative aspect-[3/4] w-full mx-auto" style={{ background: data }}>
                                    <div className={"absolute bottom-7 left-2 font-medium " + "text-md"}>{data}</div>
                                    <div className={"absolute bottom-2 left-2 font-extrabold whitespace-nowrap " + "text-md"}>{GetColorName(data)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
        return cm
    }

    var newscm = generateColorMap()
    const [colorMap, setColorMap] = useState(newscm)
    // console.log("news", newscm)
    // setColorMap(newscm)

    function handleChange(newColor, event) {
        console.log(newColor)
        setColor(newColor["hex"])
        setColorName(GetColorName(newColor["hex"]))
        setSaved(false)
    }

    function handleSave(event) {
        toPng(elementRef.current, { cacheBust: false }).then((dataUrl) => {
            const link = document.createElement("a");
            link.download = colorName + ".png";
            link.href = dataUrl;
            setImgLink(link)
            setImgSrc(dataUrl)
            exportRef.current.classList.remove("hidden")
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleStyleChange(event) {
        setElemInd(event.target.value)
    }

    function handleFontChange(event) {
        var newFont = event.target.value.trim().replaceAll(" ", "+")
        setSelectedFont(event.target.value.trim());
        setSelectedFontImport("https://fonts.googleapis.com/css?family=" + newFont)
        console.log(selectedFontImport, selectedFont)
    }

    function changeFontSize(event) {
        setFontSize(event.target.value)
        console.log(event.target.value, fontSize)
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

    function OpenGallery(event){
        galleryRef.current.classList.remove("hidden")
    }

    return (
        <div className="relative w-screen min-h-screen flex flex-col overflow-x-hidden bg-gray-100">
            <div className="relative w-screen p-4 shadow-md flex">
                <a className="flex" href="/">
                    <img src="./tonio.png" className="w-8 aspect-square my-auto mx-2" />
                    <div className="font-medium text-3xl mb-1">Tone.io</div>
                </a>
            </div>

            <div id="exportModal" ref={exportRef} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative w-full max-w-2xl max-h-full">

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
                            <img src={imgSrc} className="mx-auto w-1/3 m-3 shadow-lg" />
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

            <Gallery galleryRef={galleryRef} selectedFont={selectedFont} selectedFontImport={selectedFontImport} fontSize={fontSize} setColor={setColor} setColorName={setColorName} colorMap={colorMap} setColorMap={setColorMap} generateColorMap={generateColorMap} />

            <div id="staticModal" ref={modalRef} data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="hidden fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative w-full max-w-2xl max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                Customize your image
                            </h3>
                        </div>
                        <div class="p-6 h-min ">
                            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">Preferred Font</h3>
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
                            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">Preferred Style</h3>

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
                                        <div className="font-semibold text-md text-black text-left mb-1">Your Own Font:</div>
                                        <input type="text" onChangeCapture={handleFontChange} className="font-semibold text-lighter text-xs text-left" id="helper-text" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-xs px-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Defaults to Poppin" />
                                    </label>
                                </li>
                            </ul>

                        </div>
                        <div class="p-6 h-min flex flex-col">
                            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">Font Size</h3>
                            <div class="inline-flex rounded-md shadow-sm mx-auto">
                                {/* <button onClickCapture={changeFontSize} class="px-4 py-2 text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                        XS
                                    </button> */}
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

            <div className="md:p-5 p-1 m-auto w-5/6 ">
                <div className="font-bold md:text-4xl text-2xl">Customize</div>
                <div className="font-medium md:text-md text-sm">Create a Tone Swatch</div>
                <button className="flex p-1.5 rounded-lg bg-black text-white hover:bg-white hover:text-black gap-2 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 m-auto" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <div className="text-sm" data-modal-target="galleryModal" data-modal-toggle="galleryModal">Visit Gallery For Colors</div>
                </button>
                <div className="grid md:grid-cols-2">
                    <div className="md:p-8 p-4 flex flex-col items-center"  >
                        {[
                            <Outlined color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                            <Croptop color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                            <Buzzcut color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                            <Cleancut color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                        ][elemInd]}
                        <div className="flex gap-x-3 mx-auto">
                            <button data-modal-target="exportModal" data-modal-toggle="exportModal" className="appearance-none my-2 mt-4 flex font-bold px-4 bg-black text-white gap-x-1 rounded-2xl hover:bg-white hover:text-black" onClick={handleSave}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25" />
                                </svg>
                                <div className="pt-1 pb-2">Export</div>
                            </button>
                            <button data-modal-target="staticModal" onClick={OpenModal} data-modal-toggle="staticModal" className="flex gap-x-1 text-black my-auto mt-4 my-2 px-4 hover:underline">
                                <svg className="w-4 aspect-square my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                <div className="font-bold pt-1 pb-1">Customize</div>
                            </button>
                        </div>
                    </div>
                    <div className="m-auto w-full py-4">
                        <div class="mb-4 hidden md:flex flex-shrink border-b border-gray-200 dark:border-gray-700">
                            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                                <li class="mr-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 rounded-t-lg" id="swatches-tab" data-tabs-target="#swatches" type="button" role="tab" aria-controls="swatches" aria-selected="true">Swatches</button>
                                </li>
                                <li class="mr-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="Circles-tab" data-tabs-target="#Circles" type="button" role="tab" aria-controls="Circles" aria-selected="false">Circles</button>
                                </li>
                                <li class="mr-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="Slider-tab" data-tabs-target="#Slider" type="button" role="tab" aria-controls="Slider" aria-selected="false">Slider</button>
                                </li>
                                <li class="mr-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="Block-tab" data-tabs-target="#Block" type="button" role="tab" aria-controls="Block" aria-selected="false">Block</button>
                                </li>
                                <li class="mr-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="colorful-tab" data-tabs-target="#colorful" type="button" role="tab" aria-controls="colorful" aria-selected="false">Colorful</button>
                                </li>
                            </ul>
                        </div>
                        <div className="hidden md:block" id="myTabContent">
                            <div class=" p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="swatches" role="tabpanel" aria-labelledby="swatches-tab">
                                <SwatchesPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800 " id="Circles" role="tabpanel" aria-labelledby="Circles-tab">
                                <CirclePicker className="left-1/2" color={color} onChange={handleChange} />
                            </div>
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="Slider" role="tabpanel" aria-labelledby="Slider-tab">
                                <SliderPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="Block" role="tabpanel" aria-labelledby="Block-tab">
                                <BlockPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="colorful" role="tabpanel" aria-labelledby="colorful-tab">
                                <SketchPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="md:hidden">
                            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="swatches" role="tabpanel" aria-labelledby="swatches-tab">
                                <SwatchesPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="Slider" role="tabpanel" aria-labelledby="Slider-tab">
                                <SliderPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Info;
import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import { toPng } from 'html-to-image';
import { GetColorName } from 'hex-color-to-color-name';
import { SwatchesPicker, CirclePicker, SliderPicker, BlockPicker, SketchPicker } from "react-color";
import getContrastRatio from 'get-contrast-ratio';


function Outlined({ elementRef, selectedFont, selectedFontImport, color, colorName, fontSize }) {
    return (
        <div ref={elementRef} className="w-full">
            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
            <div className="px-4 pt-6 pb-4 grow w-max min-w-[60%] m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: selectedFont }}>
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
        <div ref={elementRef} className="w-full">
            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
            <div className="pb-3 grow w-max min-w-[60%] m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: selectedFont }}>
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
    if (getContrastRatio("black", color)-3 < getContrastRatio("white", color)) {
        textColor = "white"
    }
    console.log(textColor)
    return (
        <div ref={elementRef} className="w-full">
            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
            <div className="grow w-max m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: selectedFont, color: textColor }}>
                <div className="relative aspect-[3/4] w-64 mx-auto" style={{ background: color }}>
                    <div className={"absolute bottom-2 left-2 font-medium " + fontSize}>{color}</div>
                    <div className={"absolute bottom-2 right-2 font-extrabold whitespace-nowrap " + fontSize}>{colorName}</div>
                </div>

            </div>
        </div>
    )
}
function Cleancut({ elementRef, selectedFont, selectedFontImport, color, colorName, fontSize }) {
    var textColor = "black"
    if (getContrastRatio("black", color)-2 < getContrastRatio("white", color)) {
        textColor = "white"
    }
    return (
        <div ref={elementRef} className="w-full">
            <link rel="stylesheet" href={selectedFontImport} crossorigin="anonymous" />
            <div className="grow w-max m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: selectedFont, color: textColor }}>
                <div className="relative aspect-square w-72 mx-auto" style={{ background: color }}>
                    <div className={"absolute bottom-2 left-2 font-medium " + fontSize}>{color}</div>
                    <div className={"absolute bottom-2 right-2 font-extrabold whitespace-nowrap " + fontSize}>{colorName}</div>
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
    const [fontSize, setFontSize] = useState("text-md")
    const [elemInd, setElemInd] = useState(0)

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
            setSaved(true)
            link.click();
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

    return (
        <div className="relative w-screen min-h-screen flex flex-col overflow-x-hidden bg-gray-100">
            <div className="relative w-screen p-4 shadow-md flex">
                <a className="flex" href="/">
                    <img src="./tonio.png" className="w-8 aspect-square my-auto mx-2" />
                    <div className="font-medium text-3xl mb-1">Tone.io</div>
                </a>
            </div>

            <div id="staticModal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
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
                            <button data-modal-hide="staticModal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:p-5 p-1 m-auto w-5/6 ">
                <div className="font-bold md:text-4xl text-2xl">Customize</div>
                <div className="font-medium md:text-md text-sm">Create a Tone Swatch</div>
                <div className="grid md:grid-cols-2">
                    <div className="md:p-8 p-4 flex flex-col"  >
                        {[
                            <Outlined color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                            <Croptop color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                            <Buzzcut color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                            <Cleancut color={color} selectedFont={selectedFont} selectedFontImport={selectedFontImport} elementRef={elementRef} colorName={colorName} fontSize={fontSize} />,
                        ][elemInd]}
                        <div className="flex gap-x-3 mx-auto">
                            {saved ?
                                <button className="appearance-none my-2 mt-4 flex font-bold px-4 py-1 bg-white text-black gap-x-1 rounded-2xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" >
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <div className="">Saved</div>
                                </button> :
                                <button className="appearance-none my-2 mt-4 flex font-bold px-4 bg-black text-white gap-x-1 rounded-2xl hover:bg-white hover:text-black" onClick={handleSave}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <div className="pt-1 pb-2">Save</div>
                                </button>
                            }
                            <button data-modal-target="staticModal" data-modal-toggle="staticModal" className="flex gap-x-1 text-black my-auto mt-4 my-2 px-4 hover:underline">
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
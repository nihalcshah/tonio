import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"
import { toPng } from 'html-to-image';
import { GetColorName } from 'hex-color-to-color-name';
import { SwatchesPicker, CirclePicker, SliderPicker, BlockPicker, SketchPicker } from "react-color";

function Info() {
    const [color, setColor] = useState("#000000")
    const [colorName, setColorName] = useState("Black")
    const [saved, setSaved] = useState(false)

    const elementRef = useRef(null);

    function handleChange(newColor, event) {
        console.log(newColor)
        setColor(newColor["hex"])
        setColorName(GetColorName(newColor["hex"]))
        setSaved(false)
    }

    function handleSave(event) {
        toPng(elementRef.current, { cacheBust: false}).then((dataUrl) => {
            const link = document.createElement("a");
            link.download = colorName + ".png";
            link.href = dataUrl;
            setSaved(true)
            link.click();
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="relative w-screen min-h-screen flex flex-col overflow-x-hidden bg-gray-100">
            <div className="relative w-screen p-4 shadow-md flex">
                <a className="flex" href="/">
                    <img src="./tonio.png" className="w-8 aspect-square my-auto mx-2" />
                    <div className="font-medium text-3xl mb-1">Tone.io</div>
                </a>
            </div>
            <div className="md:p-5 p-1 m-auto w-5/6 ">
                <div className="font-bold md:text-4xl text-2xl">Customize</div>
                <div className="font-medium md:text-md text-sm">Create a Tone Swatch</div>
                <div className="grid md:grid-cols-2">
                    <div className="p-8 flex flex-col"  >
                        <div ref={elementRef} className="w-full">
                            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat" crossorigin="anonymous" />
                            <div className="px-4 pt-6 pb-4 grow w-max min-w-[60%] m-auto flex flex-col bg-white shadow-xl" style={{ fontFamily: "Montserrat" }}>
                                <div className="aspect-[3/4] w-full mx-auto p-2" style={{ background: color }}></div>
                                <div className="flex w-full mx-auto justify-between p-2 gap-x-4">
                                    <div className="text-md font-medium">{color}</div>
                                    <div className="text-md font-extrabold whitespace-nowrap">{colorName}</div>
                                </div>
                            </div>
                        </div>
                        
                        {saved ?
                            <button className="appearance-none my-2 mt-4 flex font-bold px-4 py-1 mx-auto bg-white text-black gap-x-1 rounded-2xl w-max">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                <div className="">Saved</div>
                            </button> :
                            <button className="appearance-none my-2 mt-4 flex font-bold px-4  mx-auto bg-black text-white gap-x-1 rounded-2xl w-max hover:bg-white hover:text-black" onClick={handleSave}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <div className="pt-1 pb-2">Save</div>
                            </button>
                        }

                    </div>
                    <div className="m-auto w-full py-4">
                        <div class="mb-4 flex flex-shrink border-b border-gray-200 dark:border-gray-700">
                            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                                <li class="mr-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Swatches</button>
                                </li>
                                <li class="mr-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Circles</button>
                                </li>
                                <li class="mr-2" role="presentation">
                                    <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Slider</button>
                                </li>
                                <li role="presentation">
                                    <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts" aria-selected="false">Block</button>
                                </li>
                                <li role="presentation">
                                    <button class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="colorful-tab" data-tabs-target="#colorful" type="button" role="tab" aria-controls="colorful" aria-selected="false">Colorful</button>
                                </li>
                            </ul>
                        </div>
                        <div id="myTabContent">
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800 flex" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <SwatchesPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800 " id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
                                <CirclePicker className="left-1/2" color={color} onChange={handleChange} />
                            </div>
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
                                <SliderPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
                                <BlockPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="colorful" role="tabpanel" aria-labelledby="colorful-tab">
                                <SketchPicker className="w-full m-auto" color={color} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Info;
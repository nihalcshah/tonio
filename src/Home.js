import React from "react";
import { useRef, useEffect, useState } from 'react';
import "./index.css"

function Home() {
    return (
        <div className="relative w-screen h-screen">
            <div className="fixed w-screen p-4 shadow-md flex">
                <a className="flex" href="/">
                    <img src="./tonio.png" className="w-8 aspect-square my-auto mx-2" />
                    <div className="font-medium text-3xl mb-1">Tone.io</div>
                </a>
            </div>
            <div className="flex w-screen h-screen">
                <div className="m-auto ">
                    <div className=" text-center font-bold text-8xl ">Tone.io</div>
                    <div className="text-xl text-center mt-2">Add Some Color to Your Life</div>
                    <div className="flex mt-4">
                        <a href="/customize" className="text-md font-bold text-center bg-black text-white border-black  px-4 pt-1 pb-2 rounded-xl m-auto  hover:bg-gradient hover:bg-gradient-to-tr hover:from-purple-600 hover:to-orange-500 hover:rounded-xl hover:border-white">
                            Develop Your Tones
                        </a>
                    </div>
                </div> 
            </div>
            <div className="absolute bottom-8 left-8 appearance-none rounded-full bg-black flex hover:bg-gradient hover:bg-gradient-to-tr hover:from-purple-600 hover:to-orange-500">
                <div className="flex">
                    <button  id="dropdownDefaultButton" data-dropdown-toggle="dropdown-d" className="p-2">
                        <div className="text-white w-6 aspect-square mt-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-white" viewBox="0 0 576 512"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>
                        </div>
                    </button>
                    <div id="dropdown-d" className="hidden flex bg-black rounded-full">
                        <div className="p-2"><img src="https://velog.velcdn.com/images/diso592/post/8c07ebac-2637-48b8-ae55-41915e2e30bf/image.png" className="w-6 aspect-square" /></div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Home;
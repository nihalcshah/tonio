import React from "react";
import "./index.css"

function Home() {
    return (
        <div className="relative w-screen min-h-screen bg-[#FAF8F5] text-[#1A1A1A] overflow-hidden">
            <nav className="fixed top-0 w-screen px-6 py-5 flex items-center z-20 bg-[#FAF8F5]">
                <a className="flex items-center gap-2" href="/">
                    <img src="./tonio.png" className="w-8 aspect-square my-auto rounded-lg" alt="Tone.io" />
                    <div className="font-display font-bold text-2xl tracking-tight">Tone.io</div>
                </a>
            </nav>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[12%] w-24 h-32 bg-orange-400 rounded-xl shadow-2xl rotate-[-12deg] opacity-70 mix-blend-multiply"></div>
                <div className="absolute bottom-[22%] right-[12%] w-28 h-36 bg-indigo-500 rounded-xl shadow-2xl rotate-[15deg] opacity-60 mix-blend-multiply"></div>
                <div className="absolute top-[15%] right-[18%] w-20 h-28 bg-rose-400 rounded-xl shadow-2xl rotate-[8deg] opacity-50 mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <div className="font-display font-extrabold tracking-tighter leading-[0.9] text-7xl md:text-9xl mb-6">
                    Tone<span className="text-indigo-600">.</span>io
                </div>
                <div className="text-xl md:text-2xl text-gray-600 max-w-xl mb-10">Add Some Color to Your Life</div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="/customize" className="group inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-[#1A1A1A] rounded-full transition-all duration-200 hover:bg-indigo-600 hover:-translate-y-0.5">
                        Develop Your Tones
                    </a>
                    <a href="/recolor" className="inline-flex items-center justify-center px-8 py-4 font-bold text-[#1A1A1A] bg-transparent border-2 border-[#1A1A1A] rounded-full transition-all duration-200 hover:border-indigo-600 hover:text-indigo-600 hover:-translate-y-0.5">
                        Recolor a Photo
                    </a>
                </div>
            </div>

            <div className="absolute bottom-8 left-8 z-20 appearance-none rounded-full bg-[#1A1A1A] flex transition-colors hover:bg-indigo-600">
                <div className="flex">
                    <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown-d" className="p-3">
                        <div className="text-white w-5 aspect-square">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-white" viewBox="0 0 576 512"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>
                        </div>
                    </button>
                    <div id="dropdown-d" className="hidden flex bg-[#1A1A1A] rounded-full">
                        <div className="p-2"><img src="https://velog.velcdn.com/images/diso592/post/8c07ebac-2637-48b8-ae55-41915e2e30bf/image.png" className="w-5 aspect-square rounded-full" alt="" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
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
    const shadeRef = useRef(null);
    const [fontSize, setFontSize] = useState("text-md")
    const [elemInd, setElemInd] = useState(0)
    const [imgLink, setImgLink] = useState("")
    const [exporting, setExporting] = useState(false)
    const [imgSrc, setImgSrc] = useState("")
    const [fontList, setFontList] = useState([])
    const [exportLoaded, setExportLoaded] = useState(false)


    useEffect(() => {
        var fontL = ["Noto Sans NKo Unjoined", "AR One Sans", "Young Serif", "Gabarito", "Pixelify Sans", "Onest", "Dela Gothic One", "Martian Mono", "Noto Serif NP Hmong", "Sofia Sans Condensed", "Inria Sans", "Noto Sans Bengali", "Sofia Sans", "Autour One", "Noto Sans Tagalog", "Yuji Hentaigana Akari", "Fragment Mono", "Sofia Sans Extra Condensed", "Croissant One", "Fuggles", "VT323", "Flow Rounded", "Instrument Sans", "Zen Loop", "Mohave", "Salsa", "Mooli", "Kaisei Opti", "Big Shoulders Stencil Display", "Oxanium", "Anuphan", "Besley", "Timmana", "Agdasima", "Material Symbols Sharp", "REM", "Fanwood Text", "Vibes", "Catamaran", "BIZ UDPMincho", "Comme", "Libre Barcode 128", "Akatab", "Erica One", "Moirai One", "Noto Serif Devanagari", "Bahiana", "Trirong", "Wix Madefor Text", "Source Sans 3", "Loved by the King", "Inclusive Sans", "Noto Music", "Iceland", "Kufam", "Hurricane", "Georama", "Vampiro One", "Snippet", "Grechen Fuemen", "Baloo Tamma 2", "Geologica", "Bai Jamjuree", "Just Me Again Down Here", "IBM Plex Sans JP", "Material Symbols Rounded", "Duru Sans", "Arbutus", "Rubik Beastly", "ADLaM Display", "Gayathri", "Noto Sans Bamum", "Jolly Lodger", "Noto Sans Display", "Boogaloo", "Scheherazade New", "Paytone One", "Noto Serif Armenian", "Just Another Hand", "JetBrains Mono", "Anek Latin", "IBM Plex Sans Devanagari", "Frijole", "Noto Serif Kannada", "Anek Odia", "Noto Sans Symbols", "Libre Barcode 39 Extended Text", "Be Vietnam Pro", "Mina", "Mochiy Pop One", "Bagel Fat One", "Fira Mono", "Bigshot One", "Zen Old Mincho", "Redacted", "Lexend Tera", "Glass Antiqua", "Flow Block", "Roboto Serif", "Secular One", "Red Hat Mono", "Alike Angular", "Square Peg", "Montagu Slab", "Noto Sans Cuneiform", "Castoro Titling", "Wellfleet", "Poor Story", "Alatsi", "Anek Devanagari", "Bonheur Royale", "Stick No Bills", "Pathway Extreme", "Asap Condensed", "Tiro Telugu", "Jomolhari", "Redacted Script", "Big Shoulders Stencil Text", "Whisper", "Bowlby One", "Are You Serious", "Familjen Grotesk", "Aref Ruqaa Ink", "Hi Melody", "Noto Sans Batak", "Scada", "Ysabeau Office", "Explora", "Patrick Hand SC", "Anek Gurmukhi", "Noto Sans Miao", "Send Flowers", "Ruge Boogie", "Sedgwick Ave Display", "Road Rage", "Libre Barcode 39 Extended", "Noto Sans Tangsa", "Encode Sans", "Limelight", "Karma", "Merienda", "Lexend", "Homemade Apple", "Sunshiney", "Kdam Thmor Pro", "Aboreto", "Noto Serif Georgian", "Bubblegum Sans", "Hanken Grotesk", "Carattere", "NTR", "Libre Barcode 128 Text", "Fraunces", "Anek Bangla", "Alkatra", "Epilogue", "Aguafina Script", "Geo", "Mulish", "Noto Sans Multani", "Baloo Chettan 2", "Gloock", "Kavivanar", "Luxurious Roman", "Noto Sans Old South Arabian", "Noto Serif Ottoman Siyaq", "Noto Sans Egyptian Hieroglyphs", "Instrument Serif", "Noto Sans Old Hungarian", "Noto Sans Balinese", "Meie Script", "Texturina", "Edu VIC WA NT Beginner", "Rum Raisin", "Chakra Petch", "Jaldi", "Rubik Puddles", "Baloo Bhai 2", "Linden Hill", "Mr Bedfort", "Noto Sans Armenian", "Satisfy", "McLaren", "Cairo Play", "Albert Sans", "Audiowide", "IM Fell French Canon SC", "Vibur", "Fontdiner Swanky", "Lunasima", "Bubbler One", "Oldenburg", "Rubik Glitch", "Island Moments", "Akaya Kanadaka", "Noto Sans Old Turkic", "Orbit", "Rubik Wet Paint", "Antic", "Allison", "Mystery Quest", "Meddon", "Alata", "Tiro Gurmukhi", "Quando", "Noto Rashi Hebrew", "Carter One", "Akshar", "Asul", "Domine", "Rubik Storm", "Give You Glory", "Chelsea Market", "Strait", "Anek Gujarati", "East Sea Dokdo", "Corben", "Forum", "Italiana", "Rammetto One", "Figtree", "Shalimar", "Nerko One", "Dhurjati", "Kodchasan", "ZCOOL KuaiLe", "Nova Oval", "Fugaz One", "Libre Bodoni", "Noto Sans Math", "Estonia", "Spline Sans Mono", "B612 Mono", "Signika Negative", "Baumans", "Istok Web", "Nobile", "Tourney", "Freehand", "Source Code Pro", "Noto Emoji", "Text Me One", "Telex", "Jockey One", "Chivo Mono", "Finlandica", "Manuale", "Labrada", "Goudy Bookletter 1911", "Londrina Sketch", "Pompiere", "Shippori Antique B1", "Train One", "Arya", "Arima", "Stardos Stencil", "Montserrat Alternates", "Caudex", "Maiden Orange", "Noto Sans Grantha", "Ruda", "Noto Sans Takri", "Kaisei Tokumin", "Schoolbell", "Lacquer", "Moulpali", "Bungee Outline", "Slabo 27px", "Damion", "Noto Sans Myanmar", "Gorditas", "Baloo Tammudu 2", "Noto Sans Gunjala Gondi", "Gemunu Libre", "Monda", "Big Shoulders Inline Display", "Unbounded", "Averia Serif Libre", "Josefin Slab", "Sunflower", "Suez One", "Noto Sans Sora Sompeng", "Gugi", "Eczar", "Libre Barcode 39 Text", "Syncopate", "Chewy", "Courier Prime", "Galindo", "Saira Condensed", "Ranchers", "Rubik Vinyl", "Noto Sans Imperial Aramaic", "Zeyada", "Lily Script One", "Shojumaru", "Fuzzy Bubbles", "Butcherman", "Libre Caslon Display", "Noto Sans Old North Arabian", "Modak", "Imperial Script", "Titillium Web", "Fenix", "Content", "Kumbh Sans", "Questrial", "Bungee", "Vujahday Script", "League Spartan", "Shadows Into Light Two", "Gentium Book Plus", "Geostar", "Mochiy Pop P One", "Barlow Semi Condensed", "Rubik Dirt", "Kavoon", "Caramel", "Noto Sans Linear A", "Gluten", "Mallanna", "Mountains of Christmas", "Happy Monkey", "Titan One", "Prata", "Mali", "Cormorant SC", "Koh Santepheap", "Rouge Script", "Enriqueta", "Adamina", "Licorice", "Zen Antique Soft", "Edu NSW ACT Foundation", "Waterfall", "Sail", "Birthstone Bounce", "Clicker Script", "Kameron", "Cousine", "Chilanka", "Abhaya Libre", "Alumni Sans Collegiate One", "Tenor Sans", "Commissioner", "Romanesco", "Bayon", "IM Fell French Canon", "Cagliostro", "Noto Sans Tifinagh", "Buda", "Red Hat Text", "Advent Pro", "Norican", "Chela One", "Public Sans", "Nova Square", "Rubik Gemstones", "Babylonica", "Mukta Vaani", "Sumana", "IM Fell DW Pica SC", "Hahmlet", "Dr Sugiyama", "Hind Vadodara", "Overpass Mono", "Flow Circular", "El Messiri", "Miltonian Tattoo", "Noto Sans Thaana", "Orienta", "Metal Mania", "Basic", "Noto Sans Symbols 2", "Qwigley", "Junge", "Noto Sans Sinhala", "Sarala", "Grey Qo", "Gidugu", "Noto Sans Psalter Pahlavi", "Poiret One", "Convergence", "Hanalei Fill", "Play", "Rakkas", "Gajraj One", "Eagle Lake", "Newsreader", "Inter Tight", "Caveat Brush", "Petit Formal Script", "Creepster", "Noto Sans Tamil", "Mr Dafoe", "Noto Sans Glagolitic", "Baskervville", "Flavors", "Ibarra Real Nova", "Noto Sans Osage", "Spectral SC", "Voces", "Courgette", "Itim", "Encode Sans SC", "Phudu", "Permanent Marker", "Herr Von Muellerhoff", "Ubuntu Condensed", "Pangolin", "Sofadi One", "Tinos", "Rubik 80s Fade", "Jacques Francois", "Lateef", "Numans", "Underdog", "Noto Sans Tagbanwa", "Encode Sans Expanded", "Reggae One", "Grenze", "Noto Sans Avestan", "Dawning of a New Day", "Noto Sans Thai Looped", "Quattrocento", "Noto Serif Malayalam", "Literata", "Crete Round", "Changa One", "Sniglet", "Suranna", "Swanky and Moo Moo", "Lexend Mega", "Carrois Gothic", "Fruktur", "Rubik Distressed", "Yuji Boku", "Proza Libre", "Puppies Play", "Sora", "Fredoka", "Milonga", "Share Tech", "Atkinson Hyperlegible", "Inria Serif", "Inconsolata", "Luckiest Guy", "Stoke", "Poller One", "Bungee Hairline", "Montaga", "Miriam Libre", "Azeret Mono", "Noto Sans Old Italic", "Monoton", "Cambay", "Germania One", "STIX Two Text", "Miniver", "Baloo Bhaijaan 2", "M PLUS Rounded 1c", "Bilbo Swash Caps", "Coiny", "PT Mono", "Zen Dots", "Anaheim", "Rampart One", "Vollkorn SC", "Gelasio", "Noto Sans Mono", "Scope One", "Kotta One", "Material Symbols Outlined", "Felipa", "Libre Caslon Text", "Khand", "Tai Heritage Pro", "Rubik Maze", "Oregano", "Rosario", "Edu SA Beginner", "IM Fell Double Pica SC", "Cabin Condensed", "Love Ya Like A Sister", "Averia Gruesa Libre", "Chau Philomene One", "Mingzat", "PT Serif Caption", "Ingrid Darling", "Noto Serif Ethiopic", "Balsamiq Sans", "News Cycle", "Freckle Face", "Lekton", "Bellefair", "Snowburst One", "Beth Ellen", "Odibee Sans", "Carrois Gothic SC", "Twinkle Star", "Grand Hotel", "Srisakdi", "Big Shoulders Text", "Calistoga", "Vesper Libre", "Oi", "Ms Madi", "Kadwa", "Playball", "Pirata One", "Andika", "Alex Brush", "Vazirmatn", "Noto Sans Lydian", "Press Start 2P", "Jomhuria", "Noto Sans Khmer", "Pontano Sans", "Share", "Schibsted Grotesk", "Average", "Bonbon", "Noto Serif", "Pinyon Script", "Unna", "Walter Turncoat", "Kantumruy Pro", "Libre Barcode 39", "Almendra SC", "Diplomata SC", "Hind Guntur", "Charmonman", "Kanit", "Sriracha", "Alegreya SC", "Noto Sans Yi", "Noto Sans Deseret", "Roboto Mono", "Nixie One", "Bitter", "Grape Nuts", "Sirin Stencil", "Unkempt", "Mrs Saint Delafield", "Recursive", "Fasthand", "Bentham", "Shippori Mincho B1", "Yrsa", "Nokora", "Sarabun", "Chango", "Fahkwang", "UnifrakturCook", "Radio Canada", "Gothic A1", "Metamorphous", "Rokkitt", "Mada", "Zen Antique", "Marcellus SC", "Fjord One", "Wire One", "Port Lligat Sans", "Tillana", "Splash", "Rubik Moonrocks", "Combo", "Barlow", "Kristi", "Ma Shan Zheng", "Alumni Sans Inline One", "Updock", "Atomic Age", "Risque", "Rubik Spray Paint", "Kablammo", "Averia Sans Libre", "Indie Flower", "Gentium Plus", "Cedarville Cursive", "Magra", "IBM Plex Sans Condensed", "Gabriela", "Alegreya Sans", "Laila", "Rubik Burned", "Syne", "Orelega One", "Darumadrop One", "Archivo Narrow", "Noto Sans Runic", "Keania One", "Barrio", "Monsieur La Doulaise", "Nothing You Could Do", "Taviraj", "Asap", "Faster One", "Rubik Mono One", "Sansita", "Atma", "Inder", "Trocchi", "Crafty Girls", "Sura", "Short Stack", "Khula", "Sawarabi Gothic", "B612", "Nunito Sans", "Lalezar", "Caesar Dressing", "Tiro Bangla", "Sarpanch", "Maitree", "Arizonia", "Dekko", "Bad Script", "Comfortaa", "Noto Sans TC", "Delius", "Amaranth", "Gurajada", "Londrina Solid", "Heebo", "Sen", "Aldrich", "M PLUS Code Latin", "Rubik Microbe", "Ribeye Marrow", "Jost", "Bellota Text", "Gasoek One", "Brygada 1918", "Emblema One", "Nova Round", "Noto Sans Gothic", "La Belle Aurore", "Saira", "Gaegu", "Festive", "Macondo", "Noto Sans Cherokee", "Fira Sans Extra Condensed", "Gilda Display", "Crushed", "Shadows Into Light", "Alumni Sans Pinstripe", "Noto Sans Kaithi", "IBM Plex Sans Hebrew", "BhuTuka Expanded One", "Pragati Narrow", "Ropa Sans", "Noto Serif Tamil", "Kaushan Script", "Baloo Da 2", "Slackside One", "Koulen", "Noto Serif Oriya", "Cuprum", "WindSong", "Parisienne", "Actor", "Sansita Swashed", "Cormorant", "Bilbo", "Noto Sans Syloti Nagri", "Gideon Roman", "Padyakke Expanded One", "Nunito", "Astloch", "Noto Serif JP", "Anton", "Quantico", "Fira Sans Condensed", "Dynalight", "Ribeye", "Marck Script", "Noto Sans Oriya", "Red Hat Display", "Michroma", "Shanti", "Kirang Haerang", "Lobster Two", "IBM Plex Serif", "GFS Didot", "Do Hyeon", "DM Serif Display", "Noto Sans Hanunoo", "Coda", "Cinzel", "Condiment", "Sanchez", "Spicy Rice", "Exo", "Patua One", "Tektur", "League Gothic", "Palanquin Dark", "Noto Serif Toto", "Bona Nova", "Amiri", "Glegoo", "M PLUS 1", "Life Savers", "Englebert", "Bree Serif", "Dancing Script", "Zilla Slab Highlight", "Mako", "Material Icons Outlined", "Gruppo", "Gafata", "Pacifico", "Major Mono Display", "Shippori Antique", "Calligraffitti", "Asset", "Amethysta", "Ovo", "Playfair", "Material Icons Sharp", "Share Tech Mono", "IBM Plex Sans Thai", "Material Icons", "Noto Sans NKo", "IM Fell DW Pica", "Noto Sans Tai Viet", "Style Script", "Arbutus Slab", "Engagement", "Ledger", "Exo 2", "Rubik Marker Hatch", "Vast Shadow", "Bungee Inline", "Barlow Condensed", "Fira Sans", "Inter", "Dosis", "Cookie", "M PLUS 1p", "Great Vibes", "Noto Sans Tamil Supplement", "Aref Ruqaa", "Patrick Hand", "Kolker Brush", "Elsie", "Graduate", "Katibeh", "Cabin", "Lustria", "DotGothic16", "Playfair Display", "Blaka Ink", "Belanosima", "Libre Baskerville", "Sevillana", "Palanquin", "IM Fell English", "BIZ UDMincho", "Megrim", "Lakki Reddy", "Old Standard TT", "Irish Grover", "Jura", "Rancho", "Sigmar", "Emilys Candy", "Seaweed Script", "Neonderthaw", "Tilt Prism", "Meow Script", "MedievalSharp", "Revalia", "Allan", "Montserrat", "Cardo", "Artifika", "ZCOOL QingKe HuangYou", "Overpass", "Noto Sans Meetei Mayek", "Sorts Mill Goudy", "IM Fell Double Pica", "Peralta", "Kulim Park", "Cantora One", "Neucha", "Oxygen", "Poppins", "Fauna One", "Cormorant Garamond", "Allura", "Alef", "Euphoria Script", "Cutive", "Arvo", "Marcellus", "Passions Conflict", "Noto Sans Ethiopic", "Sintony", "Ruslan Display", "Solway", "Noticia Text", "Merriweather", "PT Sans Narrow", "Rhodium Libre", "Aleo", "Acme", "Space Mono", "Bebas Neue", "Cherish", "Mouse Memoirs", "Quintessential", "Quicksand", "Knewave", "Yantramanav", "Homenaje", "Ceviche One", "Yomogi", "Smythe", "Noto Serif Dogra", "Slabo 13px", "Cairo", "Noto Sans Vai", "Material Icons Two Tone", "Over the Rainbow", "Archivo", "Big Shoulders Inline Text", "Monofett", "Viaoda Libre", "Noto Sans Ugaritic", "Lusitana", "Ubuntu", "Noto Sans Rejang", "Rosarivo", "Raleway", "Covered By Your Grace", "Mitr", "Yeon Sung", "Noto Sans Buginese", "Quattrocento Sans", "Zen Kaku Gothic New", "Gloria Hallelujah", "Lancelot", "Cutive Mono", "Noto Sans Nandinagari", "Finger Paint", "PT Sans Caption", "Ephesis", "Devonshire", "Spectral", "Habibi", "Noto Sans Modi", "Tangerine", "Signika", "Princess Sofia", "Hanalei", "Hina Mincho", "Noto Sans Canadian Aboriginal", "Lato", "Foldit", "Copse", "The Girl Next Door", "Rozha One", "Rubik", "Noto Sans Syriac", "Ballet", "Almarai", "Fleur De Leah", "Akronim", "Gowun Dodum", "Asar", "Material Icons Round", "Prociono", "Lexend Giga", "Ubuntu Mono", "Halant", "Noto Sans Lao Looped", "Big Shoulders Display", "Varela Round", "Contrail One", "Outfit", "Fira Code", "Krona One", "Lora", "Encode Sans Semi Condensed", "Zen Kaku Gothic Antique", "Sawarabi Mincho", "Kalam", "Cherry Bomb One", "Blaka", "Miss Fajardose", "BIZ UDGothic", "Pridi", "Martel Sans", "Kosugi", "MonteCarlo", "PT Sans", "Ranga", "Fascinate Inline", "Monomaniac One", "Brawler", "Rochester", "Allerta", "Noto Sans SignWriting", "Noto Sans Sundanese", "Ramabhadra", "Noto Sans Wancho", "Harmattan", "Amita", "Potta One", "Berkshire Swash", "Prosto One", "Piazzolla", "Kreon", "Hammersmith One", "Oswald", "Rationale", "Sue Ellen Francisco", "Baloo Thambi 2", "Darker Grotesque", "Gantari", "Lovers Quarrel", "Shippori Mincho", "Abril Fatface", "Spinnaker", "Karla", "Nova Slim", "Josefin Sans", "Lilita One", "Mogra", "Petrona", "Playfair Display SC", "Comforter Brush", "Arapey", "Amarante", "Vollkorn", "Rambla", "Zhi Mang Xing", "Gwendolyn", "Blinker", "Open Sans", "Noto Sans Inscriptional Parthian", "Fresca", "Nova Cut", "Crimson Text", "Tomorrow", "Niconne", "Noto Sans Hebrew", "Volkhov", "Reenie Beanie", "Tajawal", "BenchNine", "Noto Sans Zanabazar Square", "Port Lligat Slab", "Sigmar One", "Balthazar", "Mea Culpa", "Leckerli One", "Mansalva", "Yuji Hentaigana Akebono", "Raleway Dots", "Uncial Antiqua", "UnifrakturMaguntia", "Jim Nightshade", "DM Sans", "Federo", "MuseoModerno", "Encode Sans Condensed", "Abel", "Caveat", "Pattaya", "Noto Naskh Arabic", "Saira Extra Condensed", "Golos Text", "Fondamento", "Poly", "Lexend Peta", "Oxygen Mono", "Merriweather Sans", "Noto Sans Khudawadi", "Changa", "Fascinate", "Mirza", "Work Sans", "Griffy", "Passion One", "Dongle", "Metrophobic", "Noto Sans Hanifi Rohingya", "PT Serif", "Noto Sans Lisu", "Teko", "Noto Traditional Nushu", "Encode Sans Semi Expanded", "Russo One", "Lexend Deca", "Inika", "Reem Kufi Fun", "Trispace", "Siemreap", "Farro", "Noto Serif Makasar", "Comforter", "Noto Sans Caucasian Albanian", "Orbitron", "Saira Semi Condensed", "Noto Color Emoji", "Maven Pro", "Warnes", "Wendy One", "Roboto Condensed", "Della Respira", "Fredericka the Great", "Supermercado One", "Spirax", "The Nautigal", "Chonburi", "GFS Neohellenic", "Tiro Kannada", "BIZ UDPGothic", "Bokor", "Krub", "Baloo 2", "Rufina", "Carme", "Montserrat Subrayada", "Ravi Prakash", "Cormorant Upright", "Cabin Sketch", "Noto Sans Georgian", "Anek Malayalam", "Noto Serif Bengali", "Noto Sans Cypro Minoan", "Geostar Fill", "Lemonada", "Noto Sans Brahmi", "Qwitcher Grypen", "Bangers", "EB Garamond", "Grandiflora One", "Racing Sans One", "Expletus Sans", "Corinthia", "Mate", "Esteban", "Hachi Maru Pop", "Yeseva One", "Special Elite", "Charis SIL", "Syne Mono", "Roboto Flex", "Roboto", "Pathway Gothic One", "Nova Script", "Tenali Ramakrishna", "Moo Lah Lah", "Roboto Slab", "Petemoss", "Vina Sans", "Six Caps", "Butterfly Kids", "Noto Sans Phoenician", "Cute Font", "IM Fell English SC", "Black Ops One", "Belleza", "Sacramento", "K2D", "Noto Sans Mende Kikakui", "Righteous", "Kumar One", "Oleo Script", "Thasadith", "Rubik Pixels", "Noto Sans Buhid", "Zilla Slab", "Armata", "DM Serif Text", "Marko One", "Baloo Bhaina 2", "Andada Pro", "Noto Kufi Arabic", "Delius Unicase", "Cormorant Infant", "Cinzel Decorative", "Overlock", "Noto Serif Grantha", "Rock Salt", "Frank Ruhl Libre", "Aubrey", "Kurale", "Noto Serif Yezidi", "Niramit", "IBM Plex Sans Thai Looped", "Puritan", "Anybody", "Reem Kufi Ink", "Goblin One", "Radley", "Farsan", "Cherry Cream Soda", "Noto Serif SC", "Ysabeau", "Staatliches", "Paprika", "Simonetta", "Bellota", "Water Brush", "KoHo", "Luxurious Script", "Noto Sans Medefaidrin", "Allerta Stencil", "Shrikhand", "Noto Sans Chakma", "Lugrasimo", "Slackey", "Henny Penny", "Livvic", "Waiting for the Sunrise", "Reem Kufi", "Rowdies", "Libre Barcode EAN13 Text", "Urbanist", "Imprima", "Noto Sans HK", "Yesteryear", "Marmelad", "Sarina", "Fjalla One", "Martel", "Lobster", "Palette Mosaic", "Castoro", "Metal", "Miltonian", "Gupter", "Medula One", "Noto Sans Samaritan", "ABeeZee", "Bruno Ace", "Ysabeau SC", "Mrs Sheppards", "Noto Sans Gurmukhi", "Noto Serif Myanmar", "Alkalami", "Podkova", "Coustard", "Grandstander", "Meera Inimai", "Birthstone", "Noto Sans Old Persian", "Coming Soon", "Nanum Gothic Coding", "Yaldevi", "Cambo", "Architects Daughter", "Crimson Pro", "Bowlby One SC", "Chenla", "Nova Mono", "Sedgwick Ave", "Noto Sans Nag Mundari", "Yusei Magic", "Ultra", "Ruluko", "Noto Sans Tai Le", "Kosugi Maru", "Noto Sans Mro", "Noto Sans Ol Chiki", "Noto Sans Gujarati", "Noto Sans Bassa Vah", "IM Fell Great Primer", "Bevan", "Noto Sans Palmyrene", "IBM Plex Mono", "Noto Sans Vithkuqi", "Chicle", "Mate SC", "Arimo", "Didact Gothic", "Bungee Spice", "Macondo Swash Caps", "Kite One", "Klee One", "Mukta Mahee", "Noto Serif HK", "Prompt", "Noto Sans", "Biryani", "Noto Sans Malayalam", "Italianno", "Arsenal", "Molle", "Edu TAS Beginner", "Almendra Display", "My Soul", "Noto Sans Javanese", "Unica One", "Silkscreen", "Libre Franklin", "Manrope", "Trykker", "Hepta Slab", "Judson", "Bricolage Grotesque", "Carlito", "Oooh Baby", "Marhey", "Noto Serif Ahom", "Kranky", "Nanum Myeongjo", "Noto Sans Mayan Numerals", "Noto Sans Bhaiksuki", "Anonymous Pro", "Ysabeau Infant", "Liu Jian Mao Cao", "Cantarell", "Suravaram", "RocknRoll One", "Inknut Antiqua", "DynaPuff", "Grenze Gotisch", "Diplomata", "Varela", "Battambang", "Noto Sans Tirhuta", "Kings", "Manjari", "Sofia", "Moul", "Mr De Haviland", "Black Han Sans", "Noto Serif Khmer", "Tsukimi Rounded", "Bungee Shade", "Gotu", "Nabla", "League Script", "Noto Serif Hebrew", "Truculenta", "Noto Sans Limbu", "Qahiri", "Noto Sans Lycian", "Ole", "Noto Sans Elymaic", "Overlock SC", "Julee", "Jacques Francois Shadow", "Langar", "Hind", "Flamenco", "Noto Sans Cypriot", "Elsie Swash Caps", "Varta", "Oleo Script Swash Caps", "Capriola", "Galada", "Denk One", "Trade Winds", "Noto Sans SC", "Economica", "Philosopher", "Yuji Syuku", "Mukta Malar", "Noto Sans Tai Tham", "Noto Serif Sinhala", "Noto Sans Cham", "Noto Serif TC", "Averia Libre", "Redressed", "Bodoni Moda", "David Libre", "Nosifer", "Kiwi Maru", "Lexend Exa", "Noto Sans Saurashtra", "Noto Sans Warang Citi", "Anek Tamil", "Francois One", "Original Surfer", "Uchen", "Federant", "Antic Didone", "Ruthie", "Noto Serif KR", "Turret Road", "Nova Flat", "Noto Sans Siddham", "Shizuru", "Alegreya", "Passero One", "Antic Slab", "Noto Sans Hatran", "Offside", "Noto Sans Devanagari", "Voltaire", "Margarine", "Akaya Telivigala", "Noto Sans Newa", "Yanone Kaffeesatz", "Notable", "Rye", "Amatic SC", "New Rocker", "Dangrek", "Noto Sans Masaram Gondi", "Chokokutai", "Lexend Zetta", "Rajdhani", "IBM Plex Sans KR", "Iceberg", "Rubik Bubbles", "Spline Sans", "Noto Sans Pahawh Hmong", "Londrina Outline", "DM Mono", "Alegreya Sans SC", "Cormorant Unicase", "Holtwood One SC", "Noto Sans KR", "Seymour One", "Codystar", "Faustina", "Noto Sans Elbasan", "Khmer", "Gudea", "Aladin", "Doppio One", "Noto Serif Tangut", "Delicious Handrawn", "Kaisei HarunoUmi", "Tilt Neon", "Plaster", "Candal", "Stylish", "Noto Serif Khojki", "Electrolize", "Molengo", "Galdeano", "Tiro Devanagari Marathi", "Tienne", "Konkhmer Sleokchher", "Tilt Warp", "Blaka Hollow", "Athiti", "Noto Nastaliq Urdu", "Oranienbaum", "Lemon", "Noto Sans Coptic", "Lumanosimo", "Buenard", "Belgrano", "Chathura", "Tauri", "Noto Serif Gurmukhi", "Handlee", "Nanum Brush Script", "Hanuman", "Caladea", "IBM Plex Sans Arabic", "New Tegomin", "Mandali", "IM Fell Great Primer SC", "Space Grotesk", "Montez", "Noto Sans Lepcha", "Solitreo", "Stick", "Charm", "Glory", "Viga", "Bahianita", "Noto Sans Ogham", "Alike", "ZCOOL XiaoWei", "Alexandria", "Nanum Gothic", "Song Myung", "Suwannaphum", "M PLUS 2", "Handjet", "Wallpoet", "Beau Rivage", "Hind Madurai", "Noto Serif Khitan Small Script", "IBM Plex Sans", "Hubballi", "Concert One", "Noto Sans Kayah Li", "BioRhyme", "Gravitas One", "Praise", "Sancreek", "Vidaloka", "Dorsa", "BioRhyme Expanded", "Noto Sans Inscriptional Pahlavi", "Noto Sans Sharada", "Karantina", "Stalemate", "Xanh Mono", "Skranji", "Noto Sans Anatolian Hieroglyphs", "Jua", "Noto Sans Thai", "Peddana", "Readex Pro", "Alice", "Noto Serif Gujarati", "Caprasimo", "Anek Kannada", "Long Cang", "Noto Sans JP", "Alfa Slab One", "Saira Stencil One", "Amiko", "Baloo Paaji 2", "Braah One", "Annie Use Your Telescope", "Genos", "Almendra", "Tiro Devanagari Hindi", "Dokdo", "Noto Serif Display", "Plus Jakarta Sans", "Neuton", "Nanum Pen Script", "Alumni Sans", "Taprom", "Gamja Flower", "Wix Madefor Display", "Cherry Swash", "M PLUS 1 Code", "Joti One", "Victor Mono", "Julius Sans One", "Angkor", "Noto Sans Mongolian", "Kumar One Outline", "Rasa", "Delius Swash Caps", "Girassol", "Noto Sans Syriac Eastern", "Squada One", "Ruwudu", "Noto Sans Adlam", "Gowun Batang", "Tapestry", "Noto Serif Tibetan", "Mukta", "Smokum", "Zen Maru Gothic", "Zen Kurenaido", "Pavanam", "Antonio", "Aclonica", "Ramaraja", "Source Serif 4", "Cantata One", "Sree Krushnadevaraya", "Goldman", "Dai Banna SIL", "Shantell Sans", "Joan", "Tiro Devanagari Sanskrit", "Hind Siliguri", "Purple Purse", "Zen Tokyo Zoo", "Anek Telugu", "Markazi Text", "Yellowtail", "Gochi Hand", "Days One", "Chivo", "Edu QLD Beginner", "Noto Sans Carian", "Noto Serif Balinese", "Eater", "Bakbak One", "Noto Sans Marchen", "Archivo Black", "Smooch", "Climate Crisis", "Lavishly Yours", "Kaisei Decol", "Noto Sans Telugu", "Ewert", "Yuji Mai", "Noto Serif Vithkuqi", "Noto Sans Kannada", "Modern Antiqua", "Lisu Bosa", "Assistant", "Barriecito", "Narnoor", "Noto Sans Arabic", "Noto Sans Mandaic", "Yatra One", "Inspiration", "Nuosu SIL", "Bruno Ace SC", "Love Light", "Amiri Quran", "Stint Ultra Expanded", "Comic Neue", "Preahvihear", "Bacasime Antique", "Sonsie One", "Tiro Tamil", "Kenia", "Mynerve", "Wavefont", "Noto Sans Kharoshthi", "Trochut", "Kelly Slab", "Noto Sans Indic Siyaq Numbers", "Unlock", "Londrina Shadow", "Average Sans", "Sahitya", "Gulzar", "Syne Tactile", "Rock 3D", "Sassy Frass", "Diphylleia", "Padauk", "Sono", "Noto Sans Lao", "Single Day", "Benne", "Piedra", "Smooch Sans", "Stalinist One", "Bigelow Rules", "Noto Serif Thai", "Donegal One", "Murecho", "Sofia Sans Semi Condensed", "Sulphur Point", "Noto Serif Telugu", "Aoboshi One", "Noto Sans Nushu", "Red Rose", "Poltawski Nowy", "Stint Ultra Condensed", "Marvel", "Headland One", "Noto Sans Adlam Unjoined", "Noto Sans Phags Pa", "Abyssinica SIL", "Borel", "Rubik Iso", "Imbue", "Noto Sans Chorasmian", "Moon Dance", "Odor Mean Chey", "Black And White Picture", "Noto Sans Nabataean", "Noto Sans Manichaean", "Noto Sans New Tai Lue", "Noto Sans Old Sogdian", "Noto Sans Duployan", "Noto Serif Lao", "Noto Sans Khojki", "Tulpen One", "Noto Sans Soyombo", "Noto Sans Meroitic", "Noto Sans Pau Cin Hau", "Noto Sans Linear B", "Noto Sans Osmanya", "Noto Sans Old Permic", "Noto Sans Sogdian", "Noto Sans Shavian", "Noto Sans Mahajani",]
        fontL.sort(() => Math.random() - 0.5);
        setFontList(fontL)
        // return() =>{ }
    }, []);

    function SelectShade(event) {
        shadeRef.current.classList.add("-translate-x-full")
        setColor(event.target.value)
        setColorName(GetColorName(event.target.value))
    }

    function OpenShade(event) {
        shadeRef.current.classList.remove("-translate-x-full")
    }

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
                                    <div className={"absolute bottom-7 left-2 font-medium " + "text-sm"}>{data}</div>
                                    <div className={"absolute bottom-2 left-2 font-extrabold whitespace-nowrap " + "text-sm"}>{GetColorName(data)}</div>
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

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    function handleChange(newColor, event) {
        console.log(newColor)
        setColor(newColor["hex"])
        setColorName(GetColorName(newColor["hex"]))
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

    function OpenGallery(event) {
        galleryRef.current.classList.remove("hidden")
    }

    function exportLoad(event) {
        setExportLoaded(true)
    }

    function beginExporting(event) {
        setExporting(true)
    }

    function CloseShade(event) {
        shadeRef.current.classList.add("-translate-x-full");
    }

    function setRandomFont(event) {
        const randomFont = fontList[Math.floor(Math.random() * fontList.length)];
        var newFont = randomFont.trim().replaceAll(" ", "+")
        setSelectedFont(toTitleCase(randomFont.trim()));
        setSelectedFontImport("https://fonts.googleapis.com/css?family=" + newFont)
    }

    function getTextColor(colorVal) {
        var textColor = "black"
        if (getContrastRatio("black", colorVal) - 3 < getContrastRatio("white", colorVal)) {
            textColor = "white"
        }
        return textColor
    }

    function getShades() {
        var shades = [
            shader(color, 0.4),
            shader(color, 0.2),
            color,
            shader(color, -0.2),
            shader(color, -0.4),
        ]

        return shades.map(shade =>
            <div className="w-full flex object-cover relative items-center h-16" style={{ backgroundColor: shade }}>
                <div className="m-auto" style={{ color: getTextColor(shade) }}>{GetColorName(shade)}</div>
                <div className="absolute top-0 left-0 w-full h-full object-fit  z-20 rounded-lg opacity-0 block hover:opacity-100">
                    <div className="w-full h-full bg-black absolute z-20 opacity-50">
                    </div>
                    <div className="w-full h-full flex z-30">
                        <button type="button" value={shade} onClick={SelectShade} data-modal-hide="galleryModal" class="px-5 m-auto z-30 py-2.5 text-sm font-medium text-white inline-flex items-center bg-gray-700 hover:bg-white hover:text-black rounded-lg text-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 mr-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                            Select Color
                        </button>
                    </div>
                </div>
            </div>
        );

    }

    return (
        <div className="relative w-screen min-h-screen flex flex-col overflow-x-hidden bg-gray-100">
            <div className="relative w-screen p-4 shadow-md flex">
                <a className="flex" href="/">
                    <img src="./tonio.png" className="w-8 aspect-square my-auto mx-2" />
                    <div className="font-medium text-3xl mb-1">Tone.io</div>
                </a>
            </div>

            <div ref={shadeRef} class="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800" tabindex="-1">
                <div className="fixed top-0 left-0 w-full h-full opacity-30 z-20 bg-black"></div>
                <h5 id="drawer-label" class="relative inline-flex z-50 items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">Shades</h5>
                <button type="button" onClick={CloseShade} class=" z-40 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close menu</span>
                </button>
                <p class="relative mb-6 text-sm text-gray-500 dark:text-gray-400 z-50">Select Shades of the Current Color</p>
                <div class="relative flex flex-col pt-0 p-4 z-50">
                    {getShades()}
                </div>
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
                            <img src={imgSrc} onLoad={exportLoad} className={exportLoaded ? "mx-auto w-1/3 m-3 shadow-lg" : "mx-auto w-1/3 m-3 shadow-lg hidden"} />
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

            <Gallery galleryRef={galleryRef} selectedFont={selectedFont} selectedFontImport={selectedFontImport} fontSize={fontSize} setColor={setColor} setColorName={setColorName} colorMap={colorMap} setColorMap={setColorMap} generateColorMap={generateColorMap} />

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
                <button onClick={OpenGallery} data-modal-target="galleryModal" data-modal-toggle="galleryModal" className="flex p-1.5 rounded-lg bg-black text-white hover:bg-white hover:text-black gap-2 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 m-auto" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <div className="text-sm" >Visit Gallery For Colors</div>
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
                                {exporting ?
                                    <svg aria-hidden="true" class="w-4 aspect-square my-auto mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 aspect-square my-auto" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25" />
                                    </svg>
                                }

                                <div className="pt-1 pb-2">Export</div>
                            </button>
                            <button data-modal-target="staticModal" onClick={OpenModal} data-modal-toggle="staticModal" className="flex gap-x-1 text-black my-auto mt-4 my-2 px-4 hover:underline">
                                <svg className="w-4 aspect-square my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                <div className="font-bold pt-1 pb-1">Customize</div>
                            </button>
                        </div>
                        <div className="flex mx-auto">
                            <button onClick={OpenShade} type="button" data-drawer-target="drawer-example" data-drawer-show="drawer-example" aria-controls="drawer-example" className="flex gap-x-1 text-black my-auto px-4 bg-white hover:bg-black hover:text-white rounded-lg shadow">
                                {/* <svg className="w-4 aspect-square my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg> */}
                                <div className="font-bold pt-1 pb-1">Edit Shades</div>
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
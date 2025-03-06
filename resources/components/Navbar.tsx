import {Link} from "@inertiajs/react";
import React from "react";

export function Navbar() {
    return (
        <div>
            <div className="">
                <div
                    className="max-w-[1400px] mx-auto flex justify-between items-center py-0 md:py-4 px-10 shadow-lg shadow-white text-slate-950/30">
                    <div className="">Plan My Day</div>
                    <div className="inline-flex gap-2 md:gap-6 text-xl">
                        <Link href="/settings"
                              className="pointer rounded-lg py-2 px-2 transition-all hover:bg-slate-500 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-[1em] h-[1em]" width="24" height="24"
                                 viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
                                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                <path d="M12 2v2"/>
                                <path d="M12 22v-2"/>
                                <path d="m17 20.66-1-1.73"/>
                                <path d="M11 10.27 7 3.34"/>
                                <path d="m20.66 17-1.73-1"/>
                                <path d="m3.34 7 1.73 1"/>
                                <path d="M14 12h8"/>
                                <path d="M2 12h2"/>
                                <path d="m20.66 7-1.73 1"/>
                                <path d="m3.34 17 1.73-1"/>
                                <path d="m17 3.34-1 1.73"/>
                                <path d="m11 13.73-4 6.93"/>
                            </svg>
                        </Link>
                        <button
                            className="pointer rounded-lg py-2 px-2 transition-all hover:bg-slate-500 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-[1em] h-[1em]" width="24" height="24"
                                 viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" x2="9" y1="12" y2="12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <hr className="border-t border-t-slate-200 border-b border-b-white max-[1100px]:hidden"/>
        </div>
    );
}

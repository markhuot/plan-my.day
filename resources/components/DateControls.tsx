import React from "react";
import {Link, router} from "@inertiajs/react";

export function DateControls({ date }) {
    const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
    const dayMonthFormatter = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });

    const weekday = weekdayFormatter.format(new Date(date+'T00:00:00'));
    const dayMonth = dayMonthFormatter.format(new Date(date+'T00:00:00'));

    const yesterday = new Date(date+'T00:00:00');
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(date+'T00:00:00');
    tomorrow.setDate(tomorrow.getDate() + 1);

    const handleKeyDown = event => {
        if (event.code === 'ArrowRight') {
            router.get(`?date=${tomorrow.toISOString().replace(/\T.+$/, '')}`);
        }
        if (event.code === 'ArrowLeft') {
            router.get(`?date=${yesterday.toISOString().replace(/\T.+$/, '')}`);
        }
        if (event.code === 'Enter') {
            router.get('/');
        }
    };

    return <div className="flex w-full justify-between items-start gap-4 px-10 pt-12">
        <div>
            <span className="text-slate-300 text-sm">{dayMonth}</span>
            <strong className="text-slate-950 font-bold mr-1 group-hover:underline block text-3xl md:text-5xl -mb-1"
                    style={{fontFamily: '"Big Caslon", "Book Antiqua", "Palatino Linotype", Georgia, serif'}}>{weekday}</strong>
        </div>
        <div className="h-[2rem] flex items-center text-lg" tabIndex="0" onKeyDown={handleKeyDown}>
            <Link className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" tabIndex="-1"
                  href={`?date=${yesterday.toISOString().replace(/\T.+$/, '')}`}>&larr;</Link>
            <Link className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" tabIndex="-1"
                  href="/">&#x274D;</Link>
            <Link className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" tabIndex="-1"
                  href={`?date=${tomorrow.toISOString().replace(/\T.+$/, '')}`}>&rarr;</Link>
        </div>
    </div>
}

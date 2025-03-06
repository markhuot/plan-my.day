import React, {useState} from "react";
import throttle from 'throttleit';
import {php} from "@markhuot/synapse/php";

const updateNotes = throttle((day, contents) => php`
    auth()->user()->notes()->upsert([
        'day' => ${day},
        'contents' => ${contents},
    ], [
        'user_id', 'day',
    ]);
`.execute(), 1000);

export function Notes({ notes, date }) {
    return (
        <>
            <textarea className="w-full h-full py-14 px-10 bg-transparent peer resize-none"
                      placeholder=" "
                      onInput={(event) => updateNotes(date, event.target.value)}
                      defaultValue={notes?.contents || ''}></textarea>
            <p className="hidden peer-placeholder-shown:block pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300"
            >If you fail to plan, you plan to fail.</p>
        </>
    )
}
// 1

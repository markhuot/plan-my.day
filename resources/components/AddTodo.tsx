import React, { useRef, useState } from "react";
import {php} from "@markhuot/synapse/php";
import {usePage} from "@inertiajs/react";
import {ContentEditableInput} from "./ContentEditableInput";

export const addTodo = php`
    use App\Models\Todo;
    use App\Requests\Todo\StoreRequest;

    $request = app(StoreRequest::class);
    Gate::authorize('create', Todo::class);

    $maxSortOrder = auth()->user()->todos()
        ->where('day', '=', $request->date->format('Y-m-d'))
        ->max('sort_order');

    auth()->user()->todos()->create([
        'title' => $request->title,
        'day' => $request->date,
        'sort_order' => $maxSortOrder + 1,
    ]);
`.execute;

export function AddTodo({ date }) {
    const {errors} = usePage().props;
    const titleRef = useRef(null);

    async function handleAction(formData) {
        await addTodo(formData);
    }

    function handleEnter(event) {
        event.target.closest('form').requestSubmit();
        titleRef.current.clear();
        titleRef.current.focus();
    }

    return (
        <form action={handleAction} className="px-10 py-2 w-full">
            <input type="hidden" name="date" value={date}/>
            <div className="grid grid-cols-[20px,1fr] gap-2">
                <span className="inline-block w-[20px] h-[20px] mr-2 rounded border-2 border-blue-600 border-dashed bg-white grid items-center justify-center leading-none font-bold text-blue-600">
                    +
                </span>
                <ContentEditableInput ref={titleRef} name="title" placeholder="New task&hellip;" onEnter={handleEnter}/>
            </div>
            {errors.title && <div>{errors.title}</div>}
            <button className="hidden" type="submit">Add</button>
        </form>
    );
}

export function AddTodoWelcome({ date }) {
    const handleEnter = event => {
        event.target.closest('form').requestSubmit();
    }

    return (
        <form action={addTodo}>
            <input type="hidden" name="date" value={date}/>
            <div className="space-y-2">
                <label className="block text-sm text-slate-500">What&rsquo;s on your plate today?</label>
                <ContentEditableInput name="title" placeholder="Today I&rsquo;m going to &hellip;" onEnter={handleEnter}/>
            </div>
            {/*<div className="mt-16 space-y-4 text-sm text-slate-500">*/}
            {/*    <p className="mt-16">Brain dump time. You know all those things you&rsquo;ve got to get done today? Write &rsquo;em down here.</p>*/}
            {/*    <p className="mt-16">Try not to worry about tomorrow, just yet. Today&rsquo;s the day, let's knock it out of the park.</p>*/}
            {/*</div>*/}
            <button className="hidden">Save</button>
        </form>
    );
}

import React, { useRef, useState } from "react";
import {php} from "@markhuot/synapse/php";
import {usePage} from "@inertiajs/react";

const addTodo = php`
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
    const [title, setTitle] = useState('');
    const contentEditableRef = useRef(null);

    async function handleAction(formData) {
        await addTodo(formData);
        setTitle('');
        contentEditableRef.current.innerHTML = '';
        contentEditableRef.current.focus();
    }

    function handleKeyDown(event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            contentEditableRef.current.closest('form').requestSubmit();
        }
    }

    function handleFormClick(event) {
        contentEditableRef.current.focus();
    }

    return (
        <form action={handleAction} className="px-10 py-2 w-full" onClick={handleFormClick}>
            <input type="hidden" name="date" value={date}/>
            <input type="hidden" name="title" value={title} readOnly/>
            <div className="grid grid-cols-[20px,1fr] gap-2">
                <span className="inline-block w-[20px] h-[20px] mr-2 rounded border-2 border-blue-600 border-dashed bg-white grid items-center justify-center leading-none font-bold text-blue-600">
                    +
                </span>
                <span ref={contentEditableRef} contentEditable className="col-start-2 row-start-1 focus:outline-none" onKeyDown={handleKeyDown} onInput={event => setTitle(event.target.innerHTML)} tabIndex={0}></span>
                {title || title.trim() == '<br>' ? '' : <span className="col-start-2 row-start-1 text-blue-200">New todo&hellip;</span>}
            </div>
            {errors.title && <div>{errors.title}</div>}
            <button className="hidden" type="submit">Add</button>
        </form>
    );
}

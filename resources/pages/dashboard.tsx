import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {Link, router, usePage, usePoll} from '@inertiajs/react';
import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {AddTodo} from "../components/AddTodo";
import {Todo} from "../components/Todo";
import {Notes} from "../components/Notes";
import {Navbar} from "../components/Navbar";
import {Settings} from "../components/Settings";
import {completeTodo, deferTodo, deleteTodo, toggleTimer} from "../components/Actions";
import {DateControls} from "../components/DateControls";
import {php} from "@markhuot/synapse/php";
import { Triage } from '../components/Triage';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export const setup = php`
    use \Carbon\CarbonImmutable;

    $user = auth()->user();
    $date = CarbonImmutable::createFromDate(request()->date('date'))
        ->startOfDay();
    $today = CarbonImmutable::now()
        ->startOfDay();
        
    $user->syncEvents($date);

    return [
        'date' => $date->format('Y-m-d'),
        'todos' => $user->todos()->forDay($date)->orderBy('sort_order')->get(),
        'triage' => $date->isSameDay($today) ? $user->todos()->betweenDays(-4, -1)->late()->get() : [],
        'notes' => auth()->user()->notes()->forDay($date)->first(),
    ];
`

const reorderTodos = (orderedIds) => php`
    use \App\Models\Todo;

    $todos = Todo::query()
        ->whereIn('id', ${orderedIds})
        ->each(fn ($todo) => $todo->update([
            'sort_order' => array_search($todo->id, ${orderedIds})
        ]));
`.execute();

export default function Dashboard({ date, todos, triage, notes }) {
    const {url: pageUrl} = usePage();

    // Poll for new events every five minutes
    usePoll(1000 * 60 * 5);

    // Because data is updated by a background job on page load, we need a single earlier poll
    // so we're not always waiting five minutes for the first update. This is a single update 5s after
    // the page loads.
    useEffect(() => {
        const timeout = setTimeout(() => router.reload(), 1000 * 5);
        return () => clearTimeout(timeout);
    }, []);

    function handleDragEnd(event) {
        const ids = todos.map(todo => todo.id);
        const oldIndex = ids.indexOf(event.active.id);
        const newIndex = ids.indexOf(event.over.id);
        const newOrder = arrayMove(ids, oldIndex, newIndex);
        reorderTodos(newOrder);
    }

    function moveTodo(todoId, direction) {
        const ids = todos.map(todo => todo.id);
        const oldIndex = ids.indexOf(todoId);
        if ((oldIndex === 0 && direction === -1) ||
            (oldIndex === ids.length - 1 && direction === 1))
        {
            return;
        }
        const newOrder = arrayMove(ids, oldIndex, oldIndex + direction);
        reorderTodos(newOrder);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 250,
                distance: 250,
            },
        }),
    );

    const handleShare = async () => {
        const clipboardItemData = {
            'text/html': 'Today,<br/><br/><ul>' + todos.map(todo => `<li>${todo.title}</li>`).join('') + '</ul>',
            'text/plain': "Today,\n\n" + todos.map(todo => `- ${todo.title}`).join("\n"),
        }
        const clipboardItem = new ClipboardItem(clipboardItemData);
        await navigator.clipboard.write([clipboardItem]);
        toast("Copied to clipboard");
    }

    return <>
        <div>
            <Navbar/>
            <div className="pt-[clamp(0px,calc((100vw-1100px)/2),100px)]">
                <div
                    className="mx-auto max-w-[1100px] bg-white border border-b-[3px] border-blue-100 border-b-blue-200 rounded-lg overflow-hidden shadow-[6px_4px_0_var(--tw-shadow-color)] shadow-blue-100 space-y-8 flex items-stretch">
                    <div className="flex flex-col md:flex-row min-h-[33vh] md:min-h-[75vh] w-full">
                        <div className="md:w-1/2 flex flex-col">
                            <h1 className="w-full flex-none">
                                <DateControls date={date}/>
                            </h1>
                            <div className="w-full flex-1 mt-8 space-y-6">
                                <Triage todos={triage}/>
                                <div>
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={todos.map(todo => todo.id)}
                                                         strategy={verticalListSortingStrategy}>
                                            <ul className="">
                                                {todos.map(todo => <Row key={todo.id} todo={todo} moveTodo={moveTodo}/>)}
                                            </ul>
                                        </SortableContext>
                                    </DndContext>
                                    <AddTodo date={date}/>
                                </div>
                            </div>
                            <div className="w-full flex-none py-4 md:py-6 px-10">
                                <button
                                    className="text-slate-400 hover:text-black hover:bg-slate-100 rounded -2 py-1 px-3 rounded -mx-3 inline-flex items-center gap-1"
                                    onClick={handleShare}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block" width="24" height="24"
                                         viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                        <polyline points="16 6 12 2 8 6"/>
                                        <line x1="12" x2="12" y1="2" y2="15"/>
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-slate-50 relative">
                            <Notes date={date} notes={notes}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {pageUrl === '/settings'
            ? <Settings/>
            : null}
        <Toaster />
    </>;
}

function Row({todo, moveTodo}: PropsWithChildren<{ todo: any }>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: todo.id});
    const todoRef = useRef(null);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleKeyDown = event => {
        if (event.code === 'Space') {
            event.preventDefault();
            completeTodo(todo.id);
        }
        if (event.code === 'Backspace') {
            event.preventDefault();
            deleteTodo(todo.id);
        }
        if (event.code === 'ArrowRight') {
            event.preventDefault();
            deferTodo(todo.id);
        }
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            moveTodo(todo.id, -1);
        }
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            moveTodo(todo.id, 1);
        }
        if (event.code === 'F8') {
            event.preventDefault();
            toggleTimer(todo.id);
        }
        if (event.code === 'Enter') {
            event.preventDefault();
            todoRef.current?.focus();
        }
        console.log(event);
        if (event.code === 'KeyK') {
            event.preventDefault();
            event.target.previousElementSibling?.focus();
        }
        if (event.code === 'KeyJ') {
            event.preventDefault();
            event.target.nextElementSibling?.focus();
        }
    }

    return <li ref={setNodeRef} style={style} {...attributes} {...listeners} onKeyDown={handleKeyDown}
               className="py-2 px-10 focus-visible:bg-blue-100 focus-visible:outline-none [&:has([data-todo-title]:focus)]:bg-none [&:has([data-todo-title]:focus)]:ring-4 [&:has([data-todo-title]:focus)]:ring-blue-100 [&:has([data-todo-title]:focus)]:ring-inset">
        {/*<span {...listeners} className="text-slate-200 hover:text-slate-500 relative -left-[1em]" >&#x28ff;</span>*/}
        <Todo ref={todoRef} todo={todo}/>
    </li>
}

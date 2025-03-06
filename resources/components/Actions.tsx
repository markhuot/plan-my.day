import React from "react";
import {Timer} from "./Timer";
import {compose, php} from "@markhuot/synapse/php"
import { Checkbox } from "./Checkbox";

export const setup = php`return "foo";`;

const before = (todoId) => php`
    use \App\Models\Todo;
    $todo = Todo::findOrFail(${todoId});
    Gate::authorize('update', $todo);
`

export const completeTodo = (todoId) => compose(before(todoId), php`
    $todo->completed = !$todo->completed;
    $todo->save();
`).execute();

export const deleteTodo = (todoId) => {
    if (! confirm('Are you sure you want to delete this todo?')) {
        return;
    }

    php`
        use \App\Models\Todo;
        $todo = Todo::findOrFail(${todoId});
        Gate::authorize('delete', $todo);
        $todo->delete();
    `.execute();
}

export const deferTodo = (todoId) => compose(before(todoId), php`
    $todo->day = $todo->day->addDay();
    $todo->save();
`).execute();

export const toggleTimer = (todoId) => compose(before(todoId), php`
    $todo->toggleTimer();
    $todo->save();
`).execute();

const toggleCountIncrement = (todoId) => compose(before(todoId), php`
    $todo->timer_increment *= -1;
    if ($todo->timer_increment === -1 && empty($todo->estimate)) {
        $todo->estimate = 60;
    }
    $todo->save();
`).execute();

const setEstimate = (todoId, estimate) => compose(before(todoId), php`
    $todo->estimate = ${estimate};
    $todo->save();
`).execute();

const setTodoColor = (todoId, color) => compose(before(todoId), php`
    $todo->color = ${color};
    $todo->save();
`).execute();

export function Actions({todo}) {
    return <div className="group inline-block -mt-2 -ml-4 hover:absolute hover:bg-white hover:z-50 hover:w-48 hover:shadow-md rounded-lg hover:overflow-hidden">
        <ul>
            <li className="">
                <label className="pl-4 pt-2 group-hover:pb-2 group-hover:pr-4 cursor-pointer inline-block w-full hover:bg-slate-50">
                    <Checkbox {...todo} completeTodo={completeTodo}/>
                    <span className="hidden group-hover:inline">
                        Complete
                    </span>
                </label>
            </li>
            <li className="hidden group-hover:block">
                <form action={() => deferTodo(todo.id)}>
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-50">
                        <span className="inline-block text-center w-[20px]">&rarr;</span>
                        Defer
                    </button>
                </form>
            </li>
            <li className="hidden group-hover:block"><hr/></li>
            <li className="hidden group-hover:block">
                <form action={() => toggleTimer(todo.id)}>
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex justify-between">
                        <span>
                            {todo.timer_started_at ? (
                                <><span className="text-slate-400 inline-block text-center w-[20px]">&#x23f8;&#xfe0e;</span> Pause</>
                            ) : (
                                <><span className="text-slate-400 inline-block text-center w-[20px]">&#x25B6;</span> Start</>
                            )}
                        </span>
                        <span className="text-slate-400"><Timer {...todo}/></span>
                    </button>
                </form>
            </li>
            <li className="hidden group-hover:block">
                <form action={() => toggleCountIncrement(todo.id)}>
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-50">
                        <span className="text-slate-400 inline-block text-center w-[20px]">
                            {todo.timer_increment === 1 && <>&#x2191;</>}
                            {todo.timer_increment === -1 && <>&#x2193;</>}
                        </span>
                        <span>
                            Count {todo.timer_increment === 1 ? 'up' : 'down'}
                        </span>
                    </button>
                </form>
            </li>
            {todo.timer_increment === -1 ? <li className="hidden group-hover:block">
                <label className="w-full text-left px-4 py-2 hover:bg-slate-50 flex justify-between">
                    <span>
                        <span className="text-slate-400 inline-block text-center w-[20px]">
                            &#x2259;
                        </span>
                        Estimate
                    </span>
                    <span>
                        <input className="w-[3em] text-right bg-transparent"
                            type="text"
                            name="estimate"
                            onChange={(event) => setEstimate(todo.id, event.target.value)}
                            onKeyDown={(event) => event.stopPropagation()}
                            value={todo.estimate}/>m
                    </span>
                </label>
            </li> : null}
            <li className="hidden group-hover:block"><hr/></li>
            <li className="hidden group-hover:block">
                <span className="grid grid-cols-3 gap-3 px-4 py-2">
                    <label className="block w-[1.5rem] h-[1.5rem] border-2 border-dashed border-slate-800 rounded group/color grid items-center justify-center"><span className="w-[8px] h-[8px] rounded-[2px] bg-slate-800 hidden group-has-[:checked]/color:block"></span><input className="hidden" type="radio" name="color" value="" checked={todo.color === null} onChange={event => setTodoColor(todo.id, event.target.value)}/></label>
                    <label className="block w-[1.5rem] h-[1.5rem] bg-[#e7000b] rounded group/color grid items-center justify-center"><span className="w-[8px] h-[8px] rounded-[2px] bg-white hidden group-has-[:checked]/color:block"></span><input className="hidden" type="radio" name="color" value="#e7000b" checked={todo.color === '#e7000b'} onChange={event => setTodoColor(todo.id, event.target.value)}/></label>
                    <label className="block w-[1.5rem] h-[1.5rem] bg-[#5ea500] rounded group/color grid items-center justify-center"><span className="w-[8px] h-[8px] rounded-[2px] bg-white hidden group-has-[:checked]/color:block"></span><input className="hidden" type="radio" name="color" value="#5ea500" checked={todo.color === '#5ea500'} onChange={event => setTodoColor(todo.id, event.target.value)}/></label>
                    <label className="block w-[1.5rem] h-[1.5rem] bg-[#009689] rounded group/color grid items-center justify-center"><span className="w-[8px] h-[8px] rounded-[2px] bg-white hidden group-has-[:checked]/color:block"></span><input className="hidden" type="radio" name="color" value="#009689" checked={todo.color === '#009689'} onChange={event => setTodoColor(todo.id, event.target.value)}/></label>
                    <label className="block w-[1.5rem] h-[1.5rem] bg-[#155dfc] rounded group/color grid items-center justify-center"><span className="w-[8px] h-[8px] rounded-[2px] bg-white hidden group-has-[:checked]/color:block"></span><input className="hidden" type="radio" name="color" value="#155dfc" checked={todo.color === '#155dfc'} onChange={event => setTodoColor(todo.id, event.target.value)}/></label>
                    <label className="block w-[1.5rem] h-[1.5rem] bg-[#7f22fe] rounded group/color grid items-center justify-center"><span className="w-[8px] h-[8px] rounded-[2px] bg-white hidden group-has-[:checked]/color:block"></span><input className="hidden" type="radio" name="color" value="#7f22fe" checked={todo.color === '#7f22fe'} onChange={event => setTodoColor(todo.id, event.target.value)}/></label>
                    <label className="block w-[1.5rem] h-[1.5rem] bg-[#e60076] rounded group/color grid items-center justify-center"><span className="w-[8px] h-[8px] rounded-[2px] bg-white hidden group-has-[:checked]/color:block"></span><input className="hidden" type="radio" name="color" value="#e60076" checked={todo.color === '#e60076'} onChange={event => setTodoColor(todo.id, event.target.value)}/></label>
                    <label className="block w-[1.5rem] h-[1.5rem] bg-[#ffba00] rounded group/color grid items-center justify-center"><span className="w-[8px] h-[8px] rounded-[2px] bg-white hidden group-has-[:checked]/color:block"></span><input className="hidden" type="radio" name="color" value="#ffba00" checked={todo.color === '#ffba00'} onChange={event => setTodoColor(todo.id, event.target.value)}/></label>
                </span>
            </li>
            <li className="hidden group-hover:block"><hr/></li>
            <li className="hidden group-hover:block">
                <form action={() => deleteTodo(todo.id)}>
                    <button className="w-full text-left text-red-500 px-4 py-2 hover:bg-red-50">
                        <span className="inline-block text-center w-[20px]">&#8998;</span>
                        Delete&hellip;
                    </button>
                </form>
            </li>
        </ul>
    </div>;
}

import React, { useImperativeHandle, useRef, useState } from "react";
import {flushSync} from "react-dom";
import {Actions} from "./Actions";
import {php} from "@markhuot/synapse/php";
import { toast } from "sonner"

const updateTodoTitle = (todoId, title) => php`
    use \App\Models\Todo;
    $todo = Todo::findOrFail(${todoId});
    Gate::authorize('update', $todo);

    $todo->title = ${title};
    $todo->save();
`.execute();

export function Todo({ todo, ref })  {
    const titleRef = useRef(null);
    const [isEditable, setIsEditable] = useState(false);

    const focus = () => {
        if (todo.remote_id) {
            toast('Editing blocked', {
                description: 'You must edit linked tasks in the original system.'
            });
            return;
        }
        if (! isEditable) {
            flushSync(() => setIsEditable(true));
            titleRef.current?.focus();
        }
    }

    useImperativeHandle(ref, () => ({
        focus,
    }));

    const handleKeyDown = (event) => {
        if (isEditable) {
            event.stopPropagation();
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            titleRef.current?.closest('li').focus();
            setIsEditable(false);
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            updateTodoTitle(todo.id, titleRef.current?.innerHTML);
            titleRef.current?.closest('li').focus();
            setIsEditable(false);
        }
    }

    const handleDoubleClick = () => {
        focus();
    }

    const handleBlur = (event) => {
        updateTodoTitle(todo.id, titleRef.current?.innerHTML);
        titleRef.current?.closest('li').focus();
        setIsEditable(false);
    }

    return (
        <div className="inline flex">
            <Actions todo={todo}/>
            <span ref={titleRef}
                data-todo-title
                onDoubleClick={handleDoubleClick}
                contentEditable={isEditable}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className={[
                    'focus:outline-none',
                    todo.completed ? 'text-slate-400' : '',
                ].filter(Boolean).join(' ')}
                dangerouslySetInnerHTML={{__html: todo.title}}
            ></span>
        </div>
    );
}

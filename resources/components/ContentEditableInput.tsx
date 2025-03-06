import React, { useRef, useState, useImperativeHandle } from "react";

export function ContentEditableInput({ name, onEnter, placeholder, ref }) {
    const contentEditableRef = useRef(null);
    const [title, setTitle] = useState('');

    useImperativeHandle(ref, () => ({
        clear() {
            setTitle('');
            contentEditableRef.current.innerHTML = '';
        },
        focus() {
            contentEditableRef.current.focus();
        }
    }));

    function handleKeyDown(event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            onEnter && onEnter(event);
        }
    }

    return (
        <div className="relative inline-grid text-lg">
            <input type="hidden" name={name} value={title} readOnly/>
            <span ref={contentEditableRef} contentEditable className="row-start-1 col-start-1 block focus:outline-none" onKeyDown={handleKeyDown} onInput={event => setTitle(event.target.innerHTML)} tabIndex={0}></span>
            {placeholder && (! title || title.trim() === '<br>')
                ? <span className="row-start-1 col-start-1 text-slate-200 pointer-events-none">{placeholder}</span>
                : null }
        </div>
    );
}

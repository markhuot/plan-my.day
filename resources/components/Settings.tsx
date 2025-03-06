import React, {useEffect, useState} from 'react';
import {Link} from "@inertiajs/react";
import {php} from "@markhuot/synapse/php";

const setup = php`
    $user = auth()->user();
    $user->syncCalendars();

    return [
        'tokens' => $user->oauthTokens->pluck('type'),
        'calendars' => $user->googleCalendars,    
    ];
`

const authorize = php`
    $client = app(\Google\Client::class);
    
    return \Inertia\Inertia::location($client->createAuthUrl([], [
        'access_type' => 'offline',
    ]));
`.execute

const toggleCalendar = (calendarId) => php`
    $user = auth()->user();
    $calendar = $user->googleCalendars()->where('remote_id', '=', ${calendarId})->firstOrFail();
    $calendar->enabled = !$calendar->enabled;
    $calendar->save();
`.execute()

export function Settings() {
    const [tokens, setTokens] = useState([]);
    const [calendars, setCalendars] = useState([]);

    useEffect(() => {
        (async () => {
            const props = await setup.execute({raw: true});
            setTokens(props.tokens);
            setCalendars(props.calendars);
        })();
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-900/20 z-50">
            <div className="absolute top-0 left-0 w-full h-full"></div>
            <div className="absolute top-0 right-0 w-3/4 max-w-[600px] h-[100vh] flex p-4">
                <div className="bg-white rounded-lg shadow-xl w-full h-full">
                    <div className="p-8 pb-2 flex justify-between">
                        <h2 className="text-2xl font-bold">Settings</h2>
                        <Link href="/">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-[1em] h-[1em]" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                 stroke-linejoin="round">
                                <path d="M18 6 6 18"/>
                                <path d="m6 6 12 12"/>
                            </svg>
                        </Link>
                    </div>
                    <hr className="border-slate-100"/>
                    <div className="p-8">
                        <p className="font-bold">Calendar</p>
                        <p className="text-sm text-slate-400">You can connect to Google Calendar and have your events automatically pulled in every day as to-dos.</p>
                        {tokens.length > 0 ? <CalendarList calendars={calendars}/> : <AuthorizeGoogleCalendar/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CalendarList({ calendars }) {
    return <ul>
        {calendars.map(calendar => (
            <li>
                <input type="checkbox" defaultChecked={calendar.enabled} onChange={toggleCalendar.bind(this, calendar.remote_id)}/>
                {calendar.name}
            </li>
        ))}
    </ul>;
}

function AuthorizeGoogleCalendar() {
    return <button className="mt-2 rounded bg-blue-200 text-blue-950 px-4 py-2" onClick={authorize}>
        Connect to Google Calendar
    </button>;
}

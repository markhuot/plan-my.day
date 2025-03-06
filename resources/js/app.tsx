import './bootstrap';

import React from 'react';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { setRequestHandler } from '@markhuot/synapse/php';

setRequestHandler(async (options) => {
    console.log('REQUEST', options);

    if (options && options.raw) {
        const response = await axios.post(options.url, options.body, options);
        return response.data;
    }

  return router.post(options.url, options.body, {preserveScroll: true, ...options});
})

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('../pages/**/*.tsx', { eager: true });
        return pages[`../pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
})

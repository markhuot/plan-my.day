<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-status-bar-style" content="black" />
    @viteReactRefresh
    @vite('resources/css/app.css')
    @inertiaHead
  </head>
  <body class="bg-mesh">
    @inertia
    @vite('resources/js/app.tsx')
  </body>
</html>

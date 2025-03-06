<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-status-bar-style" content="black" />
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-57x57-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-60x60-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-72x72-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-76x76-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-114x114-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-120x120-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-144x144-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-152x152-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-180x180-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="196x196" href="/android-chrome-196x196.png" />
    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-square70x70logo" content="/windows-small-tile.png" />
    <meta name="msapplication-square150x150logo" content="/windows-medium-tile.png" />
    <meta name="msapplication-wide310x150logo" content="/windows-wide-tile.png" />
    <meta name="msapplication-square310x310logo" content="/windows-large-tile.png" />
    @viteReactRefresh
    @vite('resources/css/app.css')
    @inertiaHead
  </head>
  <body class="bg-mesh">
    @inertia
    @vite('resources/js/app.tsx')
  </body>
</html>

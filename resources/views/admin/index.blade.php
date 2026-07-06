<!DOCTYPE html>
<html lang="fa">
<head>
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1,shrink-to-fit=no">
    <script>
        window.__APP__=window?.__APP__??{}
        window.__APP__.remoteEntries=@json(latestPluginRemoteEntries())
    </script>
    @viteReactRefresh
    @vite('resources/js/admin/main.tsx')
</head>
<body>
<div id="admin-root"></div>
</body>
</html>

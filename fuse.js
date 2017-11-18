const {FuseBox, HTMLPlugin, Sparky, WebIndexPlugin, CSSResourcePlugin, SassPlugin, CSSPlugin} = require("fuse-box");
const path = require('path');
const express = require('express');

const fuse = FuseBox.init({
    homeDir: 'src',
    output: 'dist/$name.js',
    cache: false,
    plugins: [
        [/node_modules.*\.scss$/, SassPlugin(), CSSResourcePlugin({ dist: 'dist', resolve: (f) => `/${f}`}), CSSPlugin()],
        [/src.*\.scss$/, SassPlugin({ importer: true, macros: { "~": "node_modules/" }}), CSSResourcePlugin({ dist: 'dist', resolve: (f) => `/${f}`}), CSSPlugin()],
        WebIndexPlugin({title: 'Welcome to FuseBox', template: 'src/index.html'})
    ]
});

fuse.dev({
      port: 3000
    }, server => {
      const dist = path.join(__dirname, '/dist');
      const app = server.httpServer.app;
      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
      app.use(express.static(dist));
      app.get('*', (req, res) => {
        res.sendFile(path.join(dist, '/index.html'));
      });
    });

fuse.bundle('vendors').instructions('~ index.ts');

fuse.bundle("app")
    .watch()
    // this bundle will not contain HRM related code (as only the first one gets it)
    // but we would want to HMR it
    .hmr()
    // enable sourcemaps for our package
    .sourceMaps(true)
    // bundle without deps (we have a vendor for that) + without the api
    .instructions("!> [index.ts]");

fuse.run();

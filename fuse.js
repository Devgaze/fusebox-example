const { Ng2TemplatePlugin } = require('ng2-fused');
const { Ng2RouterPlugin } = require('ng2-fused');

const { FuseBox,
        SassPlugin,
        CSSPlugin,
        CSSResourcePlugin,
        PostCSSPlugin,
        WebIndexPlugin,
        JSONPlugin,
        HTMLPlugin,
        RawPlugin,
        Sparky,
        TypeScriptHelpers,
        QuantumPlugin,
        CopyPlugin } = require('fuse-box');

const path = require('path');
const express = require('express');

let fuse, app, vendor;
let isProduction = false;

Sparky.task('config', () => {

  fuse = FuseBox.init({
    homeDir: './src',
    output: './dist/$name.js',
    target: 'browser',
    hash: isProduction,
    cache: !isProduction,
    tsConfig: 'tsconfig.json',
    plugins: [
      ["node_modules.**css",
        CSSResourcePlugin({dist: "dist", resolve: (f) => `/${f}` }),
        CSSPlugin()
      ],
      Ng2TemplatePlugin(),
      ['*.component.html', RawPlugin()],
      ['*.component.scss',
        SassPlugin({
          importer: true,
          macros: { "~": "node_modules/" }}
        ),
        RawPlugin()
      ],
      HTMLPlugin({ useDefault: false }),
      [SassPlugin({importer: true, macros: { "~": "node_modules/" }}), CSSResourcePlugin({ dist: "dist/assets", resolve: (f) => `/${f}` }), CSSPlugin()],
      CSSPlugin(),
      WebIndexPlugin({ title: 'Example title', template: './src/index.html' }),
      TypeScriptHelpers(),
      JSONPlugin(),
      isProduction && QuantumPlugin({
        uglify: true,
        treeshake: true
      }),
    ]
  });

  vendor =  fuse.bundle('vendor')
                .instructions(' ~ main.ts');

  app = fuse.bundle('app')
            .sourceMaps(!isProduction)
            .instructions(' !> [main.ts]');

});

Sparky.task("clean", () => Sparky.src("dist/").clean("dist/"));
Sparky.task("default", ["clean", "config", "watch:images"], () => {
  fuse.dev({ port: 7000 }, server => {
    const dist = path.join(__dirname, '/dist');
    const app = server.httpServer.app;
    app.use(express.static(dist));
    app.get('*', (req, res) => {
      res.sendFile(path.join(dist, '/index.html'));
    });
  });
  app.hmr({ socketURI: 'ws://localhost:7000' }).watch();
  return fuse.run();
});

Sparky.task("watch:images", () => {
  return Sparky.watch("**/*.+(svg|png|jpg|gif)", {base: "./src"}).dest("./dist");
});

Sparky.task("prod-env", ["clean"], () => { isProduction = true })
Sparky.task("dist", ["prod-env", "config", "watch:images"], () => {
  return fuse.run();
});

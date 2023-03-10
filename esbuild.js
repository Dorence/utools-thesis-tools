// @ts-check
const { build, analyzeMetafile } = require("esbuild");
const { copy } = require('esbuild-plugin-copy');
const extPkg = require("esbuild-plugin-external-package");
// @ts-ignore
const { dsvPlugin } = require("esbuild-plugin-dsv");

const isProd = process.env.NODE_ENV == 'production';
console.log(isProd ? "[Prodction]" : "[Development]");

(async () => {
    let result = await build({
        entryPoints: ['preload.js'],
        outdir: 'dist',
        bundle: true,
        charset: 'utf8',
        format:'cjs',
        minify: isProd,
        platform: 'node',
        target: ['chrome91'],
        metafile: true,
        plugins: [
            copy({
                assets: [
                    {
                        from: './plugin.json',
                        to: 'plugin.json'
                    },
                    {
                        from: './assets/logo.png',
                        to: '.'
                    },
                ]
            }),
            dsvPlugin(),
            extPkg
        ],
    });

    console.log(await analyzeMetafile(result.metafile));
})();

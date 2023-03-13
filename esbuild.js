// @ts-check
const { build, analyzeMetafile } = require("esbuild");
const { copy } = require('esbuild-plugin-copy');
const extPkg = require("esbuild-plugin-external-package");
// @ts-ignore
const { dsvPlugin } = require("esbuild-plugin-dsv");

const isProd = process.env.NODE_ENV == 'production';
console.log(isProd ? "[Prodction]" : "[Development]");

function transformCsv(row) {
    if (row.hasOwnProperty("n")) {
        row.n = Number(row.n);
    }
    return row;
}

(async () => {
    let result = await build({
        entryPoints: ['preload.js'],
        outdir: 'dist',
        bundle: true,
        charset: 'utf8',
        format: 'cjs',
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
            dsvPlugin({
                transform(data, extension) {
                    console.log(extension);
                    console.log(data.length);
                    if (extension === "CSV") {
                        return data.map(transformCsv);
                    }
                    return data;
                }
            }),
            extPkg
        ],
    });

    console.log(await analyzeMetafile(result.metafile));
})();

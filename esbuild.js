// @ts-check
const { build, analyzeMetafile } = require("esbuild");
const { copy } = require("esbuild-plugin-copy");
// @ts-ignore
const { dsvPlugin } = require("esbuild-plugin-dsv");
const fs = require("fs");
const path = require("path");

const ModeMap = {
    /** @type {0} */ development: 0,
    /** @type {1} */ dropconsole: 1,
    /** @type {2} */ production: 2,
}

/** @type {ModeMap[keyof ModeMap]} */
const Mode = ModeMap[process.env.NODE_ENV] || 0;

(async () => {
    "use strict";
    console.log(">", Object.keys(ModeMap)[Mode]);

    function transformCsv(row) {
        if (row.hasOwnProperty("n")) {
            row.n = Number(row.n);
        }
        return row;
    }

    /**
     * Set external packages
     * @param {{include?: string[], exclude?: string[]}} options
     * @returns {import("esbuild").Plugin}
     */
    function extPkg(options) {
        const exclude = options?.exclude || []
        async function setup(build) {
            const pkg = JSON.parse(await fs.readFileSync("./package.json", { encoding: "utf-8" }));
            const external = [
                ...options?.include || [],
                ...Object.keys(pkg?.dependencies || {}),
                ...Object.keys(pkg?.devDependencies || {}),
            ].filter(e => !exclude.includes(e));
            console.log("[external]", external);
            if (build.initialOptions.external) {
                build.initialOptions.external.concat(external);
            }
            else {
                build.initialOptions.external = external;
            }
        }
        return { name: "external-package", setup };
    };

    /**
     * Build result analyze processor
     * @param {import("esbuild").Metafile} metafile 
     */
    async function analyze(metafile, verbose = false) {
        if (verbose) {
            console.log(await analyzeMetafile(metafile, { color: true }));
            return;
        }
        for (const file in metafile.outputs) {
            /** @type {(typeof metafile.outputs)['']['inputs']} */
            let newInputs = { "node_modules": { bytesInOutput: 0 } };
            for (const k in metafile.outputs[file].inputs) {
                const v = metafile.outputs[file].inputs[k];
                if (k.startsWith("node_modules")) {
                    newInputs["node_modules"].bytesInOutput += v.bytesInOutput;
                }
                else if (k.startsWith("dsv")) {
                    const newPath = k.replace(__dirname, ".").replace(/\\/g, '/')
                    newInputs[newPath] = v;
                }
                else {
                    newInputs[k] = v;
                }
            }
            metafile.outputs[file].inputs = newInputs;
        }
        console.log(await analyzeMetafile(metafile, { color: true }));
    }

    // run esbuild
    const result = await build({
        entryPoints: ["preload.js"],
        outdir: "dist",
        bundle: true,
        charset: "utf8",
        drop: Mode >= 1 ? ["console"] : [],
        format: "cjs",
        inject: Mode <= 0 ? ["src/debug-shim.js"] : [],
        legalComments: "none",
        metafile: true,
        minify: Mode >= 2,
        platform: "node",
        target: ["chrome91"],
        plugins: [
            {
                name: "replace-mime-db", // redirect `mime-db` to `mimedb.js`
                setup(build) {
                    build.onResolve({ filter: /^mime-db$/ }, args => {
                        return { path: path.join(__dirname, "src/mimedb.js") };
                    });
                },
            },
            copy({
                assets: [
                    { from: 'plugin.json', to: 'plugin.json' },
                    { from: 'assets/logo.png', to: 'logo.png' },
                    { from: 'node_modules/sql.js/dist/sql-wasm.wasm', to: 'sql-wasm.wasm' },
                ]
            }),
            dsvPlugin({
                transform(data, extension) {
                    if (extension === "CSV") {
                        return data.map(transformCsv);
                    }
                    return data;
                }
            }),
            // extPkg(),
        ],
    });

    analyze(result.metafile);
})();

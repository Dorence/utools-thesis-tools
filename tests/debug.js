// @ts-check
// const axios = require('axios/dist/axios.min');
const axios = require('axios').default;

/**
 * @param {string} path 
 * @param {object| string} data 
 */
function send(path, data = "") {
    axios(path, {
        baseURL: 'http://localhost:5000/',
        data,
        method: 'post',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}

/**
 * @param {any} obj 
 * @param {number} depth Recursion depth
 * @returns {string}
 */
function tostr(obj, depth = 0) {
    if (typeof obj === 'number') {
        return obj.toString();
    }
    else if (typeof obj === 'string') {
        if (obj.length < 64) {
            obj = obj.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
            return '"' + obj + '"';
        }
        return '`' + obj + '`';
    }
    else if (obj === undefined) {
        return 'undefined';
    }
    else if (obj === null) {
        return 'null';
    }
    else if (typeof obj === 'bigint') {
        return obj.toString() + 'n'
    }
    else if (Array.isArray(obj)) {
        if (depth < 2) {
            const m = obj.map(e => tostr(e, depth + 1));
            return `[${m.join(', ')}]`;
        }
        return JSON.stringify(obj);
    }
    else if (obj instanceof Date) {
        return obj.toISOString();
    }
    return obj.toString();
}

/** @param {any[]} args */
function parseArgs(args) {
    let str = '';
    let nextJson = false;
    for (const i of args) {
        if (nextJson) {
            str += ' ' + JSON.stringify(i);
            nextJson = false;
        }
        else if ("@J" === i) {
            nextJson = true;
        }
        else {
            str += ' ' + tostr(i);
        }
    }
    return str.substring(1);
}

const debug = {
    /** @param {...any} args */
    log(...args) {
        console.log(...args);
        send('log', parseArgs(args));
    },
    /** @param {...any} args */
    warn(...args) {
        console.log(...args);
        send('warn', parseArgs(args));
    },
    /** @param {...any} args */
    info(...args) {
        console.log(...args);
        send('info', parseArgs(args));
    }
};

module.exports = debug;

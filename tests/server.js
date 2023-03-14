#!/usr/bin/env node
// @ts-check
const http = require('node:http');
const color = require('cli-color');

const ERROR = 0, WARN = 1, LOG = 2, INFO = 3, UNK = 4;

function getRequestType(url) {
    switch (url.toLowerCase()) {
        case "/error": return ERROR;
        case "/warn": return WARN;
        case "/info": return INFO;
        case "/": case "/log": return LOG;
        default: return UNK;
    }
}

const TypePrefix = [
    color.red("[E]"),
    color.yellow("[W]"),
    color.blue("[L]"),
    color.cyan("[I]"),
    "..."
];

// Create an HTTP server
const server = http.createServer((req, res) => {
    const type = getRequestType(req.url);
    let result = '';
    req.on('data', chunk => {
        result += chunk.toString();
    })
    req.on('end', () => {
        console.log(TypePrefix[type], result);
    })
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
});

// Listen port
server.listen(5000, '0.0.0.0', () => {
    console.log("Listen on 0.0.0.0:5000")
});

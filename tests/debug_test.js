#!/usr/bin/env node
// @ts-check
const debug = require('./debug');

debug.log(1, 9n)
debug.log("abc")
debug.log(undefined, null, NaN, Infinity)
debug.warn([], [1], ["1", 99, new Date(), {}])
debug.info("@J", { a: 1, b: [2, "3"] })
debug.info("Short Texts \r\nShow\tEscape Chars")
debug.info("Long Long Long Texts Texts Texts Are Are Are \nSurrounded Surrounded\n  Surrounded By By By Backquotes Backquotes Backquotes")

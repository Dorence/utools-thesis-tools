#!/usr/bin/env -S node --experimental-modules
// @ts-check
const debug = require('./debug');

debug.log(1, 9n);
debug.log("abc");
debug.log(undefined, null, NaN, Infinity);
debug.warn([], [1], ["1"]);

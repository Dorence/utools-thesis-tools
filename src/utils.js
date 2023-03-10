// @ts-check
/**
 * Apply `string.replace` in sequences
 * @param {string} str 
 * @param {[string | RegExp, string][]} rules 
 * @returns {string}
 */
function replaceSeq(str, rules) {
    for (const v of rules) {
        str = str.replace(v[0], v[1]);
    }
    return str;
}

const Utils = { replaceSeq };
export default Utils;

// @ts-check

/**
 * 全半角转换
 * @param {string} str 
 * @returns {string}
 */
function dbc2sbc(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        if ((charCode >= 65296 && charCode <= 65305) || //0~9
            (charCode >= 65313 && charCode <= 65338) || //A~Z
            (charCode >= 65345 && charCode <= 65370)) { //a~z
            result += String.fromCharCode(charCode - 65248);
        } else if (charCode == 12288) { //space
            result += String.fromCharCode(32);
        } else {
            result += str[i];
        }
    }
    return result;
}

export const pdf = {
    enter(action) {
        window.utools.hideMainWindow();
        const text = dbc2sbc(action.payload);
        const alphabets = text.match(/[a-zA-z]/g);
        let isEnglish = (alphabets ? alphabets.length : 0) > (text.length / 2); // is English or not?
        let res = '';
        if (isEnglish) { // English mode
            res = text.replace(/\r?\n/g, ' ').replace(/\- /g, '');
        } else { // Chinese mode
            res = text.replace(/\r?\n/g, '');
        }
        window.utools.copyText(res);
        window.utools.outPlugin();
    }
};
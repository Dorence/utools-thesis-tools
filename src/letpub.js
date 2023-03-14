// @ts-check
import axios from 'axios';
/** @ts-ignore @type {import("../tests/debug")} */
const debug = require("http-debug");

export const LetpubBaseUrl = "https://www.letpub.com.cn/";
let letpubTimeout;

/**
 * @param {Element} root 
 * @param  {...number | string} args 
 * @returns {Element | string} Invalid data will return ''
 */
function toChilren(root, ...args) {
    /** @type {ReturnType<toChilren>} */
    let c = root;
    for (const k of args) {
        if (null === c || undefined === c) {
            return '';
        }
        if (typeof k === 'number' && c instanceof Element) {
            // debug.info('c1', k, c.children[k])
            /** @ts-ignore */
            c = c.children[k];
        }
        else if (typeof k === 'string' && k[0] === '@' && c instanceof Element) {
            if (k === "@") {
                // debug.info('c2', k, c.nodeType, c.textContent)
                /** @ts-ignore */
                c = Array.from(c.childNodes)
                    .filter(e => e.nodeType === Node.TEXT_NODE)
                    .map(e => e.nodeValue)
                    .join(" ");
            }
            else {
                /** @ts-ignore */
                c = c.getAttribute(k.substring(1));
                // debug.info('c3', k, c)
            }
        }
        else {
            // debug.info('cx', k, c[k])
            c = c[k];
        }
    }
    // debug.log('c=', c)
    return c;
}

/** @returns {{title: string, description: string, url: string}[] | null} */
function letpubResultParser(html) {
    if (html.indexOf("暂无匹配结果，请确认您输入的期刊名和其他搜索条件是否正确。") >= 0) {
        return null;
    }
    const body = html.match(/<body[\S ]*>[\s\S]*<\/body>/m)?.[0] || "";
    debug.log("letpub:parser:body", body.length, body.substring(0, 60));
    const doc = new DOMParser().parseFromString(body, "text/html");
    const table = doc.querySelectorAll("#yxyz_content>.table_yjfx>tbody>tr");
    const tr = Array.from(table).slice(2);
    debug.log("tr", tr.length, tr);
    const res = tr.map(e => {
        debug.log("letpub:parser:tr", e.childElementCount, e.innerHTML.substring(0, 60))
        if (e.childElementCount > 1) {
            const fullName = toChilren(e, 1, 3, "@");
            return {
                title: toChilren(e, 1, 0, "@") + (fullName ? (` (${fullName})`) : ""),
                description: "中科院" + toChilren(e, 4, 0, "@") + "  " + toChilren(e, 5, "@") + "  " + toChilren(e, 3, "@"),
                url: LetpubBaseUrl + toChilren(e, 1, 0, "@href"),
            };
        }
        else {
            const td = e.children[0];
            return {
                title: '更多内容',
                description: '打开浏览器查看',
                url: LetpubBaseUrl + toChilren(td, td.childElementCount - 3, "@href"),
            };
        }
    });
    return res;
}

function letpubSearch(searchWord, cb) {
    if (!searchWord) return cb();
    debug.log("letpub:search", searchWord);
    searchWord = searchWord.toLowerCase().trim();
    cb([{ title: searchWord + "..." }]);
    letpubQuery(searchWord, result => {
        if (result) {
            cb(result);
        } else {
            cb([{ title: "Not Found." }]);
        }
    });
}

export function letpubQueryUrl(searchWord) {
    return LetpubBaseUrl + "index.php?page=journalapp&view=search&searchname=" + encodeURIComponent(searchWord).replace(/%20/g, '+');
}

/**
 * @param {string} searchWord Search word
 * @param {function(Array | null): any} cb Callback function, return `null` for not found
 * @returns {void}
 */
export function letpubQuery(searchWord, cb) {
    axios({
        url: letpubQueryUrl(searchWord),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(response => {
        const data = response.data;
        cb(letpubResultParser(data))
    });
}

export const letpub = {
    search(action, searchWord, cb) {
        if (letpubTimeout) {
            clearTimeout(letpubTimeout);
        }
        // 等待0.5秒无后续输入后，再进行查询。
        letpubTimeout = setTimeout(letpubSearch, 500, searchWord, cb);
    },
    select(action, item, cb) {
        window.utools.hideMainWindow()
        if (item.title != "更多内容") {
            window.utools.copyText(item.title);
        }
        window.utools.shellOpenExternal(item.url);
        window.utools.outPlugin();
    }
}

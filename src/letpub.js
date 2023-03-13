// @ts-check
import axios from 'axios';
import { load } from 'cheerio';

export const LetpubBaseUrl = "https://www.letpub.com.cn/";
let letpubTimeout;

/** @returns {{title: string, description: string, url: string}[] | null} */
function letpubResultParser(html) {
    if (html.indexOf("暂无匹配结果，请确认您输入的期刊名和其他搜索条件是否正确。") >= 0) {
        return null;
    }
    let $ = load(html);
    let trs = $("#yxyz_content > table.table_yjfx > tbody > tr:gt(1)");
    let res = trs.map((i, e) => {
        if (i != trs.length - 1) {
            // console.log(e.children[1].children[0].attribs.href);
            /** @ts-ignore */
            const index = e.children[3].children[0].data + ' ' + e.children[3].children[3].data;
            /** @ts-ignore */
            const zone = e.children[4].children[0].data;
            /** @ts-ignore */
            const classy = e.children[5].children[0].data + ' ' + e.children[5].children[3].data
            return {
                /** @ts-ignore */
                title: e.children[1].children[0].children[0].data,
                description: "中科院" + zone + "  " + classy + "  " + index,
                /** @ts-ignore */
                url: LetpubBaseUrl + e.children[1].children[0].attribs.href,
            };
        } else {
            let as = $("#yxyz_content > table.table_yjfx > tbody > tr:last-child > td > form");
            return {
                title: '更多内容',
                description: '打开浏览器查看',
                url: LetpubBaseUrl + as.prev().prev().attr()?.href
            }
        }
    });
    return res.get();
}

/**
 * @param {string} searchWord Search word
 * @param {function(Array | null): any} cb Callback function, return `null` for not found
 * @returns {void}
 */
export function letpubQuery(searchWord, cb) {
    axios({
        url: LetpubBaseUrl + "index.php?page=journalapp&view=search&searchname=" + encodeURIComponent(searchWord).replace(/%20/g, '+'),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(response => {
        const data = response.data;
        cb(letpubResultParser(data))
    });
}

function letpubSearch(searchWord, cb) {
    if (!searchWord) return cb();
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

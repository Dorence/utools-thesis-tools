// @ts-check
/// <reference path="extra.d.ts" />
import csvDataEn from "../assets/ccf-2022-en.csv"
import csvDataCn from "../assets/ccf-2022-cn.csv"
// console.info("> ccf.js");

const TopicMap = {
    CA: "计算机体系结构/并行与分布计算/存储系统",
    CN: "计算机网络",
    IS: "网络与信息安全",
    SE: "软件工程/系统软件/程序设计语言",
    DB: "数据库/数据挖掘/内容检索",
    CS: "计算机科学理论",
    GM: "计算机图形学与多媒体",
    AI: "人工智能",
    HC: "人机交互与普适计算",
    SN: "交叉/综合/新兴"
};

const TypeMap = {
    Conf: "会议",
    Jrn: "期刊",
};

const LangMap = {
    C: "中文",
    E: "英文",
    CE: "中英文",
};

/**
 * @param {CsvDataEnRow} row
 * @returns {CcfItem}
 */
function ccfEnParser(row) {
    const publisher = row.pub.length <= 12 ? row.pub : (row.pub.substring(0, 12) + '...');
    const url = row.url.replace("$dblp", "https://dblp.org/db");
    return {
        title: row.a ? `${row.a} (${row.name})` : row.name,
        description: `${TopicMap[row.tp]}  CCF-${row.tier}  ${TypeMap[row.type]}  ${publisher}`,
        url: url,
        searchKey: row.a + row.name + row.pub,
    };
}

/**
 * @param {CsvDataCnRow} row
 * @returns {CcfItem}
 */
function ccfCnParser(row) {
    const publisher = row.pub.length <= 20 ? row.pub : (row.pub.substring(0, 20) + '...');
    return {
        title: row.name,
        description: `CCF-${row.tier}  ${LangMap[row.lang]}  ${row.c}  ${publisher}`,
        url: "https://qikan.cqvip.com/Qikan/Search/Index?objectType=7&key=CN=" + encodeURIComponent(row.c),
        searchKey: row.name + row.pub,
    };
}

export const ccfData = {
    // @ts-ignore
    cn: csvDataCn.map(ccfCnParser),
    // @ts-ignore
    en: csvDataEn.map(ccfEnParser),
};

/** @type {Preload.ListArgs} */
export const ccfEn = {
    enter(action, cb) {
        console.log("ccfEn:enter", ccfData.en.length);
        cb(ccfData.en);
    },
    search(action, searchWord, cb) {
        console.log("ccfEn:search", searchWord);
        const regexp = new RegExp(searchWord.trim().replace(/\s+/ig, '\\s'), 'i');
        const result = ccfData.en.filter(row => row.searchKey.match(regexp));
        cb(result);
    },
    select(action, item, cb) {
        window.utools.hideMainWindow();
        window.utools.shellOpenExternal(item.url);
        window.utools.outPlugin();
    },
};

/** @type {Preload.ListArgs} */
export const ccfCn = {
    enter(action, cb) {
        console.log("ccfCn:enter", ccfData.cn.length);
        cb(ccfData.cn);
    },
    search(action, searchWord, cb) {
        console.log("ccfCn:search", searchWord);
        const regexp = new RegExp(searchWord.trim().replace(/\s+/ig, '\\s'), 'i');
        const result = ccfData.cn.filter(row => row.searchKey.match(regexp));
        cb(result);
    },
    select(action, item, cb) {
        window.utools.hideMainWindow();
        window.utools.shellOpenExternal(item.url);
        window.utools.outPlugin();
    },
};
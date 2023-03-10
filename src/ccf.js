// @ts-check
/// <reference path="ccf.extra.d.ts" />
import csvData from '../assets/ccf-2022.csv'
import csvDataCn from '../assets/ccf-2022-cn.csv'

const topicMap = {
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

const typeMap = {
    Conf: "会议",
    Jrn: "期刊",
};

const langMap = {
    C: "中文",
    E: "英文",
    CE: "中英文",
};

/** @param {CsvDataRow} row */
export function ccfParser(row) {
    const publisher = row.pub.length <= 10 ? row.pub : (row.pub.substring(0, 10) + '...');
    const url = row.url.replace('$dblp', 'https://dblp.org/db');
    return {
        title: row.a ? `${row.a} (${row.name})` : row.name,
        description: `${topicMap[row.tp]}  CCF-${row.tier}  ${typeMap[row.type]}  ${publisher}`,
        url: url,
    };
}

export const ccf = {
    enter(action, cb) {
        cb(csvData.map(ccfParser));
    },
    search(action, searchWord, cb) {
        const regexp = new RegExp(searchWord.trim().replace(/\s+/ig, '\\s'), 'i');
        const result = csvData.filter(row => (row.a + row.name).match(regexp));
        cb(result.map(ccfParser));
    },
    select(action, item, cb) {
        window.utools.hideMainWindow();
        window.utools.shellOpenExternal(item.url);
        window.utools.outPlugin();
    },
};

/** @param {CsvDataCnRow} row */
export function ccfCnParser(row) {
    const publisher = row.pub.length <= 20 ? row.pub : (row.pub.substring(0, 20) + '...');
    return {
        title: row.name,
        description: `CCF-${row.tier}  ${langMap[row.lang]}  ${row.c}  ${publisher}`,
        url: 'https://qikan.cqvip.com/Qikan/Search/Index?objectType=7&key=' + encodeURIComponent("CN=" + row.c),
    };
}

export const ccfCn = {
    enter(action, cb) {
        cb(csvDataCn.map(ccfCnParser));
    },
    search(action, searchWord, cb) {
        const regexp = new RegExp(searchWord.trim().replace(/\s+/ig, '\\s'), 'i');
        const result = csvDataCn.filter(row => row.name.match(regexp));
        cb(result.map(ccfCnParser));
    },
    select(action, item, cb) {
        window.utools.hideMainWindow();
        window.utools.shellOpenExternal(item.url);
        window.utools.outPlugin();
    },
};

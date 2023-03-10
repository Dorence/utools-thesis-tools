// @ts-check
import { ccf, ccfCn } from './src/ccf';
import { pdf } from './src/pdf';
import { zotero } from './src/zotero.js';
import * as Cite from './src/cite';

let letpubTimeout;
const letpub = {
    search(action, searchWord, callbackSetList) {
        if (letpubTimeout) {
            clearTimeout(letpubTimeout);
        }
        // 等待0.5秒无后续输入后，再进行查询。
        letpubTimeout = setTimeout(Cite.letpubSearch, 500, searchWord, callbackSetList);
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

// window export.
window.exports = {
    "ccf": { mode: 'list', args: ccf },
    "ccf_cn": { mode: 'list', args: ccfCn },
    "letpub": { mode: 'list', args: letpub },
    'pdf_replace': { mode: 'none', args: pdf },
    "zotero_search": { mode: 'list', args: zotero },
    "unknown_cite": { mode: 'list', args: Cite.citeUnknown },
    "apa_cite": { mode: 'list', args: new Cite.CiteStyled("APA") },
    "gbt_cite": { mode: 'list', args: new Cite.CiteStyled("GB/T7714") },
    "mla_cite": { mode: 'list', args: new Cite.CiteStyled("MLA") },
}

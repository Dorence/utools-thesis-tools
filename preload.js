// @ts-check
import { ccfEn, ccfCn } from "./src/ccf";
import { pdf } from "./src/pdf";
import { zotero } from "./src/zotero";
import * as Cite from "./src/cite";
import { letpub } from "./src/letpub";

window.exports = {
    "ccf": { mode: "list", args: ccfEn },
    "ccf_cn": { mode: "list", args: ccfCn },
    "letpub": { mode: "list", args: letpub },
    "pdf_replace": { mode: "none", args: pdf },
    "pdf_replace_linux": { mode: "none", args: pdf },
    "zotero_search": { mode: "list", args: zotero },
    "unknown_cite": { mode: "list", args: Cite.citeUnknown },
    "apa_cite": { mode: "list", args: new Cite.CiteStyled("APA") },
    "gbt_cite": { mode: "list", args: new Cite.CiteStyled("GB/T7714") },
    "mla_cite": { mode: "list", args: new Cite.CiteStyled("MLA") },
};
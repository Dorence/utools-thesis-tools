// @ts-check
/// <reference path="node_modules/utools-api-types/index.d.ts" />

declare interface CsvDataRow {
    /** #no */
    n: string,
    /** abbreviation */
    a: string,
    /** name */
    name: string,
    /** publisher */
    pub: string,
    /**  URL */
    url: string,
    /** CCF-A/B/C */
    tier: "A" | "B" | "C",
    /** journal / conference */
    type: "Jrn" | "Conf",
    /** topics */
    tp: string,
}

declare module "*/ccf-2022.csv" {
    const content: CsvDataRow[];
    export default content;
}

interface CsvDataCnRow {
    /** #no */
    n: string,
    /** name */
    name: string,
    /** CN code */
    c: string,
    /** publisher */
    pub: string,
    /** language CN/EN/CN+EN */
    lang: "C" | "E" | "CE",
    /** CCF-T1/T2/T3 */
    tier: "T1" | "T2" | "T3"
}

declare module "*/ccf-2022-cn.csv" {
    const content: CsvDataCnRow[];
    export default content;
}

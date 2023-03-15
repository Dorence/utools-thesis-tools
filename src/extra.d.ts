// @ts-check

declare interface CsvDataEnRow {
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

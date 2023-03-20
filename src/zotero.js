// @ts-check
/// <reference path="extra.d.ts" />
const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");
// console.info("> zotero.js");

/** @type {import("sql.js").Statement} */
let stmt;

/**
 * search title in zotero
 * @param {string} searchWord 
 * @param {Function} cb 
 */
function query(searchWord, cb) {
    stmt.bind({ $word: `%${searchWord || ""}%` });
    let res = [];
    while (stmt.step()) {
        const row = stmt.getAsObject();
        const url = `zotero://select/items/${row.libraryID}_${row.key}`;
        res.push({ title: row.value, description: url, url: url });
    }
    cb(res);
}

/** @see https://www.zotero.org/support/kb/profile_directory */
function getProfileDir() {
    if (window.utools.isWindows()) {
        return path.join(window.utools.getPath("appData"), "Zotero", "Zotero", "Profiles");
    }
    else if (window.utools.isLinux()) {
        return path.join(window.utools.getPath("home"), ".zotero", "zotero");
    }
    else if (window.utools.isMacOS()) {
        return path.join(window.utools.getPath("appData"), "Zotero", "Profiles");
    }
    return null;
}

/** @type {Preload.ListArgs} */
export const zotero = {
    enter(action, cb) {
        console.log("zotero:enter");

        const profileDir = getProfileDir();
        if (profileDir === null) {
            cb([{ title: "未找到 Zotero profile 的位置" }]);
            return;
        }

        // assume only 1 profile exists
        const dirs = fs.readdirSync(profileDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory() && dirent.name.endsWith("default"))
            .map(dirent => dirent.name);
        console.log("zotero:dir", profileDir, dirs);
        if (dirs.length < 1) {
            cb([{ title: "未找到 personal profile 的位置" }]);
            return;
        }

        const prefPath = path.join(profileDir, dirs[0], "prefs.js");
        if (!fs.existsSync(prefPath)) {
            cb([{ title: "未找到 prefs.js 的位置" }]);
            return;
        }
        const prefs = fs.readFileSync(prefPath, "utf8");
        const match = /user_pref\("extensions.zotero.dataDir",\s?"(.*)"\);/.exec(prefs);
        if (!match) {
            cb([{ title: "未找到 extensions.zotero.dataDir" }]);
            return;
        }

        const dbPath = path.join(match[1], "zotero.sqlite");
        if (!fs.existsSync(dbPath)) {
            cb([{ title: "未找到 zotero.sqlite 的位置" }]);
            return;
        }

        const buf = fs.readFileSync(dbPath);
        console.info("zotero:sqlite", dbPath, buf.length);
        initSqlJs().then(SQL => {
            // load database from buffer
            const db = new SQL.Database(buf);
            stmt = db.prepare(
                "SELECT itemDataValues.value, items.key, items.libraryID FROM items " +
                "INNER JOIN itemData ON items.itemID = itemData.itemID AND itemData.fieldID=1 " +
                "INNER JOIN itemDataValues ON itemData.valueID=itemDataValues.valueID " +
                "WHERE itemDataValues.value like $word"
            );
            query("", cb);
        }).catch(err => {
            console.warn("initSqlJs", err);
        });
    },
    search(action, searchWord, cb) {
        console.log("zotero:search", searchWord);
        query(searchWord, cb);
    },
    select(action, item, cb) {
        window.utools.hideMainWindow();
        if (item.url) {
            window.utools.shellOpenExternal(item.url);
        }
        window.utools.outPlugin();
    },
};
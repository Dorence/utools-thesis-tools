// @ts-check
const fs = require('fs');
const path = require('path');
const initSqlJs = require("sql.js");
/** @ts-ignore @type {import("../tests/debug")} */
const debug = require("http-debug");
// debug.info("> zotero.js");

/** @type {import("sql.js").Statement} */
let stmt;

/**
 * search title in zotero
 * @param {string} searchWord 
 * @param {Function} cb 
 */
function query(searchWord, cb) {
    stmt.bind({ $word: `%${searchWord || ''}%` });
    let res = [];
    while (stmt.step()) {
        const row = stmt.getAsObject();
        const url = "zotero://select/items/" + row.libraryID + "_" + row.key;
        res.push({ title: row.value, description: url, url: url })
    }
    cb(res);
}

export const zotero = {
    enter(action, cb) {
        debug.log("zotero:enter");
        const profileDir = path.join(utools.getPath('appData'), 'Zotero', 'Zotero', 'Profiles');
        // assume only 1 profile exists
        const dirs = fs.readdirSync(profileDir, { withFileTypes: true })
            .filter(file => file.isDirectory() && file.name.endsWith('default'))
            .map(dirent => dirent.name);
        debug.log("dirs", dirs);
        if (dirs.length < 1) {
            cb([{ title: 'Zotero profile dir not found' }]);
            return;
        }

        const prefPath = path.join(profileDir, dirs[0], 'prefs.js');
        const prefs = fs.readFileSync(prefPath, 'utf8');
        const match = /user_pref\("extensions.zotero.dataDir",\s?"(.*)"\);/.exec(prefs);
        if (!match) {
            cb([{ title: 'extensions.zotero.dataDir not found' }]);
            return;
        }

        let dbPath = path.join(match[1], 'zotero.sqlite');
        debug.log("dbPath", dbPath);
        if (!fs.existsSync(dbPath)) {
            cb([{
                title: 'zotero.sqlite not found',
                description: '未找到 zotero.sqlite 的位置, 请联系插件作者'
            }]);
            return;
        }

        const buf = fs.readFileSync(dbPath);
        debug.info('file', dbPath, buf.length, buf.subarray(0, 20).toString())
        initSqlJs().then(SQL => {
            // load database from buffer
            const db = new SQL.Database(buf);
            stmt = db.prepare(
                "SELECT itemDataValues.value, items.key, items.libraryID FROM items " +
                "INNER JOIN itemData ON items.itemID = itemData.itemID AND itemData.fieldID=1 " +
                "INNER JOIN itemDataValues ON itemData.valueID=itemDataValues.valueID " +
                "WHERE itemDataValues.value like $word"
            );
            query('', cb);
        }).catch(debug.warn)
    },
    search(action, searchWord, cb) {
        debug.log("zotero:search", searchWord);
        query(searchWord, cb);
    },
    select(action, item, cb) {
        window.utools.hideMainWindow();
        if (item.url) {
            window.utools.shellOpenExternal(item.url);
        }
        window.utools.outPlugin();
    }
}

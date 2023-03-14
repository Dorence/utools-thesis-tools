// @ts-check
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');
let db;

export const zotero = {
    enter(action, cb) {
        // default zotero db location: "%HOMEPATH%\\Zotero\\zotero.sqlite"
        // let origin_db_path = path.join(os.homedir(), 'Zotero', 'zotero.sqlite');
        let profile_dir = path.join(utools.getPath('appData'), 'Zotero', 'Zotero', 'Profiles');
        // 因为没有解析profile.ini，所以这里只能假设我们只有一个profile
        let dirs = fs.readdirSync(profile_dir, { withFileTypes: true }).filter(file => file.isDirectory() && file.name.endsWith('default')).map(dirent => dirent.name);
        // assert len(dirs) == 1
        console.log(dirs[0]);
        let pref_path = path.join(profile_dir, dirs[0], 'prefs.js');
        let prefs = fs.readFileSync(pref_path, 'utf8');
        let pref_regex = /user_pref\("extensions.zotero.dataDir",\s?"(.*)"\);/;
        let match = pref_regex.exec(prefs);
        if (!match) {
            cb([{ title: 'extensions.zotero.dataDir not found' }]);
            return;
        }
        console.log(match[1]);
        let origin_db_path = path.join(match[1], 'zotero.sqlite');
        console.log(origin_db_path);

        if (!fs.existsSync(origin_db_path)) {
            // 扔报错。
            console.log('zotero.sqlite not found');
            cb([{
                title: 'zotero.sqlite not found',
                description: '未在你的设置中找到zotero.sqlite的位置，这可能是个bug，请联系插件作者。'
            }]);
            return;
        }

        let db_path = origin_db_path + "_backup";
        fs.copyFile(origin_db_path, db_path, (err) => {
            console.log(db_path);
            if (err) throw err;
            db = new sqlite3.Database(db_path, sqlite3.OPEN_READONLY, function (err) {
                if (err) throw err;
                console.log('Connected to the SQLite database');
            });
            db.all("SELECT itemDataValues.value, items.key as itemKey, items.libraryID FROM items" +
                " INNER JOIN itemData ON items.itemID = itemData.itemID AND itemData.fieldID=1" +
                " INNER JOIN itemDataValues ON itemData.valueID=itemDataValues.valueID",
                function (err, rows) {
                    if (err) throw err;
                    let res = rows.map(row => {
                        // construct url
                        let url = "zotero://select/items/" + row.libraryID + "_" + row.itemKey;
                        return {
                            title: row.value,
                            description: url,
                            url: url
                        }
                    });
                    cb(res);
                });
        });
    },
    search(action, searchWord, cb) {
        // search title in zotero
        db.all("SELECT itemDataValues.value, items.key as itemKey, items.libraryID FROM items" +
            " INNER JOIN itemData ON items.itemID = itemData.itemID AND itemData.fieldID=1" +
            " INNER JOIN itemDataValues ON itemData.valueID=itemDataValues.valueID" +
            " WHERE itemDataValues.value like '%" + searchWord + "%'",
            function (err, rows) {
                if (err) throw err;
                let res = rows.map(row => {
                    // construct url
                    let url = "zotero://select/items/" + row.libraryID + "_" + row.itemKey;
                    return {
                        title: row.value,
                        description: url,
                        url: url
                    }
                });
                cb(res);
            });
    },
    select(action, item, cb) {
        window.utools.hideMainWindow()
        window.utools.shellOpenExternal(item.url);
        window.utools.outPlugin();
    }
}

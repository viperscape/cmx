"use strict";
const sql = require('sqlite3');
const db_init = require('./db-init');
class Store {
    constructor(path) {
        let db = new sql.Database(path);
        db_init.start(db);
        this.db = db;
    }
    update(mac, heartbeat) {
        let db = this.db;
        var q = 'insert into clients (mac,heartbeat) values ("' + mac + '","' + heartbeat + '")';
        db.run(q, function (e) { });
        var q = 'update clients set heartbeat="' + heartbeat + '" where mac="' + mac + '"';
        db.run(q, function (e) { if (e)
            console.log('err', e); });
    }
    gaps(allowance, ev) {
        let q = 'SELECT * FROM gaps WHERE "from" < datetime("to",\'-' + allowance + ' minutes\')';
        this.db.all(q, function (e, r) {
            if (!e)
                ev.emit('gaps', r);
        });
    }
}
exports.Store = Store;
;

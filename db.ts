"use strict"

import async = require('async');
import sql = require('sqlite3');
import db_init = require('./db-init');

export class Store {
    db: any

    constructor(path:string) {
        let db = new sql.Database(path);
        db_init.start(db);

        this.db = db;
    }

    update (mac,heartbeat) {
        let db = this.db; // NOTE: we lose 'this' context

        // FIXME: sqlitejs is picky about this, so we must both insert and update independently
        // this ensures both is run

        // NOTE: we cannot 'insert or replace' here
        // since the row changes completely and the db-trigger will not fire then
        var q = 'insert into clients (mac,heartbeat) values ("' + mac + '","' + heartbeat + '")';
        db.run(q, function(e) {}); // NOTE: this is a bug, db.run inside here does nothing-- regardless

        var q = 'update clients set heartbeat="' + heartbeat + '" where mac="' + mac + '"';
        db.run(q, function(e) { if (e) console.log('err',e) });
    }

    gaps (allowance, ev) {
        let q = 'SELECT * FROM gaps WHERE "from" < datetime("to",\'-' + allowance + ' minutes\')';
        this.db.all(q, function(e,r) {
            if (!e) ev.emit('gaps',r)
        })
    }
};
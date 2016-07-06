"use strict"

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
        let q = 'insert into clients (mac,heartbeat) values ("' + mac + '","' + heartbeat + '")';
        
        // NOTE: for some reason nesting db.run inside the err-callback does not always work..
        // instead let's use a flag
        let update = false
        db.run(q, function(e) {
            if (e) update = true;
        });

        if (update) {
            q = 'update clients set heartbeat="' + heartbeat + '" where mac="' + mac + '"';
            db.run(q, function(e) { if (e) console.log('err',e) });
        }
    }


};
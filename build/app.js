"use strict";
const server = require('./server');
const db = require('./db');
const store = new db.Store('store.db');
const moment = require('moment');
const app = server.start(9999, store, function (n) {
    let time = moment(n.seenTime).add(4, "hour").format('YYYY-MM-DD HH:mm:ss');
    store.update(n.clientMac, time);
});

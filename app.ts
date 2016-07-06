"use strict"

import server = require('./server');
import db = require('./db');
const store = new db.Store('store.db');

import moment = require('moment');

const app = server.start(9999, function(n) {
    // add 4 hours to offset, momentjs likes to subtract 4 on format...
    let time = moment(n.seenTime).add(4,"hour").format('YYYY-MM-DD HH:mm:ss');

    store.update(n.clientMac,time);
});




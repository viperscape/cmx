"use strict"

import chai = require('chai');

import db = require('../db');
const store = new db.Store('store-test.db');

import dbinit = require('../db-init');
dbinit.gaps_table_rebuild(store.db);

import moment = require('moment');

store.db.serialize(function () {

    // NOTE: add 4 hours to offset, momentjs likes to subtract 4 on format...
    let time = moment(new Date()).subtract(25,"minute").format('YYYY-MM-DD HH:mm:ss');
    store.update("00:00:00:00:00:00",time);

    let new_time = moment(new Date()).subtract(5,"minute").format('YYYY-MM-DD HH:mm:ss');
    store.update("00:00:00:00:00:00",new_time);


    store.db.all("select * from gaps", function (e,r) { chai.assert.lengthOf(r,1) });
});
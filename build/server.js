"use strict";
const secret = process.env.CMX_SECRET;
const validator = process.env.CMX_VALIDATOR;
if (!secret || !validator) {
    throw (function () { console.log('missing environment vars'); });
}
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.get('/meraki', function (req, res) {
    res.send(validator);
    console.log("sending validation");
});
let heartbeat;
let store;
app.post('/meraki', function (req, res) {
    if (req.body.secret == secret) {
        let data = req.body.data;
        data.observations.forEach(function (n) {
            try {
                heartbeat(n);
            }
            catch (e) { }
        });
    }
    else {
        console.log('invalid secret');
    }
});
function start(port, db, cb) {
    heartbeat = cb;
    store = db;
    app.listen(port);
    return app;
}
exports.start = start;
const ev = new (require('events'));
app.get('/', function (req, res) {
    ev.once('gaps', function (r) { res.send(r); });
    store.gaps(70, ev);
});

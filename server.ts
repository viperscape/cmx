"use strict"

const secret = process.env.CMX_SECRET;
const validator = process.env.CMX_VALIDATOR;

if (!secret || !validator) { throw(function() { console.log('missing environment vars')} )}

import express = require('express');
const app = express();
import bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/meraki', function(req, res){
  res.send(validator);
  console.log("sending validation")
});

let heartbeat;

app.post('/meraki', function(req, res){ 
	if (req.body.secret == secret) {
		let data = req.body.data;
		data.observations.forEach(function(n) {
				try { heartbeat(n); }
				catch (e) {}
		});
	}
	else { console.log('invalid secret') }
});

export function start (port: number, cb): express.Express {
	heartbeat = cb;
	app.listen(port);
	return app
}
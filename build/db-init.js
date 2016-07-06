"use strict";
const clients_table_drop = 'DROP TABLE IF EXISTS "clients"';
const clients_table = 'CREATE  TABLE  IF NOT EXISTS "main"."clients" ("mac" TEXT PRIMARY KEY  NOT NULL , "heartbeat" INTEGER NOT NULL )';
const gaps_table = 'CREATE  TABLE  IF NOT EXISTS "main"."gaps" ("mac" TEXT NOT NULL , "from" DATETIME NOT NULL , "to" DATETIME NOT NULL )';
const gap_trigger = 'CREATE TRIGGER IF NOT EXISTS "gap" AFTER UPDATE ON "clients" FOR EACH ROW  WHEN OLD.heartbeat < datetime(NEW.heartbeat,\'-15 minutes\')  BEGIN INSERT INTO gaps VALUES (OLD.mac, OLD.heartbeat, NEW.heartbeat); END';
function start(db) {
    db.serialize(function () {
        db.run(clients_table_drop);
        db.run(clients_table);
        db.run(gaps_table);
        db.run(gap_trigger);
    });
}
exports.start = start;

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(process.env.PATH_TO_DB);
module.exports = db;
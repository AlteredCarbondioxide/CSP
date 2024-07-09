const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); 

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY, customer_id INTEGER, title TEXT, description TEXT, status TEXT, answer TEXT)");
});


module.exports = db;
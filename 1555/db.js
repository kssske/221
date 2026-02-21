
const mysql = require('mysql2/promise');

let connection;

async function initDB() {
    // db.js の接続部分
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // ← ここを書き換え！
        database: 'kougi_db' // ← あらかじめMySQLで作っておいたDB名
    });
    console.log("MySQLに接続しました");
}

function getDB() {
    return connection;
}

module.exports = { initDB, getDB };

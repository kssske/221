
const mysql = require('mysql2/promise');

let connection;
async function initDB() {
    let connected = false;
    while (!connected) {
        try {
            connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,

            });
            connected = true;

        } catch (err) {

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

function getDB() {
    return connection;
}

module.exports = { initDB, getDB };

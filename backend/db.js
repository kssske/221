const { Pool } = require('pg');
require('dotenv').config();
let pool;

async function initDB() {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
}

function getDB() {
    return pool;
}

module.exports = { initDB, getDB };
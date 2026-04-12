const { getDB } = require("../db");

const findPinByStudentNumber = async (number) => {
    const db = getDB();
    // MySQL: ? → PostgreSQL: $1
    const res = await db.query(
        'SELECT "暗唱番号" FROM 秘密情報 WHERE "学生番号"=$1',
        [number]
    );
    return res.rows[0]; // PostgreSQLは rows プロパティの中に結果が入る
};

module.exports = { findPinByStudentNumber };
const { getDB } = require("../db");

const findPinByStudentNumber = async (number) => {
    const db = getDB();
    const [rows] = await db.execute(
        "SELECT 暗唱番号 FROM 秘密情報 WHERE 学生番号=?",
        [number]
    );
    return rows[0];
};

module.exports = { findPinByStudentNumber };
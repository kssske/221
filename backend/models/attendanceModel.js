const { getDB } = require("../db");

exports.markAttendance = async (number, session, status) => {
    const db = getDB();

    const sql = `
        INSERT INTO "出欠" ("学生番号", "回", "出席")
        VALUES ($1, $2, $3)
        ON CONFLICT ("学生番号", "回") 
        DO UPDATE SET "出席" = EXCLUDED."出席"
    `;
    return db.query(sql, [number, session, status]);
};

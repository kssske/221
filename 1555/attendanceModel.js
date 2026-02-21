const { getDB } = require("./db");

exports.markAttendance = async (number, session, status) => {
    const db = getDB();

    return db.run(
        `INSERT INTO 出欠 (学生番号, 回, 出席)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE 出席 = VALUES(出席)`,
        [number, session, status]
    );
};

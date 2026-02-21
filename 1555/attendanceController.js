const Attendance = require("./attendanceModel");

exports.mark = async (req, res) => {
    const { number, session, status } = req.body;

    if (!number || !session || status === undefined)
        return res.status(400).json({ error: "必要な情報が不足しています" });

    await Attendance.markAttendance(number, session, status);
    res.json({ message: "出欠情報を更新しました" });
};

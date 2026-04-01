console.log("controller loaded");
const Attendance = require("../models/attendanceModel");


exports.mark = async (req, res) => {

    const { number, session, status } = req.body;

    try {
        await Attendance.markAttendance(number, session, status);
        res.json({ message: "出欠情報を更新しました" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "サーバーエラー" });
    }
};







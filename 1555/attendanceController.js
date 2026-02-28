console.log("controller loaded");
const Attendance = require("./attendanceModel");
const { body, validationResult } = require('express-validator');


exports.validateMark = [
    body('number').isInt().withMessage('学生番号は数値で入力してください'),
    body('session').isInt({ min: 1, max: 15 }).withMessage('回数は1〜15の間で指定してください'),
    body('status').isIn([0, 1]).withMessage('出欠ステータスが不正です'),
];


exports.mark = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { number, session, status } = req.body;

    try {
        await Attendance.markAttendance(number, session, status);
        res.json({ message: "出欠情報を更新しました" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "サーバーエラー" });
    }
};







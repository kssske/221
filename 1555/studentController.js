const Student = require("./studentModel");

exports.getData = async (req, res) => {
    try {
        const number = req.user.number;

        const row = await Student.getStudentData(number);

        if (!row)
            return res.status(404).json({ error: "該当なし" });

        res.json(row);

    } catch (error) {
        res.status(500).json({ error: "サーバーエラー" });
    }
};
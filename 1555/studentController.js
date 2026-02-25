const Student = require("./studentModel");

exports.getData = async (req, res) => {
    try {
        const { number } = req.params;
        const { pin } = req.query;

        if (!pin)
            return res.status(400).json({ error: "暗証番号が必要です" });

        const row = await Student.getStudentData(number, pin);

        if (!row)
            return res.status(404).json({ error: "該当なし、または認証失敗" });

        res.json(row);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "サーバーエラー" });
    }
};
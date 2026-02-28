const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { getDB } = require("./db");

router.post("/login", async (req, res) => {
    try {
        const { number, pin } = req.body;
        const db = getDB();

        const [rows] = await db.execute(
            "SELECT * FROM 秘密情報 WHERE 学生番号=? AND 暗唱番号=?",
            [number, pin]
        );

        if (rows.length === 0)
            return res.status(401).json({ error: "認証失敗" });

        const token = jwt.sign(
            { number },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "サーバーエラー" });
    }
});

module.exports = router;
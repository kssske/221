const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getDB } = require("./db");
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: ログイン
 *     description: 学生番号とPINでログイン
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *               pin:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功
 *       401:
 *         description: 認証失敗
 */
router.post("/login", async (req, res) => {
    try {
        const { number, pin } = req.body;
        const db = getDB();

        const [rows] = await db.execute(
            "SELECT 暗唱番号 FROM 秘密情報 WHERE 学生番号=?",
            [number]
        );

        if (rows.length === 0)
            return res.status(401).json({ error: "認証失敗1" });
        const hash = rows[0].暗唱番号.toString();
        const isMatch = await bcrypt.compare(String(pin), hash);
        console.log("pin:", pin);
        console.log("hash:", hash);
        console.log("hash type:", typeof hash);

        if (!isMatch)
            return res.status(401).json({ error: "認証失敗2" });
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
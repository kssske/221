const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const userModel = require("../models/loginModel");
const validateMark = [
    body('number').isInt().withMessage('学生番号は数値で入力してください'),
    body('pin').isInt().withMessage('pinは数値で入力してください')
];
const login = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(e => e.msg) });
        }
        const { number, pin } = req.body;

        // 1. ユーザーを探す
        const user = await userModel.findPinByStudentNumber(number);
        if (!user) return res.status(401).json({ error: "認証失敗1" });

        // 2. パスワード(PIN)の照合
        const hash = user.暗唱番号.toString();
        const isMatch = await bcrypt.compare(String(pin), hash);

        if (!isMatch) return res.status(401).json({ error: "認証失敗2" });

        // 3. トークン発行
        const token = jwt.sign(
            { number },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "サーバーエラー" });
    }
};

module.exports = { validateMark, login };
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const userModel = require("../models/loginModel");
exports.validateMark = [
    body('number').isInt().withMessage('学生番号は数値で入力してください'),
    body('pin').isInt().withMessage('pinは数値で入力してください')
];
exports.login = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(e => e.msg) });
        }
        const { number, pin } = req.body;

        // 1. find user
        const user = await userModel.findPinByStudentNumber(number);
        if (!user) return res.status(401).json({ error: "その学生は存在しません" });

        // 2. Verify pin
        const hash = user.暗唱番号.toString();
        console.log(hash);
        const isMatch = await bcrypt.compare(String(pin), hash);

        if (!isMatch) return res.status(401).json({ error: "パスワードエラー" });

        // 3. Token Issuance
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
const router = require("express").Router();
const authController = require("../controllers/loginController");
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
router.post("/login", authController.validateMark, authController.login);

module.exports = router;
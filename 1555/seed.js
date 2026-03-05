const bcrypt = require("bcrypt");
const { initDB, getDB } = require("./db");
async function seed() {
    await initDB();
    const db = getDB();
    const createTables = [
        "CREATE TABLE IF NOT EXISTS `受講者` (学生番号 int PRIMARY KEY, 氏名 varchar(50), ふりがな varchar(50))ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        "CREATE TABLE IF NOT EXISTS `秘密情報` (学生番号 int PRIMARY KEY, 暗唱番号 varchar(255)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        "CREATE TABLE IF NOT EXISTS `出欠` (学生番号 int, 回 int, 出席 int, PRIMARY KEY(学生番号, 回)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        "CREATE TABLE IF NOT EXISTS `テスト評価` (学生番号 int, テスト名 varchar(50), 受験 int, 点数 int, PRIMARY KEY(学生番号, テスト名)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
        "CREATE TABLE IF NOT EXISTS `備考` (学生番号 int, 記述 varchar(50), 日付 int, PRIMARY KEY(学生番号, 日付)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
    ];

    for (const sql of createTables) {
        await db.query(sql);
    }
    await db.query("SET FOREIGN_KEY_CHECKS = 0;"); // 制約を一時的に無効化
    await db.query("TRUNCATE TABLE 出欠");
    await db.query("TRUNCATE TABLE 備考");
    await db.query("TRUNCATE TABLE 秘密情報");
    await db.query("TRUNCATE TABLE テスト評価");
    await db.query("TRUNCATE TABLE 受講者");
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
    const messages = [
        "プログラミングの理解が非常に早いです。",
        "積極的に質問をしており、意欲的です。",
        "課題の提出が常に早く、精度も高いです。"
    ];
    const testNames = ["テスト1", "テスト2", "期末試験"];

    // 1. 事前に「備考」を入れる6人をランダムに決める（重複なし）
    const studentIndices = Array.from({ length: 50 }, (_, i) => i + 1); // [1, 2, ..., 50]
    const selectedIndices = studentIndices
        .sort(() => Math.random() - 0.5) // シャッフル
        .slice(0, 6); // 先頭の6人を選択

    // 2. 一括挿入用の配列を準備
    let studentsData = [];
    let attendanceData = [];
    let remarksData = [];
    let pinn = [];
    let testScoreData = [];


    for (let i = 1; i <= 50; i++) {
        const studentNumber = 10300 + i;

        // 受講者データ
        studentsData.push([studentNumber, `学生${i}`, `がくせい${i}`]);

        // 出欠データ（15回分）
        for (let s = 1; s <= 15; s++) {
            const status = Math.random() > 0.2 ? 1 : 0;
            attendanceData.push([studentNumber, s, status]);
        }

        // 3. 選ばれた6人の場合のみ、備考データを作成
        if (selectedIndices.includes(i)) {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            const m = Math.floor(Math.random() * 12) + 1;
            const d = Math.floor(Math.random() * 28) + 1;

            // padStart(2, '0') で 2026-01-05 のような形式にする
            const day = `2026${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
            remarksData.push([studentNumber, randomMsg, day]);
        }
        testNames.forEach(testName => {
            // テスト1, 2は40〜100点、期末は少し厳しめに30〜100点など
            const juken = Math.random() > 0.05 ? 1 : 0;
            const minScore = testName === "期末試験" ? 30 : 40;
            const score = Math.floor(Math.random() * (101 - minScore)) + minScore;

            // [学生番号, テスト名, 受験フラグ, 点数] の順で配列に入れる
            testScoreData.push([studentNumber, testName, juken, score]);
        });

        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(`学生番号${studentNumber} pin${pin}`);
        const hash = await bcrypt.hash(pin, 10);

        pinn.push([studentNumber, hash]);

    }

    // 4. まとめて実行（一括挿入）
    // mysql2ライブラリの query 形式を使うと [ [data1], [data2] ] を一気に送れます
    try {
        await db.query("INSERT INTO 受講者 (学生番号, 氏名, ふりがな) VALUES ?", [studentsData]);
        console.log("受講者OK");

        await db.query("INSERT INTO 出欠 (学生番号, 回, 出席) VALUES ?", [attendanceData]);
        console.log("出欠OK");

        await db.query("INSERT INTO 備考 (学生番号, 記述, 日付) VALUES ?", [remarksData]);
        console.log("備考OK");

        await db.query("INSERT INTO 秘密情報 (学生番号, 暗唱番号) VALUES ?", [pinn]);
        console.log("秘密情報OK");

        await db.query("INSERT INTO テスト評価 (学生番号, テスト名, 受験, 点数) VALUES ?", [testScoreData]);
        console.log("テスト評価OK");

    } catch (error) {
        console.error("❌ エラー発生:", error.message);
    }
    process.exit();
}

seed();
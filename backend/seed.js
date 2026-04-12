const bcrypt = require("bcryptjs");
const format = require('pg-format');
const { initDB, getDB } = require("./db");
async function seed() {
    await initDB();
    const db = getDB();
    const createTables = [
        'CREATE TABLE IF NOT EXISTS "受講者" ("学生番号" INTEGER PRIMARY KEY, "氏名" VARCHAR(50), "ふりがな" VARCHAR(50));',
        'CREATE TABLE IF NOT EXISTS "秘密情報" ("学生番号" INTEGER PRIMARY KEY, "暗唱番号" VARCHAR(255));',
        'CREATE TABLE IF NOT EXISTS "出欠" ("学生番号" INTEGER, "回" INTEGER, "出席" INTEGER, PRIMARY KEY("学生番号", "回"));',
        'CREATE TABLE IF NOT EXISTS "テスト評価" ("学生番号" INTEGER, "テスト名" VARCHAR(50), "受験" INTEGER, "点数" INTEGER, PRIMARY KEY("学生番号", "テスト名"));',
        'CREATE TABLE IF NOT EXISTS "備考" ("学生番号" INTEGER, "記述" VARCHAR(255), "日付" INTEGER, PRIMARY KEY("学生番号", "日付"));'
    ];

    for (const sql of createTables) {
        await db.query(sql);
    }
    await db.query('TRUNCATE TABLE "受講者", "秘密情報", "出欠", "テスト評価", "備考" CASCADE;');
    const messages = [
        "プログラミングの理解が非常に早いです。",
        "積極的に質問をしており、意欲的です。",
        "課題の提出が常に早く、精度も高いです。"
    ];
    const testNames = ["テスト1", "テスト2", "期末試験"];

    // Select 6 people to randomly include 備考
    const studentIndices = Array.from({ length: 50 }, (_, i) => i + 1);
    const selectedIndices = studentIndices
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, 6); // pick the first 6 people 

    let studentsData = [];
    let attendanceData = [];
    let remarksData = [];
    let pinn = [];
    let testScoreData = [];


    for (let i = 1; i <= 50; i++) {
        const studentNumber = 10300 + i;

        // 受講者
        studentsData.push([studentNumber, `学生${i}`, `がくせい${i}`]);

        // 出欠（15回分）
        for (let s = 1; s <= 15; s++) {
            const status = Math.random() > 0.2 ? 1 : 0;
            attendanceData.push([studentNumber, s, status]);
        }

        // creat 備考データ for picked 6 people
        if (selectedIndices.includes(i)) {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            const m = Math.floor(Math.random() * 12) + 1;
            const d = Math.floor(Math.random() * 28) + 1;

            // padStart(2, '0') で 2026-01-05 のような形式にする
            const day = `2026${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
            remarksData.push([studentNumber, randomMsg, day]);
        }
        testNames.forEach(testName => {
            // test1, 2 are 40〜100点、final exam is more strictly 30〜100点
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
        await db.query(format('INSERT INTO "受講者" ("学生番号", "氏名", "ふりがな") VALUES %L', studentsData));
        console.log("受講者OK");

        await db.query(format('INSERT INTO "出欠" ("学生番号", "回", "出席") VALUES %L', attendanceData));
        console.log("出欠OK");

        await db.query(format('INSERT INTO "備考" ("学生番号", "記述", "日付") VALUES %L', remarksData));
        console.log("備考OK");

        await db.query(format('INSERT INTO "秘密情報" ("学生番号", "暗唱番号") VALUES %L', pinn));
        console.log("秘密情報OK");

        await db.query(format('INSERT INTO "テスト評価" ("学生番号", "テスト名", "受験", "点数") VALUES %L', testScoreData));
        console.log("テスト評価OK");

    } catch (error) {
        console.error("❌ エラー発生:", error.message);
    }
    process.exit();
}

seed();
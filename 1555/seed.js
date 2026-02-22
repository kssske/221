const { initDB, getDB } = require("./db");

async function seed() {
    await initDB();
    const db = getDB();

    for (let i = 1; i <= 50; i++) {
        const studentNumber = 10300 + i;
        const pin = Math.floor(1000 + Math.random() * 9000); // 4桁のランダムな数字

        // 受講者の作成
        await db.execute(
            "INSERT INTO 受講者 (学生番号, 氏名,ふりがな) VALUES (?, ?,?)",
            [studentNumber, `学生${i}`, `がくせい${i}`]
        );

        // 出欠のランダム作成（1〜15回分）
        for (let s = 1; s <= 15; s++) {
            const status = Math.random() > 0.2 ? 1 : 0; // 80%の確率で出席
            await db.execute(
                "INSERT INTO 出欠 (学生番号, 回, 出席) VALUES (?, ?, ?)",
                [studentNumber, s, status]
            );
        }
        const discriptionid = Math.floor(studentNumber);
        "INSERT INTO 出欠 (学生番号, 回, 出席) VALUES (?, ?, ?)"


    }
    console.log("50人分のダミーデータを投入しました！");
    process.exit();
}

seed();
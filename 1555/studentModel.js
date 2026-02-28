const { getDB } = require("./db");

exports.getStudentData = async (number) => {
  const db = getDB();

  const cols = Array.from({ length: 15 }, (_, i) =>
    `MAX(CASE WHEN 出欠.回=${i + 1} THEN 出欠.出席 ELSE 0 END) AS '${i + 1}回目'`
  ).join(",");

  const sql = `
  SELECT 受講者.学生番号, 氏名, ふりがな, 
  備考.記述, 日付,
  テスト結果.テスト合計,
  CASE
    WHEN テスト合計 >= 90 THEN 'S'
    WHEN テスト合計 >= 80 THEN 'A'
    WHEN テスト合計 >= 60 THEN 'B'
    WHEN テスト合計 >= 50 THEN 'C'
    WHEN テスト合計 >= 40 THEN 'D'
    ELSE 'M' END AS 成績,
  出席結果.出席合計, ${cols}
  FROM 受講者
  LEFT JOIN 出欠 USING(学生番号)
  LEFT JOIN (SELECT 学生番号, SUM(点数) AS テスト合計 FROM テスト評価 GROUP BY 学生番号) AS テスト結果 USING(学生番号)
  LEFT JOIN (SELECT 学生番号, SUM(出席) AS 出席合計 FROM 出欠 GROUP BY 学生番号) AS 出席結果 USING(学生番号)
  LEFT JOIN 備考 USING(学生番号)
  LEFT JOIN 秘密情報 USING(学生番号)
  WHERE 学生番号=?
  GROUP BY 受講者.学生番号, 氏名, ふりがな, 備考.記述, 日付, テスト結果.テスト合計
  `;

  const [rows] = await db.execute(sql, [number]);
  return rows[0];
};

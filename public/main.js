// 学生情報を保持しておく（学生番号などを出欠登録側で使うため）
let currentStudentNumber = null;

// ページ読み込み時の初期化
window.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const attendanceForm = document.getElementById("attendanceForm");

  // イベントリスナーの設定
  searchForm.addEventListener("submit", handleSearchSubmit);
  attendanceForm.addEventListener("submit", handleAttendanceSubmit);
});
// タイトルをクリックした時の処理
document.getElementById("homeButton").addEventListener("click", () => {
  // 1. 入力フォームの内容を空にする
  document.getElementById("searchForm").reset();
  document.getElementById("attendanceForm").reset();

  // 2. 表示されていた学生セクションと登録セクションを隠す
  document.getElementById("studentSection").hidden = true;
  document.getElementById("attendanceSection").hidden = true;

  // 3. メッセージエリアを空にする
  document.getElementById("searchMessage").textContent = "";
  document.getElementById("attendanceMessage").textContent = "";

  // 4. 保持していた学生番号をリセット
  currentStudentNumber = null;

  // 5. 画面のトップへスクロール（おまけ）
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
// ====================================================================
// 学生情報取得フォームの送信処理
// ====================================================================
async function handleSearchSubmit(e) {
  e.preventDefault();

  const number = document.getElementById("studentNumber").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const msg = document.getElementById("searchMessage");

  // メッセージエリアをリセット
  msg.textContent = "";
  msg.className = "message";

  if (!number || !pin) {
    msg.textContent = "学生番号と暗証番号を入力してください。";
    msg.classList.add("error");
    return;
  }

  try {
    // /data/:number?pin=xxx にアクセス
    const res = await fetch(`/api/student/${encodeURIComponent(number)}?pin=${encodeURIComponent(pin)}`);// main.js の修正


    const data = await res.json();

    if (!res.ok) {
      // サーバーからのエラーメッセージを表示 (例: "該当なし、または認証失敗")
      msg.textContent = data.error || "取得に失敗しました。";
      msg.classList.add("error");
      // データ表示エリアを非表示にしておく
      document.getElementById("studentSection").hidden = true;
      document.getElementById("attendanceSection").hidden = true;
      return;
    }

    // 正常取得できたら画面に表示
    currentStudentNumber = data.学生番号;
    document.getElementById("attendanceNumber").value = currentStudentNumber;

    // 情報とテーブルを描画
    renderStudentInfo(data);
    renderAttendanceTable(data);

    // 非表示だったセクションを表示にする
    document.getElementById("studentSection").hidden = false;
    document.getElementById("attendanceSection").hidden = false;

    // 成功メッセージ
    msg.textContent = "学生情報を取得しました。";
    msg.classList.add("success");
  } catch (err) {
    console.error(err);
    msg.textContent = "通信エラーが発生しました。";
    msg.classList.add("error");
  }
}

// 学生基本情報の描画関数
function renderStudentInfo(data) {
  const div = document.getElementById("studentInfo");
  // data のキーは SQL のSELECTで取ったカラム名に依存
  const html = `
    <table>
      <tbody>
        <tr><th>学生番号</th><td>${data.学生番号}</td></tr>
        <tr><th>氏名</th><td>${data.氏名 || ""}</td></tr>
        <tr><th>ふりがな</th><td>${data.ふりがな || ""}</td></tr>
        <tr><th>記述</th><td>${data.記述 || ""}</td></tr>
        <tr><th>日付</th><td>${data.日付 || ""}</td></tr>
        <tr><th>テスト合計</th><td>${data.テスト合計 ?? ""}</td></tr>
        <tr><th>成績</th><td>${data.成績 || ""}</td></tr>
        <tr><th>出席合計</th><td>${data.出席合計 ?? ""}</td></tr>
      </tbody>
    </table>
  `;
  div.innerHTML = html;
}

// 出欠テーブルを描画（1〜15回目）
function renderAttendanceTable(data) {
  const table = document.getElementById("attendanceTable");

  // ヘッダーと値のセルを生成
  const headerCells = [];
  const valueCells = [];
  for (let i = 1; i <= 15; i++) {
    const key = `${i}回目`;
    headerCells.push(`<th>${key}</th>`);

    const v = data[key];
    let label = "";

    if (v === 1 || v === "1") {
      label = "出席";
    } else if (v === 0 || v === "0" || v == null) {
      // DB上でNULL、0などの可能性があるためまとめて扱う
      label = v == null ? "" : "欠席";
    } else {
      label = v; // 1, 0, null以外（例：公欠など）
    }
    valueCells.push(`<td>${label}</td>`);
  }

  // HTMLの挿入
  table.innerHTML = `
    <thead>
      <tr>${headerCells.join("")}</tr>
    </thead>
    <tbody>
      <tr>${valueCells.join("")}</tr>
    </tbody>
  `;
}

// ====================================================================
// 出欠登録フォームの送信処理
// ====================================================================
async function handleAttendanceSubmit(e) {
  e.preventDefault();

  const numInput = document.getElementById("attendanceNumber");
  const sessionSelect = document.getElementById("session");
  const msg = document.getElementById("attendanceMessage");

  const number = numInput.value.trim(); // 検索時に設定された学生番号
  const session = sessionSelect.value;
  const statusNode = document.querySelector('input[name="status"]:checked');

  // メッセージエリアをリセット
  msg.textContent = "";
  msg.className = "message";

  // バリデーション
  if (!number) {
    msg.textContent = "学生情報が読み込まれていません。先に上のフォームで検索してください。";
    msg.classList.add("error");
    return;
  }
  if (!session) {
    msg.textContent = "回を選択してください。";
    msg.classList.add("error");
    return;
  }
  if (!statusNode) {
    msg.textContent = "出席 or 欠席を選択してください。";
    msg.classList.add("error");
    return;
  }

  const status = Number(statusNode.value); // 1 or 0

  try {
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number,
        session: Number(session),
        status,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // サーバーからのエラー（DBエラーなど）を表示
      msg.textContent = data.error || "登録に失敗しました。";
      msg.classList.add("error");
      return;
    }

    // 成功メッセージ
    msg.textContent = data.message || "出欠情報を更新しました。";
    msg.classList.add("success");
    handleSearchSubmit(new Event("submit"));

    // 【オプション】更新後の状態を再確認したい場合は、
    // handleSearchSubmit() を呼び出してテーブルを再描画しても良い

  } catch (err) {
    console.error(err);
    msg.textContent = "通信エラーが発生しました。";
    msg.classList.add("error");
  }

}
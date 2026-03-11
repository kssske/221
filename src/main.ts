

// APIから返ってくる学生情報の形
interface StudentData {
  学生番号: string | number;
  氏名?: string;
  ふりがな?: string;
  記述?: string;
  日付?: string;
  テスト合計?: number;
  成績?: string;
  出席合計?: number;
  [key: string]: any; // 「1回目」〜「15回目」のような動的なキーを許可
}

// ログインレスポンス
interface LoginResponse {
  token: string;
}

// 出欠登録レスポンス
interface AttendanceResponse {
  message: string;
}

// --- 状態管理 ---
let currentStudentNumber: string | number | null = null;
let authToken: string | null = null;

// --- 共通API関数 (Genericsを使用) ---
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "API error");
  }

  return data as T;
}

// メッセージ表示関数
function showMessage(el: HTMLElement | null, text: string, type?: "success" | "error"): void {
  if (!el) return;
  el.textContent = text;
  el.className = "message";
  if (type) {
    el.classList.add(type);
  }
}

// --- イベントリスナー ---
window.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm") as HTMLFormElement | null;
  const attendanceForm = document.getElementById("attendanceForm") as HTMLFormElement | null;

  searchForm?.addEventListener("submit", handleSearchSubmit);
  attendanceForm?.addEventListener("submit", handleAttendanceSubmit);
});

// ホームボタン
document.getElementById("homeButton")?.addEventListener("click", () => {
  (document.getElementById("searchForm") as HTMLFormElement)?.reset();
  (document.getElementById("attendanceForm") as HTMLFormElement)?.reset();

  const sections = ["studentSection", "attendanceSection"];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });

  showMessage(document.getElementById("searchMessage"), "");
  showMessage(document.getElementById("attendanceMessage"), "");

  currentStudentNumber = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- メインロジック ---

async function handleSearchSubmit(e: Event): Promise<void> {
  e.preventDefault();

  const numberInput = document.getElementById("studentNumber") as HTMLInputElement;
  const pinInput = document.getElementById("pin") as HTMLInputElement;
  const msg = document.getElementById("searchMessage");

  const number = numberInput.value.trim();
  const pin = pinInput.value.trim();

  if (!number || !pin) {
    showMessage(msg, "学生番号と暗証番号を入力してください。", "error");
    return;
  }

  try {
    // ログイン
    const loginData = await apiFetch<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify({ number, pin })
    });

    authToken = loginData.token;

    // 学生情報取得
    const data = await apiFetch<StudentData>(`/api/student/${number}`);

    currentStudentNumber = data.学生番号;
    const attNumInput = document.getElementById("attendanceNumber") as HTMLInputElement;
    if (attNumInput) attNumInput.value = String(currentStudentNumber);

    renderStudentInfo(data);
    renderAttendanceTable(data);

    const studentSec = document.getElementById("studentSection");
    const attendSec = document.getElementById("attendanceSection");
    if (studentSec) studentSec.hidden = false;
    if (attendSec) attendSec.hidden = false;

    showMessage(msg, "学生情報を取得しました", "success");
  } catch (err: any) {
    console.error(err);
    showMessage(msg, "ログインまたは取得に失敗しました", "error");
  }
}

function renderStudentInfo(data: StudentData): void {
  const div = document.getElementById("studentInfo");
  if (!div) return;

  div.innerHTML = `
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
}

function renderAttendanceTable(data: StudentData): void {
  const table = document.getElementById("attendanceTable");
  if (!table) return;

  const headerCells: string[] = [];
  const valueCells: string[] = [];

  for (let i = 1; i <= 15; i++) {
    const key = `${i}回目`;
    headerCells.push(`<th>${key}</th>`);

    const v = data[key];
    let label = "";
    if (v === 1 || v === "1") label = "出席";
    else if (v === 0 || v === "0" || v == null) label = v == null ? "" : "欠席";
    else label = String(v);

    valueCells.push(`<td>${label}</td>`);
  }

  table.innerHTML = `
    <thead><tr>${headerCells.join("")}</tr></thead>
    <tbody><tr>${valueCells.join("")}</tr></tbody>
  `;
}

async function handleAttendanceSubmit(e: Event): Promise<void> {
  e.preventDefault();

  const sessionSelect = document.getElementById("session") as HTMLSelectElement;
  const msg = document.getElementById("attendanceMessage");
  const statusNode = document.querySelector('input[name="status"]:checked') as HTMLInputElement;

  const number = currentStudentNumber;
  const session = sessionSelect.value;

  if (!number) {
    showMessage(msg, "学生情報が読み込まれていません。", "error");
    return;
  }
  if (!session || !statusNode) {
    showMessage(msg, "回と出欠を選択してください。", "error");
    return;
  }

  try {
    const data = await apiFetch<AttendanceResponse>("/api/attendance", {
      method: "POST",
      body: JSON.stringify({ number, session, status: Number(statusNode.value) })
    });

    showMessage(msg, data.message, "success");
    handleSearchSubmit(new Event("submit"));
  } catch (err: any) {
    showMessage(msg, "通信エラーが発生しました。", "error");
  }
}
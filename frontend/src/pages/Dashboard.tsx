import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";
import StudentInfo from "../components/StudentInfo";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceForm from "../components/AttendanceForm"; // 1. 追加
import type { Student } from "../types/student";
import "../styles/dashboard.css";

export default function Dashboard() {
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // 2. データを読み込む関数を外に出す（再利用するため）
    const loadData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("tokenエラー");
            setLoading(false);
            return;
        }
        try {
            const data = await apiFetch<Student>("/api/student/me");
            setStudent(data);
        } catch (err) {
            setError("認証に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) return <div className="loading">読み込み中...</div>;
    if (error) return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <p className="message error">{error}</p>
                <button onClick={() => navigate("/")}>ログインへ戻る</button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-page">
            <header>
                <h1>学生マイページ</h1>
            </header>

            <main>
                {student ? (
                    <>
                        <section className="card">
                            <StudentInfo data={student} />
                        </section>

                        {/* 3. 出席登録カードをここに追加 */}
                        <section className="card">
                            <AttendanceForm
                                studentNumber={student.学生番号}
                                onUpdated={loadData} // 登録完了後に自分を再読み込み
                            />
                        </section>

                        <section className="card">
                            <div className="table-wrapper">
                                <AttendanceTable data={student} />
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="card"><p>データが見つかりませんでした。</p></div>
                )}

                <div className="logout-container">
                    <button
                        className="btn-logout"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                    >
                        ログアウト
                    </button>
                </div>
            </main>
        </div>
    );
}
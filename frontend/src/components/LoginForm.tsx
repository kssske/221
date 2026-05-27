import { useState, type SyntheticEvent } from "react";
import { apiFetch } from "../api/api";

interface Props {
    onLogin: (token: string) => void; // If successful, pass the token to LoginPage
}

export default function LoginForm({ onLogin }: Props) {
    const [number, setNumber] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await apiFetch<{ token: string }>("/api/login", {
                method: "POST",
                body: JSON.stringify({ number, pin })
            });


            onLogin(data.token);
        } catch (err: any) {
            setError(err.message || "ログインに失敗しました");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <label>学生番号</label>
                <input
                    type="text"

                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    disabled={loading}
                    required
                />
            </div>
            <div className="form-row">
                <label>PINコード</label>
                <input
                    type="password"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "ログイン中..." : "ログイン"}
            </button>

            {error && <p className="message error">{error}</p>} {/*if error <p> otherwise null*/}
        </form>
    );
}
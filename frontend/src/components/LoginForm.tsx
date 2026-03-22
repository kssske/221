import { useState } from "react";
import { apiFetch } from "../api/api";

interface Props {
    onLogin: (token: string) => void; // 成功したらトークンを親に渡す
}

export default function LoginForm({ onLogin }: Props) {
    const [number, setNumber] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");

        try {
            const data = await apiFetch<{ token: string }>("/api/login", {
                method: "POST",
                body: JSON.stringify({ number, pin })
            });


            onLogin(data.token);
        } catch (err: any) {
            setError("学生番号またはPINが違います");
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
                    required
                />
            </div>
            <div className="form-row">
                <label>PINコード</label>
                <input
                    type="password"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    required
                />
            </div>

            <button type="submit">ログイン</button>

            {error && <p className="message error">{error}</p>}
        </form>
    );
}
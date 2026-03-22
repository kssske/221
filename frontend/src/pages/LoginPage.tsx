import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../styles/login.css";

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLoginSuccess = (token: string) => {
        localStorage.setItem("token", token);
        navigate("/dashboard");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Login</h2>
                <LoginForm onLogin={handleLoginSuccess} />
            </div>
        </div>
    );
}
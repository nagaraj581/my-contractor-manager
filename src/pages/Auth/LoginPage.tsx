import "./LoginPage.css";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import TextField from "../../components/inputs/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { loginWithGoogle } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      // Navigate to Dashboard after successful login
      navigate("/", { replace: true });

    } catch (error: any) {
      console.error("Login Error:", error);

      alert(
        error?.message ||
        "Unable to sign in. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  try {
    setLoading(true);

    await loginWithGoogle();

    navigate("/", { replace: true });

  } catch (error: any) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand">
          <h1>🏗 Contractor Manager</h1>

          <p>
            Professional Business Management for
            <br />
            Electrical & Plumbing Contractors.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>

          <p className="subtitle">
            Sign in to continue
          </p>

          <TextField
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            required
          />

          <TextField
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="Enter your password"
            required
          />

          <PrimaryButton
            title="Sign In"
            loading={loading}
            onClick={handleLogin}
            fullWidth
          />

          <div className="divider">
            OR
          </div>

          <button
  className="google-btn"
  onClick={handleGoogleLogin}
>
  Continue with Google
</button>

          <p className="footer">
            Don't have an account?
            <span> Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}
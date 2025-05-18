import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("roles", JSON.stringify(data.roles));
      window.dispatchEvent(new Event("userChanged"));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h1>{t("login")}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          {t("email")}
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          {t("password")}
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit" className="auth-btn">{t("login")}</button>
      </form>
    </div>
  );
};

export default Login;

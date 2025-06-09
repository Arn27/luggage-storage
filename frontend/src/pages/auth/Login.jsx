import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/admin/ConfirmModal";
import "../styles/Auth.css";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [modal, setModal] = useState({ show: false, message: "", type: "info", onConfirm: null });

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
        setModal({ show: true, message: data.message || t("login_failed"), type: "info", onConfirm: () => setModal({ ...modal, show: false }) });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("roles", JSON.stringify(data.roles));
      window.dispatchEvent(new Event("userChanged"));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setModal({ show: true, message: t("something_went_wrong"), type: "info", onConfirm: () => setModal({ ...modal, show: false }) });
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
      <ConfirmModal show={modal.show} onClose={modal.onConfirm} onConfirm={modal.onConfirm} message={modal.message} type={modal.type} />
    </div>
  );
};

export default Login;

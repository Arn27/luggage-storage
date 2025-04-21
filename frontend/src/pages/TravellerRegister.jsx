import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const TravellerRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h1>{t("traveller_signup")}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          {t("name")}
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          {t("email")}
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          {t("password")}
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit" className="auth-btn">{t("signup")}</button>
      </form>
    </div>
  );
};

export default TravellerRegister;

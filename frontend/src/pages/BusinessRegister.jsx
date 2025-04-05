import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const BusinessRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend
    console.log("Registering business:", form);
    navigate("/login"); // fake redirect
  };

  return (
    <div className="auth-container">
      <h1>{t("partner_signup")}</h1>
      <p className="auth-note">{t("business_approval_note")}</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          {t("business_name")}
          <input type="text" name="business_name" value={form.business_name} onChange={handleChange} required />
        </label>
        <label>
          {t("email")}
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          {t("phone")}
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
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

export default BusinessRegister;

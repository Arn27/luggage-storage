import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../pages/styles/UserDashboard.css";

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setMessage(data.message || "Error occurred");
        }
      } else {
        setMessage(data.message);
        setFormData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      }
    } catch (err) {
      console.error("Change password failed", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dashboard-section">

      {message && <p className="status-message">{message}</p>}

      <div className="form-group">
        <label>{t("current_password")}</label>
        <input
          type="password"
          name="current_password"
          value={formData.current_password}
          onChange={handleChange}
          required
        />
        {errors.current_password && <p className="error">{errors.current_password[0]}</p>}
      </div>

      <div className="form-group">
        <label>{t("new_password")}</label>
        <input
          type="password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          required
        />
        {errors.new_password && <p className="error">{errors.new_password[0]}</p>}
      </div>

      <div className="form-group">
        <label>{t("confirm_password")}</label>
        <input
          type="password"
          name="new_password_confirmation"
          value={formData.new_password_confirmation}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn">{t("update_password")}</button>
    </form>
  );
};

export default ChangePasswordForm;

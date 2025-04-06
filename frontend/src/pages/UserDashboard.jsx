import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <h1>{t("dashboard")}</h1>

      <section className="dashboard-section">
        <h2>{t("account_info")}</h2>
        <p><strong>{t("name")}:</strong> {user.name}</p>
        <p><strong>{t("email")}:</strong> {user.email}</p>
        <p><strong>{t("registered")}:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </section>

      <section className="dashboard-section">
        <h2>{t("actions")}</h2>
        <button className="btn">{t("change_password")}</button>
        {/* Add edit profile button later */}
      </section>

      <section className="dashboard-section">
        <h2>{t("upcoming_bookings")}</h2>
        <p>{t("no_upcoming_bookings")}</p> {/* Later we’ll replace with real data */}
      </section>

      <section className="dashboard-section">
        <h2>{t("past_bookings")}</h2>
        <p>{t("no_past_bookings")}</p>
      </section>
    </div>
  );
};

export default UserDashboard;

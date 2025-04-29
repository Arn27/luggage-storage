import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AdminUsers from "../components/admin/AdminUsers";
import AdminBusinesses from "../components/admin/AdminBusinesses";
import AdminLocations from "../components/admin/AdminLocations";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [stats, setStats] = useState({
    users: 0,
    businesses: 0,
    locations: 0,
    pendingBusinesses: 0,
  });

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    if (!roles.includes("admin")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-panel">
      <h1>{t("admin_panel")}</h1>

      {activeTab === "dashboard" && (
        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => setActiveTab("users")}>
            <h2>{t("users")}</h2>
            <p>{stats.users}</p>
          </div>
          <div className="dashboard-card" onClick={() => setActiveTab("businesses")}>
            <h2>{t("businesses")}</h2>
            <p>{stats.businesses}</p>
          </div>
          <div className="dashboard-card" onClick={() => setActiveTab("locations")}>
            <h2>{t("locations")}</h2>
            <p>{stats.locations}</p>
          </div>
          <div className="dashboard-card" onClick={() => setActiveTab("pending")}>
            <h2>{t("pending_businesses")}</h2>
            <p>{stats.pendingBusinesses}</p>
          </div>
        </div>
      )}

      {activeTab === "pending" && <AdminBusinesses pendingOnly />}
      {activeTab === "users" && <AdminUsers />}
      {activeTab === "businesses" && <AdminBusinesses />}
      {activeTab === "locations" && <AdminLocations />}
    </div>
  );
};

export default AdminPanel;

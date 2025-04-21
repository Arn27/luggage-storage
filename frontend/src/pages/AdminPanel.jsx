import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AdminTabSwitcher from "../components/admin/AdminTabSwitcher";
import AdminUsers from "../components/admin/AdminUsers";
import AdminBusinesses from "../components/admin/AdminBusinesses";
import AdminLocations from "../components/admin/AdminLocations";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    if (!roles.includes("admin")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="admin-panel">
      <h1>{t("admin_panel")}</h1>
      <AdminTabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "pending" && <AdminBusinesses pendingOnly />}
      {activeTab === "users" && <AdminUsers />}
      {activeTab === "businesses" && <AdminBusinesses />}
      {activeTab === "locations" && <AdminLocations />}
    </div>
  );
};

export default AdminPanel;

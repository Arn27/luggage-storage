import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminTabSwitcher from "../components/admin/AdminTabSwitcher";
import AdminUsers from "../components/admin/AdminUsers";
import AdminBusinesses from "../components/admin/AdminBusinesses";
import AdminLocations from "../components/admin/AdminLocations";
import "./AdminPanel.css";


const AdminPanel = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("pending");

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

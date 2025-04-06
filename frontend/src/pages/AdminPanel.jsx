import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { t } = useTranslation();
  const [pendingBusinesses, setPendingBusinesses] = useState([]);

  const token = localStorage.getItem("token");

  const fetchPending = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/pending-businesses", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setPendingBusinesses(data);
    } catch (err) {
      console.error("Failed to fetch pending businesses:", err);
    }
  };

  const approveBusiness = async (id) => {
    if (!confirm("Are you sure you want to approve this business?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/approve-business/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      alert(data.message);
      fetchPending();
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-panel">
      <h1>{t("admin_panel")}</h1>

      {pendingBusinesses.length === 0 ? (
        <p>{t("no_pending_businesses")}</p>
      ) : (
        <div className="business-list">
          {pendingBusinesses.map((b) => (
            <div key={b.id} className="business-card">
              <h3>{b.business_name}</h3>
              <p>📧 {b.email}</p>
              <p>📞 {b.phone || t("no_phone")}</p>
              <button className="btn" onClick={() => approveBusiness(b.id)}>
                ✅ {t("approve")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

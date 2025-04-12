// components/admin/AdminBusinesses.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "./ConfirmModal";

const AdminBusinesses = ({ pendingOnly = false }) => {
  const { t } = useTranslation();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchBusinesses = async () => {
    const url = pendingOnly
      ? "http://127.0.0.1:8000/api/admin/pending-businesses"
      : "http://127.0.0.1:8000/api/admin/businesses";
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setBusinesses(data);
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
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
      fetchBusinesses();
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Something went wrong.");
    }
  };

  const deleteBusiness = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/businesses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      alert(data.message);
      fetchBusinesses();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="business-list">
      {businesses.length === 0 ? (
        <p>{pendingOnly ? t("no_pending_businesses") : t("no_businesses")}</p>
      ) : (
        businesses.map((b) => (
          <div key={b.id} className="business-card">
            <h3>{b.business_name}</h3>
            <p>📧 {b.email}</p>
            <p>📞 {b.phone || t("no_phone")}</p>
            {pendingOnly ? (
              <button className="btn" onClick={() => approveBusiness(b.id)}>
                ✅ {t("approve")}
              </button>
            ) : (
              <button className="btn" onClick={() => {
                setSelectedBusiness(b);
                setShowModal(true);
              }}>
                🗑️ {t("delete")}
              </button>
            )}
          </div>
        ))
      )}

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          if (selectedBusiness) deleteBusiness(selectedBusiness.id);
          setShowModal(false);
        }}
        message={t("confirm_delete_business")}
      />
    </div>
  );
};

export default AdminBusinesses;

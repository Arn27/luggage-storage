import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "./ConfirmModal";

const AdminBusinesses = ({ pendingOnly = false }) => {
  const { t } = useTranslation();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("confirm");
  const [modalMessage, setModalMessage] = useState("");
  const [approveMode, setApproveMode] = useState(false);

  const token = localStorage.getItem("token");

  const fetchBusinesses = async () => {
    const url = pendingOnly
      ? "http://localhost:8000/api/admin/pending-businesses"
      : "http://localhost:8000/api/admin/businesses";
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
    try {
      const res = await fetch(`http://localhost:8000/api/admin/approve-business/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setModalType("success");
      setModalMessage(data.message);
      setShowModal(true);
      fetchBusinesses();
    } catch (err) {
      console.error("Approval failed:", err);
      setModalType("error");
      setModalMessage(t("something_went_wrong"));
      setShowModal(true);
    }
  };

  const deleteBusiness = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/businesses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setModalType("success");
      setModalMessage(data.message);
      setShowModal(true);
      fetchBusinesses();
    } catch (err) {
      console.error("Delete failed:", err);
      setModalType("error");
      setModalMessage(t("something_went_wrong"));
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    if (selectedBusiness) {
      approveMode
        ? approveBusiness(selectedBusiness.id)
        : deleteBusiness(selectedBusiness.id);
    }
    setSelectedBusiness(null);
  };

  return (
    <div className="business-list">
      {businesses.length === 0 ? (
        <p>{pendingOnly ? t("no_pending_businesses") : t("no_businesses")}</p>
      ) : (
        businesses.map((b) => (
          <div key={b.id} className="business-card">
            <h3>{b.business_name}</h3>
            <p>\ud83d\udce7 {b.email}</p>
            <p>\ud83d\udcde {b.phone || t("no_phone")}</p>
            {pendingOnly ? (
              <button
                className="btn"
                onClick={() => {
                  setSelectedBusiness(b);
                  setApproveMode(true);
                  setModalType("confirm");
                  setModalMessage(t("confirm_approve_business"));
                  setShowModal(true);
                }}
              >
                ✅ {t("approve")}
              </button>
            ) : (
              <button
                className="btn"
                onClick={() => {
                  setSelectedBusiness(b);
                  setApproveMode(false);
                  setModalType("confirm");
                  setModalMessage(t("confirm_delete_business"));
                  setShowModal(true);
                }}
              >
                🗑️ {t("delete")}
              </button>
            )}
          </div>
        ))
      )}

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default AdminBusinesses;

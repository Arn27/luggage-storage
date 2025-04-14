import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../components/admin/ConfirmModal";

const PendingBookings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/business/bookings/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch pending bookings", err);
    }
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`http://localhost:8000/api/business/bookings/${selectedBookingId}/confirm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setSuccessMessage(data.message || "Booking confirmed successfully.");
        setBookings((prev) => prev.filter((b) => b.id !== selectedBookingId));
      } else {
        setSuccessMessage("Failed to confirm booking.");
      }
    } catch (err) {
      console.error("Confirmation failed:", err);
      setSuccessMessage("Something went wrong.");
    } finally {
      setShowModal(false);
      setSelectedBookingId(null);
    }
  };
  

  return (
<div className="dashboard-container">
  <h1>{t("pending_bookings")}</h1>
  {successMessage && (
  <p style={{ marginBottom: "1rem", color: "#0e9488", fontWeight: "500" }}>
    {successMessage}
  </p>
)}

  {bookings.length === 0 ? (
    <p>{t("no_pending_bookings")}</p>
  ) : (
    <div className="dashboard-cards">
      {bookings.map((b) => (
        <div key={b.id} className="card">
          <p>📍 <strong>{b.location?.name}</strong></p>
          <p>📅 {new Date(b.date).toLocaleDateString()}</p>
          <p>📦 {b.bag_count} {t("bags")}</p>

          <div className="contact-info">
            <p><strong>{t("name")}:</strong> {b.user?.name}</p>
            <p><strong>{t("email")}:</strong> {b.user?.email}</p>
            <p><strong>{t("phone")}:</strong> {b.user?.phone || t("no_phone")}</p>
          </div>

          <button className="btn" style={{ marginTop: "1rem" }} onClick={() => {
            setSelectedBookingId(b.id);
            setShowModal(true);
          }}>
            ✅ {t("confirm")}
          </button>
        </div>
      ))}
    </div>
  )}

  <ConfirmModal
    show={showModal}
    onClose={() => setShowModal(false)}
    onConfirm={handleConfirm}
    message={t("confirm_booking")}
  />
</div>

  );
};

export default PendingBookings;

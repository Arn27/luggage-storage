import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/BusinessPendingBooking.css";

const PendingBookings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  if (!roles.includes("business")) {
    navigate("/");
    return null;
  }

  const fetchPendingBookings = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/business/bookings/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          console.error("Invalid data:", data);
          setBookings([]);
        }
    } catch (err) {
      console.error("Failed to fetch pending bookings", err);
      setBookings([]);
    }
  };

  const handleStart = async (id) => {
    if (!photo) return alert("Please select a photo.");

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const res = await fetch(`http://localhost:8000/api/bookings/${id}/business-start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || "Booking started.");
        setBookings((prev) => prev.filter((b) => b.id !== id));
        setPhoto(null);
        setUploadingFor(null);
      } else {
        alert(data.message || "Failed to confirm booking.");
      }
    } catch (err) {
      console.error("Failed to confirm booking start:", err);
      alert("Something went wrong.");
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
              <p>🔒 {t("status")}: {t(b.status)}</p>
              {b.user_start_photo && <p>✅ {t("user_uploaded_photo")}</p>}

              <div className="contact-info">
                <p><strong>{t("name")}:</strong> {b.user?.name}</p>
                <p><strong>{t("email")}:</strong> {b.user?.email}</p>
                <p><strong>{t("phone")}:</strong> {b.user?.phone || t("no_phone")}</p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setPhoto(e.target.files[0]);
                  setUploadingFor(b.id);
                }}
              />

              <button
                className="btn"
                style={{ marginTop: "0.5rem" }}
                disabled={!photo || uploadingFor !== b.id}
                onClick={() => handleStart(b.id)}
              >
                ✅ {t("confirm_start")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingBookings;

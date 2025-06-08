import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css";
import "../styles/ActiveBookings.css";

const ActiveBookings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [photoMap, setPhotoMap] = useState({});
  const [messageMap, setMessageMap] = useState({});
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [durationMap, setDurationMap] = useState({});
  const [feeMap, setFeeMap] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    if (!roles.includes("business")) {
      navigate("/");
      return;
    }

    fetch("http://localhost:8000/api/business/bookings/active", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter(b =>
            ["active", "pending_end"].includes(b.status)
          );
          setBookings(filtered);
        }
      })
      .catch((err) => console.error("Failed to fetch active bookings", err));
  }, [navigate, token]);

  useEffect(() => {
    const updateAllFees = () => {
      const newDurations = {};
      const newFees = {};
      bookings.forEach((b) => {
        if (!b.started_at || !b.location?.hourly_rate) return;
        const startedAt = new Date(b.started_at);
        const now = new Date();
        const diffMs = now - startedAt;
        const diffMinutes = diffMs / 1000 / 60;
        const diffHours = diffMinutes / 60;
        const billedHours = Math.ceil(diffHours);
        const fee = (billedHours * b.location.hourly_rate).toFixed(2);
        const fullHours = Math.floor(diffHours);
        const minutes = Math.floor((diffHours - fullHours) * 60);
        newDurations[b.id] = `${fullHours}h ${minutes}min`;
        newFees[b.id] = fee;
      });
      setDurationMap(newDurations);
      setFeeMap(newFees);
    };

    updateAllFees();
    const interval = setInterval(updateAllFees, 60000);
    return () => clearInterval(interval);
  }, [bookings]);

  const handlePhotoChange = (bookingId, file) => {
    setPhotoMap((prev) => ({ ...prev, [bookingId]: file }));
  };

  const handleStopBooking = async (bookingId) => {
    const photo = photoMap[bookingId];
    if (!photo) {
      setMessageMap((prev) => ({ ...prev, [bookingId]: t("upload_required") }));
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const res = await fetch(
        `http://localhost:8000/api/business/bookings/${bookingId}/stop`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessageMap((prev) => ({
          ...prev,
          [bookingId]: data.message || t("request_submitted"),
        }));
        setExpandedBookingId(null);
        setPhotoMap((prev) => ({ ...prev, [bookingId]: null }));
      } else {
        setMessageMap((prev) => ({
          ...prev,
          [bookingId]: data.message || t("error"),
        }));
      }
    } catch (err) {
      console.error("Stop booking failed", err);
      setMessageMap((prev) => ({
        ...prev,
        [bookingId]: t("error"),
      }));
    }
  };

  return (
    <div className="dashboard-container">
      <h1>{t("active_bookings")}</h1>

      {bookings.length === 0 ? (
        <p>{t("no_active_booking")}</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <table className="booking-table">
              <tbody>
                <tr><th>{t("location")}</th><td>{booking.location?.name}</td></tr>
                <tr><th>{t("date")}</th><td>{new Date(booking.date).toLocaleDateString()}</td></tr>
                <tr><th>{t("bags")}</th><td>{booking.bag_count}</td></tr>
                <tr><th>{t("start")}</th><td>{new Date(booking.started_at).toLocaleString()}</td></tr>
                <tr><th>{t("status")}</th><td>{t(booking.status)}</td></tr>
                <tr><th>{t("user")}</th><td>{booking.user?.name}</td></tr>
                <tr><th>{t("email")}</th><td>{booking.user?.email}</td></tr>
                <tr><th>{t("phone")}</th><td>{booking.user?.phone || t("no_phone")}</td></tr>
                <tr><th>{t("duration")}</th><td>{durationMap[booking.id]}</td></tr>
                <tr><th>{t("estimated_fee")}</th><td>€{feeMap[booking.id]}</td></tr>
              </tbody>
            </table>

            <div className="photo-grid">
              {booking.user_start_photo && (
                <div>
                  <p>{t("user_photo")}:</p>
                  <img
                    src={`http://localhost:8000/storage/${booking.user_start_photo}`}
                    alt="User Luggage"
                  />
                </div>
              )}
              {booking.business_start_photo && (
                <div>
                  <p>{t("business_photo")}:</p>
                  <img
                    src={`http://localhost:8000/storage/${booking.business_start_photo}`}
                    alt="Business Luggage"
                  />
                </div>
              )}
            </div>

            <div className="booking-actions">
              {["active", "pending_end"].includes(booking.status) && expandedBookingId !== booking.id ? (
                <button className="stop-btn" onClick={() => setExpandedBookingId(booking.id)}>
                  {t("stop_booking")}
                </button>
              ) : ["active", "pending_end"].includes(booking.status) && expandedBookingId === booking.id ? (
                <div style={{ marginTop: "1rem" }}>
                  <p className="upload-instructions">{t("please_upload_luggage_photo_to_confirm")}</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoChange(booking.id, e.target.files[0])}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <button
                    className="stop-btn"
                    onClick={() => handleStopBooking(booking.id)}
                    disabled={!photoMap[booking.id]}
                  >
                    {t("confirm")}
                  </button>
                </div>
              ) : null}

              {messageMap[booking.id] && (
                <p style={{ marginTop: "0.75rem", fontWeight: "500" }}>
                  {messageMap[booking.id]}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActiveBookings;

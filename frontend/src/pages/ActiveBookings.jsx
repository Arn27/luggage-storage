import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import "./ActiveBookings.css";

const ActiveBookings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [duration, setDuration] = useState("0h 0min");
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
          setBooking(data[0] || null);
        }
      })
      .catch((err) => console.error("Failed to fetch active booking", err));
  }, [navigate, token]);

  useEffect(() => {
    if (!booking || !booking.started_at || !booking.location?.hourly_rate) return;

    const updateFee = () => {
      const startedAt = new Date(booking.started_at);
      const now = new Date();
      const diffMs = now - startedAt;
      const diffMinutes = diffMs / 1000 / 60;
      const diffHours = diffMinutes / 60;
      const billedHours = Math.ceil(diffHours);
      setEstimatedFee((billedHours * booking.location.hourly_rate).toFixed(2));

      const fullHours = Math.floor(diffHours);
      const minutes = Math.floor((diffHours - fullHours) * 60);
      setDuration(`${fullHours}h ${minutes}min`);
    };

    updateFee();
    const interval = setInterval(updateFee, 60000);
    return () => clearInterval(interval);
  }, [booking]);

  return (
    <div className="dashboard-container">
      <h1>{t("active_booking")}</h1>

      {!booking ? (
        <p>{t("no_active_booking")}</p>
      ) : (
        <div className="booking-card">
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
              <tr><th>{t("duration")}</th><td>{duration}</td></tr>
              <tr><th>{t("estimated_fee")}</th><td>€{estimatedFee}</td></tr>
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
            <button className="stop-btn">{t("stop_booking")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveBookings;

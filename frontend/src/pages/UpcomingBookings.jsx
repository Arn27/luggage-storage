// src/pages/UpcomingBookings.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./BusinessDashboard.css";

const UpcomingBookings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/api/business/bookings/upcoming", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch upcoming bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="dashboard-container">
    <h1>{t("upcoming_bookings")}</h1>
    {bookings.length === 0 ? (
        <p>{t("no_upcoming_bookings")}</p>
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
            </div>
        ))}
        </div>
    )}
    </div>

  );
};

export default UpcomingBookings;
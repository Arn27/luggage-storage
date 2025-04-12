// BusinessBookingsPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./BusinessDashboard.css";

const BusinessBookingsPage = () => {
  const { t } = useTranslation();
  const { type } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`http://localhost:8000/api/business/bookings/${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [type]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="dashboard-container">
      <h1>{t(`${type}_bookings`)}</h1>

      {loading ? (
        <p>{t("loading")}</p>
      ) : bookings.length === 0 ? (
        <p>{t("no_" + type + "_bookings")}</p>
      ) : (
        <div className="dashboard-cards">
          {bookings.map((b) => (
            <div key={b.id} className="card">
              <h3>{b.location?.name || "Location"}</h3>
              <p>📅 {t("date")}: {formatDate(b.date)}</p>
              <p>🧳 {t("bags")}: {b.bag_count}</p>
              <p>👤 {b.user?.name || t("anonymous")}</p>
              <p>📧 {b.user?.email}</p>
              <p>🔒 {t("status")}: {t(b.status)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessBookingsPage;

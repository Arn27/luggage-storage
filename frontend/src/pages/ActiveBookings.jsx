import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./UserDashboard.css";

const ActiveBookings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/business/bookings/active", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(setBookings)
      .catch((err) => console.error("Failed to fetch active bookings", err));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dashboard-container">
      <h1>{t("active_bookings")}</h1>

      {bookings.length === 0 ? (
        <p>{t("no_active_bookings")}</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="dashboard-section">
            <h2>{b.location?.name}</h2>
            <p><strong>{t("date")}:</strong> {new Date(b.date).toLocaleDateString()}</p>
            <p><strong>{t("bags")}:</strong> {b.bag_count}</p>
            <p><strong>{t("user")}:</strong> {b.user?.name} ({b.user?.email})</p>
            <p><strong>{t("status")}:</strong> {t(b.status)}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ActiveBookings;
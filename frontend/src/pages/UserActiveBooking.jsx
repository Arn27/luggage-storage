
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const UserActiveBooking = () => {
  const { t } = useTranslation();
  const [booking, setBooking] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/user/booking/active", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(setBooking)
      .catch((err) => console.error("Failed to fetch active booking", err));
  }, [token]);

  if (!booking) return <p>{t("loading")}</p>;

    let openHours = { from: "?", to: "?" };
    try {
      if (booking?.location?.open_hours) {
        openHours = typeof booking.location.open_hours === "string"
          ? JSON.parse(booking.location.open_hours)
          : booking.location.open_hours;
      }
    } catch (err) {
      console.error("Failed to parse open hours", err);
    }

  return (
    <div className="dashboard-container">
      <h1>{t("your_active_booking")}</h1>

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
            </tbody>
          </table>

          <table className="booking-table" style={{ marginTop: "2rem" }}>
            <tbody>
              <tr>
                <th>{t("address")}</th>
                <td>{booking.location?.address}, {booking.location?.city}</td>
              </tr>
              <tr>
                <th>{t("hourly_rate")}</th>
                <td>{Number(booking.location?.hourly_rate || 0).toFixed(2)} €</td>
              </tr>
              <tr>
                <th>{t("open_hours")}</th>
                <td>{openHours.from}-{openHours.to}</td>
              </tr>
              <tr>
                <th>{t("contact")}</th>
                <td>{booking.location?.phone || booking.location?.email || "N/A"}</td>
              </tr>
            </tbody>
          </table>

          <div className="photo-grid">
            {booking.user_start_photo && (
              <div>
                <p>{t("your_photo")}:</p>
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
            <button className="stop-btn">{t("request_end")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActiveBooking;

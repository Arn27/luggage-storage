import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./UserDashboard.css";

const UserBookingDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:8000/api/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setBooking)
      .catch(() => navigate("/user"));
  }, [id, token, navigate]);

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

  if (!booking) return <p>{t("loading")}</p>;

  return (
    <div className="dashboard-container">
      <h1>{t("booking_details")}</h1>

      <table className="booking-table">
        <tbody>
          <tr><th>{t("location")}</th><td>{booking.location?.name}</td></tr>
          <tr><th>{t("date")}</th><td>{new Date(booking.date).toLocaleDateString()}</td></tr>
          <tr><th>{t("bags")}</th><td>{booking.bag_count}</td></tr>
          <tr><th>{t("status")}</th><td>{t(booking.status)}</td></tr>
          <tr><th>{t("created_at")}</th><td>{new Date(booking.created_at).toLocaleString()}</td></tr>
          {booking.started_at && <tr><th>{t("start")}</th><td>{new Date(booking.started_at).toLocaleString()}</td></tr>}
          {booking.ended_at && <tr><th>{t("end")}</th><td>{new Date(booking.ended_at).toLocaleString()}</td></tr>}
          {booking.fee_to_pay !== null && (
            <tr><th>{t("fee_to_pay")}</th><td>€{Number(booking.fee_to_pay).toFixed(2)}</td></tr>
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: "2rem" }}>{t("location_info")}</h2>
      <table className="booking-table">
        <tbody>
          <tr><th>{t("address")}</th><td>{booking.location?.address}, {booking.location?.city}</td></tr>
          <tr><th>{t("hourly_rate")}</th><td>{Number(booking.location?.hourly_rate || 0).toFixed(2)} €</td></tr>
          <tr><th>{t("open_hours")}</th><td>{openHours.from} - {openHours.to}</td></tr>
          <tr><th>{t("contact")}</th><td>{booking.location?.phone || booking.location?.email || "N/A"}</td></tr>
        </tbody>
      </table>

      <h2 style={{ marginTop: "2rem" }}>{t("photos")}</h2>
      <div className="photo-grid">
        {booking.user_start_photo && (
          <div>
            <p>{t("user_start_photo")}</p>
            <img src={`http://localhost:8000/storage/${booking.user_start_photo}`} alt="User Start" />
          </div>
        )}
        {booking.business_start_photo && (
          <div>
            <p>{t("business_start_photo")}</p>
            <img src={`http://localhost:8000/storage/${booking.business_start_photo}`} alt="Business Start" />
          </div>
        )}
        {booking.user_end_photo && (
          <div>
            <p>{t("user_end_photo")}</p>
            <img src={`http://localhost:8000/storage/${booking.user_end_photo}`} alt="User End" />
          </div>
        )}
        {booking.business_end_photo && (
          <div>
            <p>{t("business_end_photo")}</p>
            <img src={`http://localhost:8000/storage/${booking.business_end_photo}`} alt="Business End" />
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to={`/location/${booking.location?.id}`} className="btn">
          {t("view_location")}
        </Link>
      </div>
    </div>
  );
};

export default UserBookingDetails;

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  
    if (!storedUser || !roles.includes("traveller")) {
      navigate("/login");
      return;
    }
  
    const userData = JSON.parse(storedUser);
    setUser(userData);
  
    const token = localStorage.getItem("token");
  
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
  
        const data = await res.json();
  
        const active = data.find((b) =>
          ["active", "pending_end"].includes(b.status)
        );        
        setActiveBooking(active || null);
  
        const upcoming = data.filter((b) =>
          ["confirmed", "pending_start", "user_started"].includes(b.status)
        );
  
        const past = data.filter((b) =>
          ["completed", "cancelled", "declined"].includes(b.status)
        );
  
        setUpcomingBookings(upcoming);
        setPastBookings(past);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
  
      const msg = localStorage.getItem("bookingClosedMessage");
      if (msg) {
        setConfirmationMessage(msg);
        localStorage.removeItem("bookingClosedMessage");
      }
    };
  
    fetchBookings();
  }, [navigate]);
  

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <h1>{t("dashboard")}</h1>
          {confirmationMessage && (
              <div className="confirmation-message">{confirmationMessage}</div>
            )}

      {activeBooking && (
        <section className="dashboard-section active-booking-box">
          <h2>{t("active_booking")}</h2>
          <table className="booking-table">
            <tbody>
              <tr>
                <th>{t("location")}</th>
                <td>{activeBooking.location?.name}</td>
              </tr>
              <tr>
                <th>{t("date")}</th>
                <td>{new Date(activeBooking.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>{t("bags")}</th>
                <td>{activeBooking.bag_count}</td>
              </tr>
              <tr>
                <th>{t("status")}</th>
                <td>{t(activeBooking.status)}</td>
              </tr>
            </tbody>
          </table>
          <Link to="/user/booking/active" className="btn small-btn" style={{ marginTop: "1rem" }}>
            {t("view_active_booking")}
          </Link>
        </section>
      )}

      <section className="dashboard-section">
        <h2>{t("account_info")}</h2>
        <p><strong>{t("name")}</strong>: {user.name}</p>
        <p><strong>{t("email")}</strong>: {user.email}</p>
        <p><strong>{t("registered")}</strong>: {new Date(user.created_at).toLocaleDateString()}</p>
      </section>

      <section className="dashboard-section">
        <h2>{t("actions")}</h2>
        <Link to="/user/change-password" className="btn">
          {t("change_password")}
        </Link>
      </section>

      <section className="dashboard-section">
        <h2>{t("upcoming_bookings")}</h2>
        {upcomingBookings.length === 0 ? (
          <p>{t("no_upcoming_bookings")}</p>
        ) : (
          upcomingBookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <p>
                📍 <Link to={`/user/bookings/${booking.id}`} className="link">
                  {booking.location?.name}
                </Link> — {new Date(booking.date).toLocaleDateString()}
              </p>
              <button
                className="btn small-btn"
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    const res = await fetch(`http://localhost:8000/api/bookings/${booking.id}/cancel`, {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                      },
                    });
                    if (res.ok) {
                      alert(t("booking_cancelled"));
                    } else {
                      const data = await res.json();
                      alert(data.message || "Error cancelling booking.");
                    }
                  } catch (err) {
                    console.error("Cancel failed", err);
                    alert("Something went wrong.");
                  }
                }}
              >
                {t("cancel")}
              </button>
            </div>
          ))
        )}
      </section>

      <section className="dashboard-section">
        <h2>{t("past_bookings")}</h2>
        {pastBookings.length === 0 ? (
          <p>{t("no_past_bookings")}</p>
        ) : (
          pastBookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <p>
                📍 <Link to={`/user/bookings/${booking.id}`} className="link">
                  {booking.location?.name}
                </Link> — {new Date(booking.date).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </section>

    </div>
  );
};

export default UserDashboard;

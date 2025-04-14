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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
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
          const now = new Date();

          const upcoming = data.filter((b) => new Date(b.date) >= now);
          const past = data.filter((b) => new Date(b.date) < now);

          setUpcomingBookings(upcoming);
          setPastBookings(past);
        } catch (err) {
          console.error("Failed to load bookings", err);
        }
      };

      fetchBookings();
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <h1>{t("dashboard")}</h1>

      <section className="dashboard-section">
        <h2>{t("account_info")}</h2>
        <p><strong>{t("name")}</strong>: {user.name}</p>
        <p><strong>{t("email")}</strong>: {user.email}</p>
        <p><strong>{t("registered")}</strong>: {new Date(user.created_at).toLocaleDateString()}</p>
      </section>

      <section className="dashboard-section">
        <h2>{t("actions")}</h2>
        <button className="btn">{t("change_password")}</button>
        <Link to="/user/booking/active" className="btn" style={{ marginLeft: "1rem" }}>
          {t("active_booking")}
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
                📍 <a href={`/location/${booking.location.id}`} className="link">
                  {booking.location?.name}
                </a> — {new Date(booking.date).toLocaleDateString()}
              </p>
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
                📍 <a href={`/location/${booking.location.id}`} className="link">
                  {booking.location?.name}
                </a> — {new Date(booking.date).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default UserDashboard;

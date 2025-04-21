import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./BusinessDashboard.css";

const BusinessDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    locations: 0,
    upcomingBookings: 0,
    pastBookings: 0,
    pendingBookings: 0,
    activeBookings: 0,
  });

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    if (!roles.includes("business")) {
      navigate("/");
    }

    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:8000/api/dashboard/business", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Server error:", res.status, text);
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1>{t("business_dashboard")}</h1>
      <div className="dashboard-cards">
        <Link to="/business/locations" className="card">
          <h2>{stats.locations}</h2>
          <p>{t("locations")}</p>
        </Link>
        <Link to="/business/bookings/upcoming" className="card">
          <h2>{stats.upcomingBookings}</h2>
          <p>{t("upcoming_bookings")}</p>
        </Link>
        <Link to="/business/bookings/past" className="card">
          <h2>{stats.pastBookings}</h2>
          <p>{t("past_bookings")}</p>
        </Link>
        <Link to="/business/bookings/pending" className="card">
          <h2>{stats.pendingBookings}</h2>
          <p>{t("pending_bookings")}</p>
        </Link>
        <Link to="/business/bookings/active" className="card">
          <h2>{stats.activeBookings}</h2>
          <p>{t("active_bookings")}</p>
        </Link>
      </div>
    </div>
  );
};

export default BusinessDashboard;

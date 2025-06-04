import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserActiveBooking = () => {
  const { t } = useTranslation();
  const [booking, setBooking] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchBooking = () => {
    fetch("http://localhost:8000/api/user/booking/active", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(setBooking)
      .catch((err) => console.error("Failed to fetch active booking", err));
  };

  useEffect(() => {
    const fetchAndCheckBooking = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user/booking/active", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();

        if (!data || !["active", "pending_end"].includes(data.status)) {
          localStorage.setItem("bookingClosedMessage", t("booking_completed"));
          navigate("/user");
        } else {
          setBooking(data);
        }
      } catch (err) {
        console.error("Failed to fetch active booking", err);
      }
    };

    fetchAndCheckBooking();
  }, [token, navigate, t]);

  const handleStop = async () => {
    if (!(photo instanceof File)) {
      setMessage(t("upload_required"));
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const res = await fetch(`http://localhost:8000/api/bookings/${booking.id}/stop`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || t("request_submitted"));
        setUploadMode(false);
        setPhoto(null);
        fetchBooking();
      } else {
        setMessage(data.message || t("error"));
      }
    } catch (err) {
      console.error("Stop request failed", err);
      setMessage(t("error"));
    }
  };

  if (!booking) return <p>{t("loading")}</p>;

  if (booking.status === "completed") {
    return (
      <div className="dashboard-container">
        <h1>{t("your_active_booking")}</h1>
        <p style={{ marginTop: "1rem" }}>{t("booking_completed")}</p>
        <p>
          <a href="/user/dashboard" className="btn small-btn" style={{ marginTop: "1rem" }}>
            {t("back_to_dashboard")}
          </a>
        </p>
      </div>
    );
  }

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
            <tr><th>{t("address")}</th><td>{booking.location?.address}, {booking.location?.city}</td></tr>
            <tr><th>{t("hourly_rate")}</th><td>{Number(booking.location?.hourly_rate || 0).toFixed(2)} €</td></tr>
            <tr><th>{t("open_hours")}</th><td>{openHours.from}-{openHours.to}</td></tr>
            <tr><th>{t("contact")}</th><td>{booking.location?.phone || booking.location?.email || "N/A"}</td></tr>
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
          {booking.status === "pending_end" && booking.user_end_photo ? (
            <p style={{ marginTop: "1rem", fontWeight: "500" }}>
              {t("waiting_for_business_to_confirm")}
            </p>
          ) : uploadMode ? (
            <>
              <p className="upload-instructions">
                {t("please_upload_luggage_photo_to_confirm")}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                style={{ marginBottom: "0.5rem" }}
              />
              <button className="stop-btn" onClick={handleStop}>
                {t("confirm")}
              </button>
            </>
          ) : (
            <button className="stop-btn" onClick={() => setUploadMode(true)}>
              {t("request_end")}
            </button>
          )}
          {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserActiveBooking;

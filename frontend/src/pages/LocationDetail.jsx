import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LocationDetail.css";

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [location, setLocation] = useState(null);
  const [date, setDate] = useState("");
  const [bags, setBags] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/locations/${id}`);
        const data = await res.json();
        setLocation(data);
      } catch (err) {
        console.error("Failed to fetch location:", err);
      }
    };

    fetchLocation();
  }, [id]);

  const handleBooking = async () => {
    setBookingMessage("");
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        location_id: id,
        date,
        bag_count: bags,
      }),
    });

    if (res.ok) {
      setBookingMessage(t("booking_success"));
    } else {
      const data = await res.json();
      setBookingMessage(data?.message || t("booking_error"));
    }
  };

  if (!location) return <p>{t("loading")}</p>;

  return (
    <div className="location-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← {t("back")}
      </button>

      <img
        src={location.image_url || "https://fakeimg.pl/600x400"}
        alt={location.name}
        className="location-image"
      />

      <div className="location-content">
        <div className="location-info">
          <h1>{location.name}</h1>
          <p>📍 {location.address}, {location.city}</p>
          <p>🫳 {t("max_bags")}: {location.max_bags}</p>
          <p>⏰ {t("open_hours")}: {location.open_hours.from}–{location.open_hours.to}</p>
          <p>📝 {t("description")}: {location.description}</p>
        </div>

        <div className="booking-form">
          <h2>{t("book_now")}</h2>

          {isLoggedIn ? (
            <>
              <div className="form-row">
                <label>
                  {t("date")}
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>

                <label>
                  {t("bags")}
                  <input
                    type="number"
                    min="1"
                    value={bags}
                    onChange={(e) => setBags(e.target.value)}
                  />
                </label>
              </div>

              <button className="book-button" onClick={handleBooking}>
                {t("confirm_booking")}
              </button>

              {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
            </>
          ) : (
            <div className="guest-message">
              <p>{t("login_to_book")}</p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Link to="/login" className="auth-btn">{t("login")}</Link>
                <Link to="/register" className="auth-btn">{t("register")}</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2>{t("reviews")}</h2>

        {location.reviews?.length === 0 ? (
          <p>{t("no_reviews")}</p>
        ) : (
          location.reviews?.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <strong>{review.user?.name || t("anonymous")}</strong>
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="review-rating">
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </div>

              {review.comment && (
                <p className="review-comment">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LocationDetail;

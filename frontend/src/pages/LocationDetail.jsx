// LocationDetail.jsx (updated with confirm modal for review deletion)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../components/admin/ConfirmModal";

import "./LocationDetail.css";

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [location, setLocation] = useState(null);
  const [date, setDate] = useState("");
  const [bags, setBags] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");
  const [userBooking, setUserBooking] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const localUserId = storedUser?.id;
  const isAdmin = storedUser?.is_admin;

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

    const fetchUserBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/user/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const found = data.find((b) => b.location_id === parseInt(id));
        setUserBooking(found || null);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchLocation();
    if (isLoggedIn) fetchUserBookings();
  }, [id, isLoggedIn]);

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

  const handleCancel = async () => {
    if (!userBooking) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:8000/api/bookings/${userBooking.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setUserBooking(null);
      alert(t("booking_cancelled"));
    }
  };

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        location_id: id,
        rating,
        comment: reviewText,
      }),
    });

    if (res.ok) {
      setReviewSuccess(t("review_submitted"));
      setReviewText("");
      setRating(5);

      try {
        const updated = await fetch(`http://127.0.0.1:8000/api/locations/${id}`);
        const data = await updated.json();
        setLocation(data);
      } catch (err) {
        console.error("Failed to refresh location after review:", err);
      }
    }
  };

  const handleDeleteReview = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reviews/${reviewToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      alert(data.message);
  
      const updated = await fetch(`http://127.0.0.1:8000/api/locations/${id}`);
      const dataRefreshed = await updated.json();
      setLocation(dataRefreshed);
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Something went wrong.");
    } finally {
      setShowDeleteConfirm(false);
      setReviewToDelete(null);
    }
  };
  

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
    setShowDeleteConfirm(true);
  };

  if (!location) return <p>{t("loading")}</p>;

  const canReview = userBooking && new Date(userBooking.date) <= new Date();

  return (
    <div className="location-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← {t("back")}
      </button>

      <img
        src={location.image_url || "/location.png"}
        alt={location.name}
        className="location-image"
      />

      <div className="location-content">
        <div className="location-info">
          <h1>{location.name}</h1>
          <p>📍 {location.address}, {location.city}</p>
          <p>🧳 {t("max_bags")}: {location.max_bags}</p>
          <p>
            💰 {t("hourly_rate")}: 
            {Number(location.hourly_rate) > 0
              ? Number(location.hourly_rate).toFixed(2)
              : "0.00"} €
          </p>
          <p>⏰ {t("open_hours")}: {location.open_hours.from}-{location.open_hours.to}</p>
          <p>📝 {t("description")}: {location.description}</p>
          <p>📞 {t("contact")}: {location.phone || location.email || "N/A"}</p>
        </div>

        <div className="booking-form">
          {userBooking ? (
            <div className="user-booking-box">
              <h2>{t("your_booking")}</h2>
              <p>🗓️ {t("date")}: {new Date(userBooking.date).toLocaleDateString()}</p>
              <p>🧳 {t("bags")}: {userBooking.bag_count}</p>
              <p>🔒 {t("status")}: {t(userBooking.status)}</p>
              <button className="cancel-btn" onClick={handleCancel}>{t("cancel_booking")}</button>
            </div>
          ) : isLoggedIn ? (
            <>
              <h2>{t("book_now")}</h2>
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

          {canReview && (
            <div className="review-form">
              <h3>{t("leave_review")}</h3>
              <label>
                {t("rating")}: <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t("write_review")}
              ></textarea>
              <button onClick={handleReviewSubmit}>{t("submit_review")}</button>
              {reviewSuccess && <p>{reviewSuccess}</p>}
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
                <div>
                  <strong>{review.user?.name || t("anonymous")}</strong>
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {(review.user?.id === localUserId || isAdmin) && (
                  <button
                    className="delete-review"
                    onClick={() => handleDeleteClick(review.id)}
                  >
                    ❌
                  </button>
                )}
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

      <ConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteReview}
        message={t("confirm_delete_review") || "Are you sure you want to delete this review?"}
      />
    </div>
  );
};

export default LocationDetail;
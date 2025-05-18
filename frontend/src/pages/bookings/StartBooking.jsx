import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StartBooking = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:8000/api/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(setBooking)
      .catch(() => setMessage(t("loadFail")));
  }, [id, token, t]);

  const handleUpload = async () => {
    if (!photo) return setMessage(t("noPhoto"));

    const formData = new FormData();
    formData.append("photo", photo);

    const res = await fetch(`http://localhost:8000/api/bookings/${id}/user-start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(t("successStart"));
      setTimeout(() => navigate("/user/booking/active"), 1500);
    } else {
      setMessage(data?.message || t("errorGeneric"));
    }
  };

  if (!booking) return <p>{t("loading")}</p>;

  const showUpload = booking.status === "pending_start" || booking.status === "business_started";
  const businessUploaded = !!booking.business_start_photo;

  return (
    <div className="dashboard-container">
      <h1>{t("title")}</h1>
      <p>📍 {t("location")}: {booking.location?.name}</p>
      <p>📅 {t("date")}: {new Date(booking.date).toLocaleString()}</p>
      <p>🧳 {t("bags")}: {booking.bag_count}</p>
      <p>🔒 {t("status")}: {booking.status}</p>

      {businessUploaded && (
        <p style={{ color: "green" }}>{t("businessUploaded")}</p>
      )}

      {!showUpload ? (
        <p style={{ color: "red" }}>{t("cannotStart")}</p>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <button className="btn" onClick={handleUpload}>
            {t("uploadButton")}
          </button>
        </>
      )}

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default StartBooking;

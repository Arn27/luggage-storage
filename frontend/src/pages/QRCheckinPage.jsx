import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./QRCheckin.css";

const QRCheckinPage = () => {
  const { qr_token } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [bags, setBags] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!token) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!photo) {
      setError(t("upload_required"));
      return;
    }

    const formData = new FormData();
    formData.append("bag_count", bags);
    formData.append("photo", photo);

    try {
      const res = await fetch(`http://localhost:8000/api/qr-checkin/${qr_token}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(t("booking_success"));
        setTimeout(() => navigate("/user/booking/active"), 2000);
      } else {
        setError(data.message || t("error"));
      }
    } catch (err) {
      console.error("QR check-in error", err);
      setError(t("error"));
    }
  };

  return (
    <div className="qr-checkin-container">
      <h2>{t("qr_checkin_title")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="qr-form-group">
          <label>{t("bags")}</label>
          <input
            type="number"
            min="1"
            value={bags}
            onChange={(e) => setBags(e.target.value)}
            required
          />
        </div>

        <div className="qr-form-group">
          <label>{t("upload_luggage_photo")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="qr-submit-btn">
          {t("checkin_now")}
        </button>

        {message && <p className="qr-message success">{message}</p>}
        {error && <p className="qr-message error">{error}</p>}
      </form>
    </div>
  );
};

export default QRCheckinPage;

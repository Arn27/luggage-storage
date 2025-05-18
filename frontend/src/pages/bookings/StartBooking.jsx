import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StartBooking = () => {
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
      .catch(() => setMessage("Failed to load booking."));
  }, [id, token]);

  const handleUpload = async () => {
    if (!photo) return setMessage("Please upload a photo.");

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
      setMessage("✅ Booking started! Waiting for business to confirm.");
      setTimeout(() => navigate("/user/booking/active"), 1500);
    } else {
      setMessage(data?.message || "Something went wrong.");
    }
  };

  if (!booking) return <p>Loading...</p>;

  const showUpload = booking.status === "pending_start" || booking.status === "business_started";
  const businessUploaded = !!booking.business_start_photo;

  return (
    <div className="dashboard-container">
      <h1>Start Booking</h1>
      <p>📍 Location: {booking.location?.name}</p>
      <p>📅 Date: {new Date(booking.date).toLocaleString()}</p>
      <p>🧳 Bags: {booking.bag_count}</p>
      <p>🔒 Status: {booking.status}</p>

      {businessUploaded && (
        <p style={{ color: "green" }}>✅ Business has uploaded a photo.</p>
      )}

      {!showUpload ? (
        <p style={{ color: "red" }}>
          You can't start this booking at the moment.
        </p>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <button className="btn" onClick={handleUpload}>
            Upload Bag Photo & Confirm
          </button>
        </>
      )}

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default StartBooking;

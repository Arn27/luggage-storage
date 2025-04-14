// src/pages/UserActiveBooking.jsx
import { useEffect, useState } from "react";

const UserActiveBooking = () => {
  const [booking, setBooking] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/user/bookings/active", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setBooking)
      .catch((err) => console.error("Failed to fetch active user booking", err));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnd = async () => {
    // Send photo + status update to server
    alert("Booking end initiated");
  };

  if (!booking) return <p>No active bookings</p>;

  return (
    <div className="dashboard-container">
      <h1>Your Active Booking</h1>
      <p>Location: {booking.location?.name}</p>
      <p>Bags: {booking.bag_count}</p>
      <p>Start: {new Date(booking.started_at).toLocaleString()}</p>
      <button className="btn" onClick={handleEnd}>End Booking</button>
    </div>
  );
};

export default UserActiveBooking;

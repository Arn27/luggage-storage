// src/pages/WalkInBookingPage.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const WalkInBookingPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [bags, setBags] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/locations/${id}`)
      .then((res) => res.json())
      .then(setLocation);
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location_id: id, bag_count: bags, date: new Date() }),
    });

    const data = await res.json();
    if (res.ok) setMessage("Booking successful!");
    else setMessage(data?.message || "Error");
  };

  return (
    <div className="dashboard-container">
      <h1>Walk-in Booking</h1>
      <p>Location: {location?.name}</p>
      <input
        type="number"
        value={bags}
        min="1"
        onChange={(e) => setBags(e.target.value)}
      />
      <button className="btn" onClick={handleSubmit}>Book Now</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default WalkInBookingPage;
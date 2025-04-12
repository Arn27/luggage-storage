// components/admin/AdminLocations.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "./ConfirmModal";

const AdminLocations = () => {
  const { t } = useTranslation();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchLocations = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/locations", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  const deleteLocation = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/locations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      alert(data.message);
      fetchLocations();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="business-list">
      {locations.length === 0 ? (
        <p>{t("no_locations")}</p>
      ) : (
        locations.map((loc) => (
          <div key={loc.id} className="business-card">
            <h3>{loc.address}</h3>
            <p>📍 {loc.city || "N/A"}</p>
            <p>🏷️ {loc.business?.business_name || "-"}</p>
            <button className="btn" onClick={() => {
              setSelectedLocation(loc);
              setShowModal(true);
            }}>
              🗑️ {t("delete")}
            </button>
          </div>
        ))
      )}

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          if (selectedLocation) deleteLocation(selectedLocation.id);
          setShowModal(false);
        }}
        message={t("confirm_delete_location")}
      />
    </div>
  );
};

export default AdminLocations;

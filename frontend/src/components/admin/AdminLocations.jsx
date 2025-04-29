import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

const AdminLocations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("confirm");
  const [modalMessage, setModalMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchLocations = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/locations", {
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
      const res = await fetch(`http://localhost:8000/api/admin/locations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setModalType("success");
      setModalMessage(data.message);
      setShowModal(true);
      fetchLocations();
    } catch (err) {
      console.error("Delete failed:", err);
      setModalType("error");
      setModalMessage(t("something_went_wrong"));
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    if (selectedLocation) deleteLocation(selectedLocation.id);
    setSelectedLocation(null);
  };

  return (
    <div className="business-list">
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button className="btn" onClick={() => navigate("/admin/locations/new")}>➕ {t("add_location")}</button>
      </div>

      {locations.length === 0 ? (
        <p>{t("no_locations")}</p>
      ) : (
        locations.map((loc) => (
          <div key={loc.id} className="business-card">
            <h3>{loc.address}</h3>
            <p>📍 {loc.city || "N/A"}</p>
            <p>🏷️ {loc.business?.business_name || "-"}</p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem" }}>
              <button className="btn" onClick={() => navigate(`/admin/locations/${loc.id}/edit`)}>✏️ {t("edit")}</button>
              <button
                className="btn"
                onClick={() => {
                  setSelectedLocation(loc);
                  setModalType("confirm");
                  setModalMessage(t("confirm_delete_location"));
                  setShowModal(true);
                }}
              >
                🗑️ {t("delete")}
              </button>
            </div>
          </div>
        ))
      )}

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default AdminLocations;

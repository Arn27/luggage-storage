// Updated AdminLocationForm.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Autocomplete } from "@react-google-maps/api";
import ConfirmModal from "./ConfirmModal"; // Added
import "../../pages/Auth.css"; // reuse styling

const AdminLocationForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    description: "",
    lat: "",
    lng: "",
    max_bags: 1,
    hourly_rate: "",
    open_hours: { from: "", to: "" },
    business_id: "",
  });

  const [errors, setErrors] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const addressRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/admin/businesses", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(setBusinesses)
      .catch(console.error);
  }, []);

  const onLoad = (auto) => setAutocomplete(auto);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      const city = place.address_components?.find((c) =>
        c.types.includes("locality")
      )?.long_name;

      setForm((prev) => ({
        ...prev,
        address: place.formatted_address,
        lat: lat || "",
        lng: lng || "",
        city: city || prev.city,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("open_hours.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        open_hours: { ...prev.open_hours, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/api/admin/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || { general: [data.message] });
        setModalType("error");
        setModalMessage(data.message || t("something_went_wrong"));
        setShowModal(true);
        return;
      }

      setModalType("success");
      setModalMessage(t("location_created"));
      setShowModal(true);
    } catch (err) {
      console.error("Submission failed", err);
      setModalType("error");
      setModalMessage(t("something_went_wrong"));
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/admin");
    }
  };

  return (
    <div className="auth-container">
      <h1>{t("add_location")}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            {t("business")}
            <select name="business_id" value={form.business_id} onChange={handleChange} required>
              <option value="">{t("select_business")}</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.business_name}
                </option>
              ))}
            </select>
            {errors.business_id && <p className="error">{errors.business_id[0]}</p>}
          </label>

          <label>
            {t("name")}
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            {t("city")}
            <input name="city" value={form.city} onChange={handleChange} required />
          </label>

          <label>
            {t("address")}
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                name="address"
                ref={addressRef}
                value={form.address}
                onChange={handleChange}
                required
              />
            </Autocomplete>
          </label>

          <label>
            {t("max_bags")}
            <input
              name="max_bags"
              type="number"
              value={form.max_bags}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {t("hourly_rate")}
            <input
              name="hourly_rate"
              type="number"
              step="0.01"
              value={form.hourly_rate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {t("latitude")}
            <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} />
          </label>

          <label>
            {t("longitude")}
            <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} />
          </label>

          <label className="grid-full">
            {t("description")}
            <input name="description" value={form.description} onChange={handleChange} />
          </label>

          <label className="grid-full">
            {t("open_hours")}
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                name="open_hours.from"
                value={form.open_hours.from}
                onChange={handleChange}
                placeholder={t("from")}
              />
              <input
                name="open_hours.to"
                value={form.open_hours.to}
                onChange={handleChange}
                placeholder={t("to")}
              />
            </div>
          </label>
        </div>

        {errors.general && <p className="error">{errors.general[0]}</p>}

        <button type="submit" className="auth-btn">
          {t("create_location")}
        </button>
      </form>

      <ConfirmModal
        show={showModal}
        onClose={handleModalClose}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default AdminLocationForm;

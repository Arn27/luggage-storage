import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Autocomplete } from "@react-google-maps/api";
import "../styles/Auth.css";

const NewLocationForm = () => {
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
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [images, setImages] = useState([]);
  const addressRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("new_location_draft");
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("new_location_draft", JSON.stringify(form));
  }, [form]);

  const onLoad = (auto) => setAutocomplete(auto);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
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

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ ...form, open_hours: JSON.stringify(form.open_hours) }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", res.status, text);
        try {
          const data = JSON.parse(text);
          setErrors(data.errors || {});
        } catch {
          setErrors({ general: [text] });
        }
        setSubmitting(false);
        return;
      }

      const location = await res.json();

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("images[]", file));

        try {
          const imageRes = await fetch(`http://localhost:8000/api/locations/${location.id}/images`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!imageRes.ok) {
            const errorText = await imageRes.text();
            console.error("Image upload failed with status", imageRes.status, errorText);
            setSubmitting(false);
            return;
          }
        } catch (uploadErr) {
          console.error("Upload threw error", uploadErr);
          setSubmitting(false);
          return;
        }
      }


      localStorage.removeItem("new_location_draft");
      navigate("/business/locations");
    } catch (err) {
      console.error("Submission failed", err);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>{t("add_location")}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            {t("name")}
            <input name="name" value={form.name} onChange={handleChange} required />
            {errors.name && <p className="error">{errors.name[0]}</p>}
          </label>

          <label>
            {t("city")}
            <input name="city" value={form.city} onChange={handleChange} required />
            {errors.city && <p className="error">{errors.city[0]}</p>}
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
            {errors.address && <p className="error">{errors.address[0]}</p>}
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
            {errors.max_bags && <p className="error">{errors.max_bags[0]}</p>}
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
            {errors.hourly_rate && <p className="error">{errors.hourly_rate[0]}</p>}
          </label>

          <label>
            {t("latitude")}
            <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} />
            {errors.lat && <p className="error">{errors.lat[0]}</p>}
          </label>

          <label>
            {t("longitude")}
            <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} />
            {errors.lng && <p className="error">{errors.lng[0]}</p>}
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
                placeholder={t("from") + " (08:00)"}
              />
              <input
                name="open_hours.to"
                value={form.open_hours.to}
                onChange={handleChange}
                placeholder={t("to") + " (20:00)"}
              />
            </div>
          </label>

          <label className="grid-full">
            {t("upload_location_photos")}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </label>
        </div>

        {errors.general && <p className="error">{errors.general[0]}</p>}

        <button type="submit" className="auth-btn" disabled={submitting}>
          {submitting ? t("loading") : t("create_location")}
        </button>
      </form>
    </div>
  );
};

export default NewLocationForm;

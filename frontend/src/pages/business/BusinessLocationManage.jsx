import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Auth.css";

const BusinessLocationManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/api/locations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error("Failed to fetch location", err));
  }, [id]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/api/locations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert(t("location_updated"));
    } else {
      const data = await res.json();
      setErrors(data.errors || {});
    }

    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm(t("confirm_delete_location"))) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/api/locations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      navigate("/business/locations");
    } else {
      alert(t("delete_failed"));
    }
  };

  if (!form) return <p>{t("loading")}</p>;

  return (
    <div className="auth-container">
      <h1>{t("edit_location")}</h1>
      <form className="auth-form" onSubmit={handleUpdate}>
        <div className="form-grid">
          <label>
            {t("name")}
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name[0]}</p>}
          </label>

          <label>
            {t("city")}
            <input name="city" value={form.city} onChange={handleChange} />
          </label>

          <label>
            {t("address")}
            <input name="address" value={form.address} onChange={handleChange} />
          </label>

          <label>
            {t("max_bags")}
            <input name="max_bags" type="number" value={form.max_bags} onChange={handleChange} />
          </label>

          <label>
            {t("hourly_rate")}
            <input name="hourly_rate" type="number" step="0.01" value={form.hourly_rate} onChange={handleChange} />
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
        </div>

        <button type="submit" className="auth-btn" disabled={submitting}>
          {submitting ? t("saving") : t("save_changes")}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="auth-btn danger-btn"
          style={{ marginTop: "1rem", backgroundColor: "#e11d48" }}
        >
          {t("delete_location")}
        </button>
      </form>
    </div>
  );
};

export default BusinessLocationManage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../components/admin/ConfirmModal";
import "../styles/Auth.css";

const BusinessLocationManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [modal, setModal] = useState({ show: false, message: "", type: "info" });
  const [previewImage, setPreviewImage] = useState(null);

  const token = localStorage.getItem("token");

  const fetchLocation = async () => {
    const res = await fetch(`http://localhost:8000/api/locations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setForm(data);
    setImages(data.images || []);
  };

  useEffect(() => {
    fetchLocation();
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [id]);

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

    const res = await fetch(`http://localhost:8000/api/locations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setModal({ show: true, message: t("location_updated"), type: "info" });
    } else {
      const data = await res.json();
      setErrors(data.errors || {});
    }

    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm(t("confirm_delete_location"))) return;

    const res = await fetch(`http://localhost:8000/api/locations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      navigate("/business/locations");
    } else {
      setModal({ show: true, message: t("delete_failed"), type: "error" });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file));

    const res = await fetch(`http://localhost:8000/api/locations/${id}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      setModal({ show: true, message: t("upload_success"), type: "info" });
      fetchLocation();
    } else {
      const data = await res.json();
      setModal({ show: true, message: data.message || t("upload_failed"), type: "error" });
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!confirm(t("confirm_delete_image"))) return;

    const res = await fetch(`http://localhost:8000/api/locations/images/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setModal({ show: true, message: t("image_deleted"), type: "info" });
      fetchLocation();
    } else {
      setModal({ show: true, message: t("delete_failed"), type: "error" });
    }
  };

  if (!form) return <p>{t("loading")}</p>;

  return (
    <div className="auth-container">
      <h1>{t("edit_location")}</h1>
      <ConfirmModal
        show={modal.show}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, show: false })}
      />

      {previewImage && (
        <div className="fullscreen-overlay" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="preview" className="fullscreen-image" />
          <button className="close-btn" onClick={() => setPreviewImage(null)}>✕</button>
        </div>
      )}

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

          <label className="grid-full">
            <h3>{t("upload_location_photos")}</h3>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div className="image-preview" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
              {images.map((img) => (
                <div key={img.id} style={{ position: "relative" }}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewImage(`http://localhost:8000/storage/${img.path}`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setPreviewImage(`http://localhost:8000/storage/${img.path}`);
                      }
                    }}
                    style={{ cursor: "zoom-in" }}
                  >
                    <img
                      src={`http://localhost:8000/storage/${img.path}`}
                      alt="location"
                      draggable={false}
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageDelete(img.id)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "#e11d48",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      padding: "2px 5px"
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
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

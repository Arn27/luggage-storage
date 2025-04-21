import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../pages/NewLocationForm.css";

const AdminLocationEdit = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: "",
    city: "",
    max_bags: 1,
    hourly_rate: 0,
    description: "",
    open_hours: { from: "09:00", to: "18:00" },
    phone: "",
    email: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/locations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("Failed to fetch location:", err);
      }
    };
    fetchLocation();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("open_hours.")) {
      const key = name.split(".")[1];
      setForm({ ...form, open_hours: { ...form.open_hours, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/admin/locations/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.message || t("location_updated"));
      navigate("/admin");
    } catch (err) {
      console.error("Update failed:", err);
      alert(t("update_failed"));
    }
  };

  return (
    <div className="new-location-form">
      <h1>{t("edit_location")}</h1>
      <form onSubmit={handleSubmit}>
        <input name="address" placeholder={t("address")} value={form.address} onChange={handleChange} required />
        <input name="city" placeholder={t("city")} value={form.city} onChange={handleChange} required />
        <input name="max_bags" type="number" min="1" placeholder={t("max_bags")} value={form.max_bags} onChange={handleChange} />
        <input name="hourly_rate" type="number" step="0.01" placeholder={t("hourly_rate")} value={form.hourly_rate} onChange={handleChange} />
        <textarea name="description" placeholder={t("description")} value={form.description} onChange={handleChange}></textarea>
  
        <div className="hours-row">
          <label>
            {t("open_from")}
            <input type="time" name="open_hours.from" value={form.open_hours.from} onChange={handleChange} />
          </label>
          <label>
            {t("open_to")}
            <input type="time" name="open_hours.to" value={form.open_hours.to} onChange={handleChange} />
          </label>
        </div>
  
        <input name="phone" placeholder={t("phone") + ` (${t("optional")})`} value={form.phone || ""} onChange={handleChange} />
        <input name="email" placeholder={t("email") + ` (${t("optional")})`} value={form.email || ""} onChange={handleChange} />
  
        <button type="submit" className="btn">{t("update_location")}</button>
      </form>
    </div>
  );
}  

export default AdminLocationEdit;

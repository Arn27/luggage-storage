// components/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "./ConfirmModal";

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      alert(data.message);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p>{t("no_users")}</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="business-card">
            <h3>{user.name}</h3>
            <p>📧 {user.email}</p>
            <button className="btn" onClick={() => {
              setSelectedUser(user);
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
          if (selectedUser) deleteUser(selectedUser.id);
          setShowModal(false);
        }}
        message={t("confirm_delete_user")}
      />
    </div>
  );
};

export default AdminUsers;
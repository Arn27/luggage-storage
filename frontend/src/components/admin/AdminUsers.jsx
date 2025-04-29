// Updated AdminUsers.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "./ConfirmModal";

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState("confirm");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/user/${id}`, {
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
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      setModalType("error");
      setModalMessage(t("something_went_wrong"));
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    if (selectedUser) deleteUser(selectedUser.id);
    setSelectedUser(null);
  };

  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p>{t("no_users")}</p>
      ) : (
        users.map((user) => (
        <div key={user.id} className="business-card">
          <h3>{user.name}</h3>
          <p>📧 {user.email}</p>
          <button
            className="btn"
            onClick={() => {
              setSelectedUser(user);
              setModalType("confirm");
              setModalMessage(t("confirm_delete_user"));
              setShowModal(true);
            }}
          >
            🗑️ {t("delete")}
          </button>
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

export default AdminUsers;

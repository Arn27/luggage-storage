// components/admin/ConfirmModal.jsx
import { useTranslation } from "react-i18next";
import "./ConfirmModal.css";

const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            {t("confirm")}
          </button>
          <button className="cancel-btn" onClick={onClose}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

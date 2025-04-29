import { useTranslation } from "react-i18next";
import "./ConfirmModal.css";

const ConfirmModal = ({ show, onClose, onConfirm, message, type = "confirm" }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className={`confirm-modal-content ${type}`}>
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          {type === "confirm" ? (
            <>
              <button className={`confirm-btn ${type}`} onClick={onConfirm}>
                {t("confirm")}
              </button>
              <button className="cancel-btn" onClick={onClose}>
                {t("cancel")}
              </button>
            </>
          ) : (
            <button className={`confirm-btn ${type}`} onClick={onClose}>
              {t("ok")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

// components/admin/AdminTabSwitcher.jsx
import { useTranslation } from "react-i18next";

const tabs = [
  { key: "pending", label: "admin_panel" },
  { key: "users", label: "users" },
  { key: "businesses", label: "businesses" },
  { key: "locations", label: "locations" }
];

const AdminTabSwitcher = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? "active-tab" : "inactive-tab"}
          onClick={() => setActiveTab(tab.key)}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #0e9488',
            backgroundColor: activeTab === tab.key ? '#0e9488' : 'white',
            color: activeTab === tab.key ? 'white' : '#0e9488',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
};

export default AdminTabSwitcher;

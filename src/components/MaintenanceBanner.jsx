import { useSelector } from "react-redux";
import "./MaintenanceBanner.css";

export default function MaintenanceBanner({ data }) {
  const lang = useSelector((state) => state.category?.selectLanguage);

  const isHindi = lang === "hin";

  if (!data) {
    return null;
  }

  const title = isHindi
    ? data.hindiTitle || "निर्धारित रखरखाव"
    : data.title || "Scheduled Maintenance";

  const message = isHindi
    ? data.hindiMessage || "AapkaKaam पर जल्द ही रखरखाव कार्य किया जाएगा।"
    : data.message || "AapkaKaam will undergo scheduled maintenance soon.";

  return (
    <div className="maintenance-banner">
      <div className="maintenance-banner-icon">🔧</div>

      <div className="maintenance-banner-content">
        <strong>{title}</strong>

        <span>{message}</span>
      </div>
    </div>
  );
}

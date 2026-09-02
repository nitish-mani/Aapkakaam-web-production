import { useSelector, useDispatch } from "react-redux";
import "./MaintenancePage.css";

import { setSelectLanguage } from "../utils/categoryslice";

export default function MaintenancePage({ data }) {
  const dispatch = useDispatch();

  const lang = useSelector((state) => state.category?.selectLanguage || "en");

  const isHindi = lang === "hin";

  const maintenanceData = data || {};

  const title = isHindi
    ? maintenanceData.hindiTitle || "हम जल्द वापस आएंगे"
    : maintenanceData.title || "We'll Be Back Soon";

  const subtitle = isHindi
    ? maintenanceData.hindiSubtitle || "हम आपके लिए कुछ बेहतर बना रहे हैं"
    : maintenanceData.subtitle || "We are improving something better for you.";

  const message = isHindi
    ? maintenanceData.hindiMessage ||
      "AapkaKaam पर रखरखाव का काम चल रहा है। कृपया कुछ समय बाद दोबारा प्रयास करें।"
    : maintenanceData.message ||
      "AapkaKaam is temporarily unavailable while we perform scheduled maintenance. Please try again later.";

  const endDateTime = maintenanceData.endDateTime;

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    try {
      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return null;
      }

      if (isHindi) {
        return new Intl.DateTimeFormat("hi-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date);
      }

      return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch {
      return null;
    }
  };

  const formattedEndTime = formatDateTime(endDateTime);

  const handleLanguageChange = (language) => {
    dispatch(setSelectLanguage(language));
  };

  return (
    <main className="maintenance-page" role="main">
      {" "}
      <div className="maintenance-background">
        {" "}
        <div className="maintenance-glow maintenance-glow-one" />
        <div className="maintenance-glow maintenance-glow-two" />
      </div>
      <section className="maintenance-card" aria-labelledby="maintenance-title">
        {/* Language Switch */}

        <div className="maintenance-top-bar">
          <div className="language-switch" style={{ width: "fit-content" }}>
            <button
              type="button"
              className={!isHindi ? "active" : ""}
              onClick={() => handleLanguageChange("en")}
              aria-label="Switch to English"
            >
              EN
            </button>

            <button
              type="button"
              className={isHindi ? "active" : ""}
              onClick={() => handleLanguageChange("hin")}
              aria-label="Switch to Hindi"
            >
              हिं
            </button>
          </div>
        </div>

        {/* Icon */}

        <div className="maintenance-icon" aria-hidden="true">
          🔧
        </div>

        {/* Badge */}

        <div className="maintenance-badge">
          <span className="maintenance-status-dot" />

          {isHindi ? "रखरखाव जारी है" : "MAINTENANCE IN PROGRESS"}
        </div>

        {/* Title */}

        <h1 id="maintenance-title">{title}</h1>

        {/* Subtitle */}

        <p className="maintenance-subtitle">{subtitle}</p>

        {/* Message */}

        <p className="maintenance-message">{message}</p>

        {/* Expected End Time */}

        {formattedEndTime && (
          <div className="maintenance-time-card">
            <div className="maintenance-time-icon">🕒</div>

            <div>
              <span>
                {isHindi ? "सेवा पुनः शुरू होने का अनुमानित समय" : "Expected service restoration"}
              </span>

              <strong>{formattedEndTime}</strong>
            </div>
          </div>
        )}

        {/* Footer */}

        <footer className="maintenance-footer">
          <strong>Aapkakaam</strong>

          <span>
            {isHindi ? "आपके धैर्य और सहयोग के लिए धन्यवाद ❤️" : "Thank you for your patience ❤️"}
          </span>
        </footer>
      </section>
    </main>
  );
}

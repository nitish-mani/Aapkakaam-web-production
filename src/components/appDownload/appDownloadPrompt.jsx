import React, { useState } from "react";
import "./AppDownloadPrompt.css";

const APK_DOWNLOAD_URL = "https://download.aapkakaam.com/android/app-release-1.0.2.apk";

const AppDownloadPrompt = ({ phoneNo, language = "hi" }) => {
  const [stage, setStage] = useState("corner");

  const isHindi = language === "hi";

  // ============================================================
  // OPEN POPUP
  // ============================================================

  const handleOpen = () => {
    setStage("popup");
  };

  // ============================================================
  // CLOSE POPUP
  // ============================================================

  const handleClose = () => {
    setStage("corner");
  };

  // ============================================================
  // DOWNLOAD APK
  // ============================================================

  const handleDownload = () => {
    if (phoneNo) {
      localStorage.setItem(`aapkakaam_app_download_${phoneNo}`, "downloaded");
    }

    window.location.href = APK_DOWNLOAD_URL;

    setStage("corner");
  };

  // ============================================================
  // FLOATING DOWNLOAD BUTTON
  // ============================================================

  if (stage === "corner") {
    return (
      <button
        type="button"
        className="app-download-floating"
        onClick={handleOpen}
        aria-label={isHindi ? "ऐप डाउनलोड करें" : "Download Aapkakaam App"}
      >
        <span className="app-download-floating-icon">
          <span className="apk-text">APK</span>
        </span>

        <span className="app-download-floating-content">
          <span className="app-download-floating-small">
            {isHindi ? "Android App" : "Android App"}
          </span>

          <span className="app-download-floating-text">
            {isHindi ? "ऐप डाउनलोड करें" : "Download App"}
          </span>
        </span>

        <span className="app-download-floating-arrow">→</span>
      </button>
    );
  }

  // ============================================================
  // FULL POPUP
  // ============================================================

  return (
    <div
      className="app-download-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="app-download-popup">
        {/* =====================================================
            DECORATIVE BACKGROUND
        ===================================================== */}

        <div className="app-download-glow app-download-glow-one" />
        <div className="app-download-glow app-download-glow-two" />

        {/* =====================================================
            CLOSE
        ===================================================== */}

        <button
          type="button"
          className="app-download-close"
          onClick={handleClose}
          aria-label={isHindi ? "बंद करें" : "Close"}
        >
          ×
        </button>

        {/* =====================================================
            APP ICON
        ===================================================== */}

        <div className="app-download-icon-wrapper">
          <div className="app-download-icon-ring">
            <div className="app-download-icon">
              <span>APK</span>
            </div>
          </div>

          <div className="app-download-icon-check">✓</div>
        </div>

        {/* =====================================================
            BADGE
        ===================================================== */}

        <div className="app-download-badge">
          <span className="app-download-badge-dot" />

          {isHindi ? "बेहतर अनुभव के लिए" : "FOR A BETTER EXPERIENCE"}
        </div>

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div className="app-download-content">
          <h2>{isHindi ? "Aapkakaam App डाउनलोड करें" : "Get the Aapkakaam App"}</h2>

          <p className="app-download-description">
            {isHindi
              ? "तेज़, आसान और बेहतर अनुभव के लिए हमारा Android App इस्तेमाल करें।"
              : "Enjoy a faster, simpler and better experience with the Aapkakaam Android app."}
          </p>

          {/* =================================================
              FEATURES
          ================================================= */}

          <div className="app-download-features">
            <div className="app-download-feature">
              <div className="app-download-feature-icon">⚡</div>

              <div>
                <strong>{isHindi ? "तेज़" : "Faster"}</strong>

                <span>{isHindi ? "बेहतर परफॉर्मेंस" : "Better performance"}</span>
              </div>
            </div>

            <div className="app-download-feature">
              <div className="app-download-feature-icon">🔔</div>

              <div>
                <strong>{isHindi ? "नोटिफिकेशन" : "Notifications"}</strong>

                <span>{isHindi ? "समय पर अपडेट" : "Stay updated"}</span>
              </div>
            </div>

            <div className="app-download-feature">
              <div className="app-download-feature-icon">📱</div>

              <div>
                <strong>{isHindi ? "मोबाइल" : "Mobile"}</strong>

                <span>{isHindi ? "मोबाइल के लिए बनाया" : "Built for mobile"}</span>
              </div>
            </div>
          </div>

          {/* =================================================
              DOWNLOAD BUTTON
          ================================================= */}

          <button type="button" className="app-download-main-button" onClick={handleDownload}>
            <span className="download-button-icon">↓</span>

            <span className="download-button-content">
              <strong>{isHindi ? "Android App डाउनलोड करें" : "Download Android App"}</strong>

              <small>{isHindi ? "Direct APK Download" : "Direct APK Download"}</small>
            </span>

            <span className="download-button-arrow">→</span>
          </button>
          {/* <a
            href="https://download.aapkakaam.com/android/app-release.apk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download APK
          </a> */}

          {/* =================================================
              MAYBE LATER
          ================================================= */}

          <button type="button" className="app-download-later" onClick={handleClose}>
            {isHindi ? "अभी नहीं, बाद में" : "Maybe Later"}
          </button>

          {/* =================================================
              VERSION
          ================================================= */}

          <div className="app-download-version">
            <span>●</span>
            Android App&nbsp; • &nbsp;Direct APK
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadPrompt;

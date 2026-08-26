// Modern Payment Failed Page - AapkaKaam

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./PaymentFailed.css";

const PaymentFailed = () => {
  const navigate = useNavigate();

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const handleRetry = () => {
    navigate("/addMoney");
  };

  const handleSupport = () => {
    window.location.href = "mailto:support@aapkakaam.com";
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="payment-failed-modern">
      <div className="payment-failed-container">
        {/* Decorative Elements */}
        <div className="payment-failed-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Failed Icon */}
        <div className="failed-icon-wrapper">
          <div className="failed-icon-ring">
            <div className="failed-icon">✕</div>
          </div>
        </div>

        {/* Header */}
        <div className="payment-failed-header">
          <div className="failed-badge">
            {lang === "hin" ? "❌ भुगतान विफल" : "❌ PAYMENT FAILED"}
          </div>
          <h1>{lang === "hin" ? "भुगतान विफल हुआ!" : "Payment Failed!"}</h1>
          <p>
            {lang === "hin"
              ? "हम आपका भुगतान संसाधित नहीं कर सके। कृपया पुनः प्रयास करें।"
              : "We couldn't process your payment. Please try again."}
          </p>
        </div>

        {/* Possible Reasons */}
        <div className="failure-reasons-modern">
          <div className="reasons-header">
            <span className="reasons-icon">🔍</span>
            <span className="reasons-title">
              {lang === "hin" ? "संभावित कारण" : "Possible Reasons"}
            </span>
          </div>
          <ul className="reasons-list">
            <li>
              <span className="reason-icon">💳</span>
              <span>
                {lang === "hin"
                  ? "आपके खाते में अपर्याप्त बैलेंस"
                  : "Insufficient balance in your account"}
              </span>
            </li>
            <li>
              <span className="reason-icon">📡</span>
              <span>
                {lang === "hin" ? "नेटवर्क कनेक्टिविटी समस्याएँ" : "Network connectivity issues"}
              </span>
            </li>
            <li>
              <span className="reason-icon">🏦</span>
              <span>
                {lang === "hin" ? "बैंक ने लेनदेन अस्वीकार किया" : "Bank declined the transaction"}
              </span>
            </li>
            <li>
              <span className="reason-icon">⏱️</span>
              <span>{lang === "hin" ? "भुगतान गेटवे टाइमआउट" : "Payment gateway timeout"}</span>
            </li>
          </ul>
        </div>

        {/* Button Group */}
        <div className="button-group-modern">
          <button className="retry-button-modern" onClick={handleRetry}>
            <span>{lang === "hin" ? "पुनः प्रयास करें" : "Try Again"}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button className="support-button-modern" onClick={() => navigate("/concern")}>
            <span>{lang === "hin" ? "सहायता से संपर्क करें" : "Contact Support"}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
        </div>

        {/* Note */}
        <div className="failed-note-modern">
          <span className="note-icon">ℹ️</span>
          <p>
            {lang === "hin"
              ? "यदि आपके खाते से राशि कट गई है लेकिन आपको क्रेडिट नहीं मिला है, तो कृपया हमारी सहायता टीम से संपर्क करें।"
              : "If the amount was deducted from your account but you didn't receive credits, please contact our support team."}
          </p>
        </div>

        {/* Go Home Link */}
        <button className="go-home-button" onClick={handleGoHome}>
          <span>{lang === "hin" ? "🏠 होम पेज पर जाएं" : "🏠 Go to Homepage"}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1" />
          </svg>
        </button>

        {/* Footer */}
        <div className="payment-failed-footer">
          <span>
            {lang === "hin"
              ? "किसी भी समस्या के लिए सहायता से संपर्क करें"
              : "Contact support for any issues"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;

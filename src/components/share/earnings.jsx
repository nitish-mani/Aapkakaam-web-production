// Modern Earnings Page - AapkaKaam

import "./earnings.css";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showInfo } from "../showAlert";

export default function Earnings() {
  const category = localStorage.getItem("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const token = `Bearer ${userData[0]?.token || JSON.parse(localStorage.getItem(category))?.token}`;

  const userId =
    category === "user"
      ? userData[0]?.userId || JSON.parse(localStorage.getItem(category))?.userId
      : userData[0]?.vendorId || JSON.parse(localStorage.getItem(category))?.vendorId;

  const [earnings, setEarnings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (!navigator.onLine) {
      setIsLoading(false);
      setErr(lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
      setTimeout(() => setErr(""), 3000);
      return;
    }

    axios
      .get(`${SERVER_URL}/${category}/getEarnings/${userId}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setEarnings(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setErr(lang === "hin" ? "कुछ गलत हो गया" : "Something went wrong");
        setTimeout(() => {
          setErr("");
          navigate("/");
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (err) {
      showInfo(err);
    }
  }, [err]);

  function handleClose() {
    navigate("/");
  }

  const handleWithdrawClick = () => {
    if (earnings?.earning < 1000 || earnings?.shareCount < 100) {
      setErr(
        lang === "hin"
          ? "निकासी तब काम करेगी जब आपकी कमाई 1000 रुपये से अधिक हो और शेयर 100 से अधिक हो"
          : "Withdraw will work after Your Earning is more than 1000 Rupees and Share is more than 100",
      );
      setTimeout(() => setErr(""), 3000);
    } else {
      setShowWithdrawModal(true);
    }
  };

  const handleWithdrawSubmit = () => {
    // Withdraw logic here
    setShowWithdrawModal(false);
    showInfo(lang === "hin" ? "निकासी का अनुरोध भेज दिया गया है" : "Withdrawal request submitted");
  };

  const stats = [
    {
      id: "totalShare",
      icon: "📤",
      label: lang === "hin" ? "कुल शेयर" : "Total Share",
      value: earnings?.shareCount || 0,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      id: "totalOrders",
      icon: "📦",
      label: lang === "hin" ? "कुल ऑर्डर" : "Total Orders",
      value: earnings?.pendingShareBy + earnings?.completedShareBy + earnings?.canceledShareBy || 0,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      id: "newOrders",
      icon: "🆕",
      label: lang === "hin" ? "नए ऑर्डर" : "New Orders",
      value: earnings?.pendingShareBy || 0,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      id: "completedOrders",
      icon: "✅",
      label: lang === "hin" ? "पूर्ण ऑर्डर" : "Completed Orders",
      value: earnings?.completedShareBy || 0,
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      id: "canceledOrders",
      icon: "❌",
      label: lang === "hin" ? "रद्द ऑर्डर" : "Canceled Orders",
      value: earnings?.canceledShareBy || 0,
      color: "#dc2626",
      bg: "#fef2f2",
    },
    {
      id: "earning",
      icon: "💰",
      label: lang === "hin" ? "कमाई" : "Earning",
      value: `₹${earnings?.earning || 0}`,
      color: "#059669",
      bg: "#ecfdf5",
    },
  ];

  return (
    <div className="earnings-modern" ref={containerRef}>
      <AdsterraBanner_320x50 />

      <div className="earnings-modern-container">
        {/* Close Button */}
        <button className="earnings-close-btn" onClick={handleClose}>
          <svg viewBox="0 0 24 24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="earnings-header-modern">
          <div className="earnings-header-left">
            <div className="header-icon-wrapper">
              <span className="header-icon">📊</span>
            </div>
            <div>
              <h1>{lang === "hin" ? "कमाई डैशबोर्ड" : "Earnings Dashboard"}</h1>
              <p>
                {lang === "hin"
                  ? "अपनी कुल कमाई और ऑर्डर आँकड़े देखें"
                  : "View your total earnings and order statistics"}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="earnings-loading-modern">
            <div className="loading-spinner-modern"></div>
            <p>{lang === "hin" ? "डेटा लोड हो रहा है..." : "Loading data..."}</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="earnings-grid-modern">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="earnings-stat-card"
                  style={{
                    borderColor: stat.color,
                    background: stat.bg,
                  }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Withdraw Section */}
            <div className="earnings-withdraw-section">
              <div className="withdraw-info">
                <span className="withdraw-icon">🏦</span>
                <div>
                  <strong>
                    {lang === "hin" ? "निकासी के लिए पात्र" : "Eligible for Withdrawal"}
                  </strong>
                  <p>
                    {lang === "hin"
                      ? "न्यूनतम ₹1000 कमाई और 100 शेयर आवश्यक"
                      : "Minimum ₹1000 earning and 100 shares required"}
                  </p>
                </div>
              </div>
              <button
                className="withdraw-btn-modern"
                onClick={handleWithdrawClick}
                disabled={earnings?.earning < 1000 || earnings?.shareCount < 100}
              >
                <span>🏦</span>
                {lang === "hin" ? "निकासी करें" : "Withdraw"}
              </button>
            </div>

            {/* Withdraw Eligibility Status */}
            <div className="withdraw-status-modern">
              <div className="status-item">
                <span className="status-label">{lang === "hin" ? "कमाई" : "Earning"}:</span>
                <span
                  className={`status-value ${earnings?.earning >= 1000 ? "eligible" : "not-eligible"}`}
                >
                  ₹{earnings?.earning || 0}
                  {earnings?.earning >= 1000 ? " ✅" : " ❌"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">{lang === "hin" ? "शेयर" : "Shares"}:</span>
                <span
                  className={`status-value ${earnings?.shareCount >= 100 ? "eligible" : "not-eligible"}`}
                >
                  {earnings?.shareCount || 0}
                  {earnings?.shareCount >= 100 ? " ✅" : " ❌"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="withdraw-modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="withdraw-modal" onClick={(e) => e.stopPropagation()}>
            <div className="withdraw-modal-header">
              <h3>{lang === "hin" ? "निकासी का अनुरोध" : "Withdrawal Request"}</h3>
              <button className="modal-close-btn" onClick={() => setShowWithdrawModal(false)}>
                ✕
              </button>
            </div>
            <div className="withdraw-modal-body">
              <div className="withdraw-amount-display">
                <span className="withdraw-label">
                  {lang === "hin" ? "कुल उपलब्ध" : "Total Available"}:
                </span>
                <span className="withdraw-amount">₹{earnings?.earning || 0}</span>
              </div>
              <div className="withdraw-method-group">
                <label>{lang === "hin" ? "निकासी विधि" : "Withdrawal Method"}</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="withdraw-select"
                >
                  <option value="bank">{lang === "hin" ? "बैंक ट्रांसफर" : "Bank Transfer"}</option>
                  <option value="upi">UPI</option>
                  <option value="paytm">Paytm</option>
                </select>
              </div>
              <div className="withdraw-amount-group">
                <label>{lang === "hin" ? "राशि (₹)" : "Amount (₹)"}</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={lang === "hin" ? "राशि दर्ज करें" : "Enter amount"}
                  className="withdraw-input"
                  max={earnings?.earning || 0}
                />
                <small>
                  {lang === "hin" ? "अधिकतम" : "Max"}: ₹{earnings?.earning || 0}
                </small>
              </div>
            </div>
            <div className="withdraw-modal-footer">
              <button className="cancel-btn" onClick={() => setShowWithdrawModal(false)}>
                {lang === "hin" ? "रद्द करें" : "Cancel"}
              </button>
              <button className="confirm-btn" onClick={handleWithdrawSubmit}>
                {lang === "hin" ? "निकासी करें" : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdsterraBanner />
    </div>
  );
}

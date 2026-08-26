// Modern Share Page - AapkaKaam

import "./share.css";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import twitter from "../../resources/svg/twitter-svgrepo-com.svg";
import facebook from "../../resources/svg/facebook-svgrepo-com.svg";
import linkedin from "../../resources/svg/linkedin-svgrepo-com.svg";
import whatsapp from "../../resources/svg/whatsapp-svgrepo-com.svg";
import telegram from "../../resources/svg/telegram-svgrepo-com.svg";
import textMessage from "../../resources/svg/message-mid-text-svgrepo-com.svg";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import Attendance from "../Attendance/attendance";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import { SERVER_URL } from "../../utils/base";

const Share = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const category = localStorage.getItem("category");
  const userId =
    category === "user"
      ? JSON.parse(localStorage.getItem(category)).userId
      : JSON.parse(localStorage.getItem(category)).vendorId;

  const userData = JSON.parse(localStorage.getItem(category));
  const userName = userData?.name || "User";

  const url = `${SERVER_URL}/category/${category}/${userId}`;
  const text = `${lang === "hin" ? `${userName} द्वारा साझा किया गया` : `Shared by ${userName}`}`;
  const phoneNumber = "";

  const [copySuccess, setCopySuccess] = useState(false);

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

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url,
    )}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
      url,
    )}&title=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, "_blank");
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text,
    )}%20${encodeURIComponent(url)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareOnTelegram = () => {
    const telegramUrl = `https://telegram.me/share/url?url=${encodeURIComponent(
      url,
    )}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank");
  };

  const handleShare = () => {
    const smsUri = `sms:${phoneNumber}?body=${encodeURIComponent(url)}`;
    window.open(smsUri);
  };

  const socialPlatforms = [
    {
      id: "twitter",
      icon: twitter,
      label: "Twitter",
      labelHindi: "ट्विटर",
      action: shareOnTwitter,
      color: "#1DA1F2",
      bg: "#E8F5FE",
    },
    {
      id: "facebook",
      icon: facebook,
      label: "Facebook",
      labelHindi: "फेसबुक",
      action: shareOnFacebook,
      color: "#1877F2",
      bg: "#EAF2FD",
    },
    {
      id: "linkedin",
      icon: linkedin,
      label: "LinkedIn",
      labelHindi: "लिंक्डइन",
      action: shareOnLinkedIn,
      color: "#0A66C2",
      bg: "#EAF3FA",
    },
    {
      id: "whatsapp",
      icon: whatsapp,
      label: "WhatsApp",
      labelHindi: "व्हाट्सएप",
      action: shareOnWhatsApp,
      color: "#25D366",
      bg: "#E8F9F0",
    },
    {
      id: "telegram",
      icon: telegram,
      label: "Telegram",
      labelHindi: "टेलीग्राम",
      action: shareOnTelegram,
      color: "#0088CC",
      bg: "#E8F4FC",
    },
    {
      id: "sms",
      icon: textMessage,
      label: "SMS",
      labelHindi: "एसएमएस",
      action: handleShare,
      color: "#6B7280",
      bg: "#F3F4F6",
    },
  ];

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="share-modern-page" ref={containerRef}>
        <div className="share-modern-container">
          {/* Close Button */}
          <button className="share-modern-close" onClick={() => navigate("/")}>
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
          <div className="share-modern-header">
            <div className="share-header-icon">
              <span>🔗</span>
            </div>
            <div className="share-header-content">
              <h1>{lang === "hin" ? "शेयर करें" : "Share"}</h1>
              <p>
                {lang === "hin"
                  ? "अपने दोस्तों और परिवार के साथ साझा करें"
                  : "Share with your friends and family"}
              </p>
            </div>
          </div>

          {/* URL Display */}
          <div className="share-url-container">
            <div className="share-url-display">
              <span className="url-icon">🔗</span>
              <span className="url-text">{url}</span>
            </div>
            <button className="copy-btn" onClick={copyToClipboard}>
              {copySuccess ? (
                <span className="copy-success">
                  ✓ {lang === "hin" ? "कॉपी हो गया!" : "Copied!"}
                </span>
              ) : (
                <span>{lang === "hin" ? "📋 कॉपी करें" : "📋 Copy"}</span>
              )}
            </button>
          </div>

          {/* Share Text */}
          <div className="share-text-display">
            <span className="share-text-label">
              {lang === "hin" ? "📝 शेयर टेक्स्ट" : "📝 Share Text"}:
            </span>
            <span className="share-text-value">“{text}”</span>
          </div>

          {/* Social Platforms Grid */}
          <div className="share-modern-grid">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.id}
                className="share-modern-card"
                onClick={platform.action}
                style={{
                  "--hover-color": platform.color,
                  "--hover-bg": platform.bg,
                }}
              >
                <div className="share-card-icon" style={{ background: platform.bg }}>
                  <img src={platform.icon} alt={platform.label} />
                </div>
                <span className="share-card-label">
                  {lang === "hin" ? platform.labelHindi : platform.label}
                </span>
                <span className="share-card-arrow">→</span>
              </button>
            ))}
          </div>

          {/* Footer Note */}
          <div className="share-modern-footer">
            <span>
              {lang === "hin"
                ? "💡 अपने दोस्तों को आमंत्रित करें और एक साथ Aapkakaam का उपयोग करें"
                : "💡 Invite your friends and use Aapkakaam together"}
            </span>
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
};

export default Share;

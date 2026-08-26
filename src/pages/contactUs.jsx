// Modern Contact Us Page - AapkaKaam (with Telegram Integration)

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import "./ContactUs.css";

const ContactUs = () => {
  const navigate = useNavigate();

  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const t = (en, hi) => {
    return lang === "hin" ? hi : en;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // Send message to Telegram
  const sendToTelegram = async (data) => {
    const { name, email, phone, subject, message } = data;

    const telegramMessage = `
📩 *New Contact Form Submission*

👤 *Name:* ${name}
📧 *Email:* ${email}
📱 *Phone:* ${phone || "Not provided"}
📝 *Subject:* ${subject}

💬 *Message:*
${message}

---
Sent from AapkaKaam Contact Form
    `;

    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        },
      );
      return response.data.ok;
    } catch (error) {
      console.error("Telegram send error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await sendToTelegram(formData);

      if (success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(
          t(
            "Failed to send message. Please try again.",
            "संदेश भेजने में विफल। कृपया पुनः प्रयास करें।",
          ),
        );
      }
    } catch (err) {
      setError(
        t(
          "Failed to send message. Please try again later.",
          "संदेश भेजने में विफल। कृपया बाद में पुनः प्रयास करें।",
        ),
      );
      console.error("Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-modern">
      {/* Back Button */}
      <button className="contact-back-btn" onClick={() => navigate("/")}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {t("Back", "वापस")}
      </button>

      <div className="contact-container">
        {/* Decorative Elements */}
        <div className="contact-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Header */}
        <div className="contact-header">
          <div className="contact-header-icon">📧</div>
          <div className="contact-header-content">
            <span className="contact-badge">{t("CONTACT US", "संपर्क करें")}</span>
            <h1>{t("Contact Us", "संपर्क करें")}</h1>
            <p>
              {t(
                "Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you soon.",
                "कोई प्रश्न या सुझाव? हम आपसे सुनना पसंद करेंगे। नीचे दिए गए फॉर्म को भरें और हम जल्द ही आपसे संपर्क करेंगे।",
              )}
            </p>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="contact-success">
            <span className="success-icon">✅</span>
            <div>
              <strong>{t("Thank you for reaching out!", "संपर्क करने के लिए धन्यवाद!")}</strong>
              <span>{t("We will get back to you shortly.", "हम जल्द ही आपसे संपर्क करेंगे।")}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="contact-error">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>{t("Error", "त्रुटि")}</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="contact-form-wrapper">
          <div className="contact-form-header">
            <span className="form-icon">✉️</span>
            <div>
              <h3>{t("Send us a Message", "हमें संदेश भेजें")}</h3>
              <p>{t("We'll respond within 24 hours", "हम 24 घंटे के भीतर जवाब देंगे")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  {t("Full Name", "पूरा नाम")} <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t("Your full name", "आपका पूरा नाम")}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  {t("Email Address", "ईमेल पता")} <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t("you@example.com", "आप@उदाहरण.com")}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">{t("Phone Number", "फोन नंबर")}</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("Your phone number", "आपका फोन नंबर")}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  {t("Subject", "विषय")} <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📝</span>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={t("Brief subject", "संक्षिप्त विषय")}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="message">
                {t("Message", "संदेश")} <span className="required">*</span>
              </label>
              <div className="input-wrapper textarea-wrapper">
                <span className="input-icon">💬</span>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={t("Write your message here...", "अपना संदेश यहां लिखें...")}
                  className="form-textarea"
                />
              </div>
              <div className="char-counter">{formData.message.length}/500</div>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="btn-spinner"></span>
              ) : (
                <>
                  <span>{t("Send Message", "संदेश भेजें")}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <h3>{t("Other Contact Information", "अन्य संपर्क जानकारी")}</h3>
          <div className="contact-info-grid">
            <div className="info-card">
              <span className="info-icon">📧</span>
              <div>
                <span className="info-label">{t("Email", "ईमेल")}</span>
                <a href="mailto:support@aapkakaam.com">support@aapkakaam.com</a>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">📞</span>
              <div>
                <span className="info-label">{t("Phone", "फोन")}</span>
                <span>+91-5568318482</span>
              </div>
            </div>

            <div className="info-card full-width">
              <span className="info-icon">📍</span>
              <div>
                <span className="info-label">{t("Address", "पता")}</span>
                <span>
                  {t(
                    "Vill - Govindpur, Post - Baitalpur, Dist. - Deoria, Uttar Pradesh (274201)",
                    "गाँव - गोविंदपुर, पोस्ट - बैतालपुर, जिला - देवरिया, उत्तर प्रदेश (274201)",
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="contact-footer">
          <span>© 2026 AapkaKaam • {t("All Rights Reserved", "सभी अधिकार सुरक्षित")}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

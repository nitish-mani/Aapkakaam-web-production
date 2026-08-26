// Modern About Us Page - AapkaKaam

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./AboutUs.css";

const AboutUs = () => {
  const navigate = useNavigate();

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const t = (en, hi) => {
    return lang === "hin" ? hi : en;
  };

  return (
    <div className="about-us-modern">
      {/* Back Button */}
      <button className="about-back-btn" onClick={() => navigate(-1)}>
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

      <div className="about-us-container">
        {/* Decorative Elements */}
        <div className="about-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Hero Section */}
        <div className="about-hero">
          <div className="about-hero-icon">🤝</div>
          <div className="about-hero-content">
            <span className="about-badge">{t("ABOUT US", "हमारे बारे में")}</span>
            <h1>
              {t("Welcome to", "स्वागत है")} <span className="highlight">Aapkakaam</span>
            </h1>
            <p>
              {t(
                "Your trusted online marketplace connecting service providers and customers across India.",
                "भारत भर में सेवा प्रदाताओं और ग्राहकों को जोड़ने वाला आपका भरोसेमंद ऑनलाइन मार्केटप्लेस।",
              )}
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="about-content-grid">
          {/* What We Offer */}
          <div className="about-card">
            <div className="about-card-icon">💼</div>
            <h3>{t("What We Offer", "हम क्या प्रदान करते हैं")}</h3>
            <p>
              {t(
                "We provide a platform where service vendors can showcase their offerings and customers can book services easily. Whether you need home repairs, cleaning, tutoring, or any other service, AapkaKaam is your go-to solution.",
                "हम एक ऐसा प्लेटफॉर्म प्रदान करते हैं जहां सेवा प्रदाता अपनी सेवाएं दिखा सकते हैं और ग्राहक आसानी से सेवाएं बुक कर सकते हैं। चाहे आपको घर की मरम्मत, सफाई, ट्यूशन या कोई अन्य सेवा चाहिए, AapkaKaam आपका समाधान है।",
              )}
            </p>
          </div>

          {/* Freemium Model */}
          <div className="about-card featured">
            <div className="about-card-icon">🎯</div>
            <h3>{t("Our Freemium Model", "हमारा फ्रीमियम मॉडल")}</h3>
            <p>
              {t(
                "Vendors get the first 5 service bookings free of commission to help grow their business. After that, a nominal commission per order applies based on the service type. We also offer a 'Share and Earn' program where users can earn rewards by sharing our platform with others.",
                "विक्रेताओं को अपने व्यवसाय को बढ़ाने में मदद करने के लिए पहली 5 सेवा बुकिंग कमीशन मुफ्त मिलती है। उसके बाद, सेवा प्रकार के आधार पर प्रति ऑर्डर एक नाममात्र कमीशन लागू होता है। हम 'शेयर और कमाएं' कार्यक्रम भी प्रदान करते हैं जहां उपयोगकर्ता हमारे प्लेटफॉर्म को दूसरों के साथ साझा करके पुरस्कार अर्जित कर सकते हैं।",
              )}
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="about-card">
            <div className="about-card-icon">⭐</div>
            <h3>{t("Why Choose Us?", "हमें क्यों चुनें?")}</h3>
            <ul className="about-list">
              <li>
                <span className="list-icon">✓</span>
                {t(
                  "Trusted service providers with user ratings and reviews.",
                  "उपयोगकर्ता रेटिंग और समीक्षाओं के साथ भरोसेमंद सेवा प्रदाता।",
                )}
              </li>
              <li>
                <span className="list-icon">✓</span>
                {t(
                  "Easy booking and transparent pricing.",
                  "आसान बुकिंग और पारदर्शी मूल्य निर्धारण।",
                )}
              </li>
              <li>
                <span className="list-icon">✓</span>
                {t(
                  "Secure platform with SMS notifications and user profile management.",
                  "एसएमएस सूचनाओं और उपयोगकर्ता प्रोफ़ाइल प्रबंधन के साथ सुरक्षित प्लेटफॉर्म।",
                )}
              </li>
              <li>
                <span className="list-icon">✓</span>
                {t(
                  "Personalized experience with ads served responsibly.",
                  "जिम्मेदारी से दिखाए गए विज्ञापनों के साथ व्यक्तिगत अनुभव।",
                )}
              </li>
            </ul>
          </div>

          {/* Our Vision */}
          <div className="about-card">
            <div className="about-card-icon">🚀</div>
            <h3>{t("Our Vision", "हमारा लक्ष्य")}</h3>
            <p>
              {t(
                "We aim to empower local service providers by giving them a digital platform and customers with easy access to quality services. Our goal is to build a community where both vendors and users benefit.",
                "हम स्थानीय सेवा प्रदाताओं को एक डिजिटल प्लेटफॉर्म देकर और ग्राहकों को गुणवत्तापूर्ण सेवाओं तक आसान पहुंच प्रदान करके उन्हें सशक्त बनाना चाहते हैं। हमारा लक्ष्य एक ऐसा समुदाय बनाना है जहां विक्रेताओं और उपयोगकर्ताओं दोनों को लाभ हो।",
              )}
            </p>
          </div>

          {/* Stats */}
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">{t("Services", "सेवाएँ")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.8★</span>
              <span className="stat-label">{t("Avg Rating", "औसत रेटिंग")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">{t("Happy Users", "खुश उपयोगकर्ता")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">{t("Cities", "शहर")}</span>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="about-contact">
          <div className="contact-icon">📧</div>
          <div>
            <h3>{t("Contact Us", "संपर्क करें")}</h3>
            <p>
              {t(
                "Have questions or feedback? Reach out to us anytime at",
                "कोई प्रश्न या सुझाव? हमें कभी भी संपर्क करें",
              )}
              <a href="mailto:support@aapkakaam.com"> support@aapkakaam.com</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="about-footer">
          <span>
            © {new Date().getFullYear()} Uslugi Technology Pvt. Ltd. •{" "}
            {t("All Rights Reserved", "सभी अधिकार सुरक्षित")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

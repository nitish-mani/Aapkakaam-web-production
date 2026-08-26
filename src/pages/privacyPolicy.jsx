// Modern Privacy Policy Page - AapkaKaam

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const t = (en, hi) => {
    return lang === "hin" ? hi : en;
  };

  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  const sections = [
    {
      icon: "📋",
      title: t("What Information We Collect", "हम क्या जानकारी एकत्र करते हैं"),
      items: [
        t(
          "Personal details like name, email, phone number, and profile picture.",
          "नाम, ईमेल, फोन नंबर और प्रोफ़ाइल चित्र जैसी व्यक्तिगत जानकारी।",
        ),
        t("Booking and service usage data.", "बुकिंग और सेवा उपयोग डेटा।"),
        t("Device and location information.", "डिवाइस और स्थान की जानकारी।"),
        t("Interaction data related to ads.", "विज्ञापनों से संबंधित इंटरैक्शन डेटा।"),
      ],
    },
    {
      icon: "🔧",
      title: t("How We Use Your Information", "हम आपकी जानकारी का उपयोग कैसे करते हैं"),
      items: [
        t(
          "To connect users with service providers.",
          "उपयोगकर्ताओं को सेवा प्रदाताओं से जोड़ने के लिए।",
        ),
        t(
          "To manage bookings, commissions, and balances.",
          "बुकिंग, कमीशन और बैलेंस प्रबंधित करने के लिए।",
        ),
        t(
          "To serve personalized advertisements via Google AdSense, AdMob, and similar services.",
          "Google AdSense, AdMob और समान सेवाओं के माध्यम से व्यक्तिगत विज्ञापन दिखाने के लिए।",
        ),
        t(
          "To send SMS notifications and alerts to your registered mobile number.",
          "आपके पंजीकृत मोबाइल नंबर पर SMS सूचनाएं और अलर्ट भेजने के लिए।",
        ),
        t(
          "To facilitate our 'Share and Earn' program.",
          "हमारे 'शेयर और कमाएं' कार्यक्रम को सुविधाजनक बनाने के लिए।",
        ),
      ],
    },
    {
      icon: "📢",
      title: t("Advertising and Analytics", "विज्ञापन और विश्लेषण"),
      items: [
        t(
          "We use third-party advertising services like Google AdSense, Adsterra, Monetag and AdMob to generate revenue. These services may use cookies and other tracking technologies to serve ads based on your activity.",
          "हम राजस्व उत्पन्न करने के लिए Google AdSense, Adsterra, Monetag और AdMob जैसी तृतीय-पक्ष विज्ञापन सेवाओं का उपयोग करते हैं। ये सेवाएं आपकी गतिविधि के आधार पर विज्ञापन दिखाने के लिए कुकीज़ और अन्य ट्रैकिंग तकनीकों का उपयोग कर सकती हैं।",
        ),
      ],
    },
    {
      icon: "🤝",
      title: t("Sharing Your Data", "आपका डेटा साझा करना"),
      items: [
        t(
          "We do not sell your personal information to third parties. However, service providers and advertisers may receive limited information as necessary to provide services.",
          "हम आपकी व्यक्तिगत जानकारी तीसरे पक्षों को नहीं बेचते हैं। हालांकि, सेवा प्रदाताओं और विज्ञापनदाताओं को सेवाएं प्रदान करने के लिए आवश्यक सीमित जानकारी प्राप्त हो सकती है।",
        ),
      ],
    },
    {
      icon: "⚙️",
      title: t("Your Choices and Controls", "आपके विकल्प और नियंत्रण"),
      items: [
        t(
          "You can update your profile picture and personal information through your account. You may also opt-out of personalized ads by adjusting your device or browser settings.",
          "आप अपने खाते के माध्यम से अपनी प्रोफ़ाइल चित्र और व्यक्तिगत जानकारी अपडेट कर सकते हैं। आप अपने डिवाइस या ब्राउज़र सेटिंग्स को समायोजित करके व्यक्तिगत विज्ञापनों से ऑप्ट-आउट भी कर सकते हैं।",
        ),
      ],
    },
    {
      icon: "📱",
      title: t("Use of Mobile Number", "मोबाइल नंबर का उपयोग"),
      items: [
        t(
          "We use your mobile number to send you SMS alerts and important notifications related to your bookings and account.",
          "हम आपके मोबाइल नंबर का उपयोग आपकी बुकिंग और खाते से संबंधित SMS अलर्ट और महत्वपूर्ण सूचनाएं भेजने के लिए करते हैं।",
        ),
      ],
    },
    {
      icon: "💰",
      title: t("Freemium & Commission Model", "फ्रीमियम और कमीशन मॉडल"),
      items: [
        t(
          "Vendors get the first 5 service orders free. After that, a commission of ₹30 to ₹100 per order applies based on the service. No refunds are available for canceled orders. Vendors must maintain sufficient balance to use our services.",
          "विक्रेताओं को पहले 5 सेवा ऑर्डर मुफ्त मिलते हैं। उसके बाद, सेवा के आधार पर ₹30 से ₹100 प्रति ऑर्डर का कमीशन लागू होता है। रद्द किए गए ऑर्डर के लिए कोई रिफंड उपलब्ध नहीं है। विक्रेताओं को हमारी सेवाओं का उपयोग करने के लिए पर्याप्त बैलेंस बनाए रखना होगा।",
        ),
      ],
    },
    {
      icon: "🌟",
      title: t("Share & Earn Program", "शेयर और कमाएं कार्यक्रम"),
      items: [
        t(
          "Users sharing links via their accounts earn ₹1.5 to ₹5 or 5% of company commission from each completed order beyond the first 5 free orders. Only completed orders count; canceled orders do not contribute to earnings. Earnings may be affected due to discount given to vendors and users. It will be based on discounted percentage. Daily attendance is mandatory - 6 minutes total per day and 2 minutes on each three pages (Home Page, Share Page, View Share Page) with 100% to qualify for withdraw.",
          "अपने खातों के माध्यम से लिंक साझा करने वाले उपयोगकर्ता पहले 5 मुफ्त ऑर्डर से परे प्रत्येक पूर्ण ऑर्डर से ₹1.5 से ₹5 या कंपनी कमीशन का 5% कमाते हैं। केवल पूर्ण किए गए ऑर्डर गिने जाते हैं; रद्द किए गए ऑर्डर कमाई में योगदान नहीं करते हैं। विक्रेताओं और उपयोगकर्ताओं को दी गई छूट के कारण कमाई प्रभावित हो सकती है। यह छूट प्रतिशत पर आधारित होगी। दैनिक उपस्थिति अनिवार्य है - प्रति दिन कुल 6 मिनट और तीन पृष्ठों (होम पेज, शेयर पेज, व्यू शेयर पेज) पर 2 मिनट 100% के साथ निकासी के लिए योग्य होने के लिए।",
        ),
      ],
    },
    {
      icon: "⭐",
      title: t("Ratings and Reviews", "रेटिंग और समीक्षाएँ"),
      items: [
        t(
          "Users can rate and review vendors after the completion of services to help maintain quality and trust.",
          "उपयोगकर्ता गुणवत्ता और विश्वास बनाए रखने में मदद करने के लिए सेवाओं के पूरा होने के बाद विक्रेताओं को रेट और समीक्षा कर सकते हैं।",
        ),
      ],
    },
    {
      icon: "📝",
      title: t("Changes to This Policy", "इस नीति में बदलाव"),
      items: [
        t(
          "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.",
          "हम इस गोपनीयता नीति को समय-समय पर अपडेट कर सकते हैं। परिवर्तन इस पृष्ठ पर एक अद्यतन प्रभावी तिथि के साथ पोस्ट किए जाएंगे।",
        ),
      ],
    },
    {
      icon: "📧",
      title: t("Contact Us", "संपर्क करें"),
      items: [
        t(
          "For any questions about this policy, please contact us at",
          "इस नीति के बारे में किसी भी प्रश्न के लिए, हमसे संपर्क करें",
        ) + " support@aapkakaam.com",
      ],
    },
  ];

  return (
    <div className="privacy-modern">
      {/* Back Button */}
      <button className="privacy-back-btn" onClick={() => navigate(-1)}>
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

      <div className="privacy-container">
        {/* Decorative Elements */}
        <div className="privacy-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Header */}
        <div className="privacy-header">
          <div className="privacy-header-icon">🔒</div>
          <div className="privacy-header-content">
            <span className="privacy-badge">{t("PRIVACY POLICY", "गोपनीयता नीति")}</span>
            <h1>{t("Privacy Policy", "गोपनीयता नीति")}</h1>
            <p>
              <strong>{t("Effective Date:", "प्रभावी तिथि:")}</strong> June 11, 2025
            </p>
            <p className="privacy-intro">
              {t(
                "Aapkakaam.com respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your data when you use our website and mobile app.",
                "Aapkakaam.com आपकी गोपनीयता का सम्मान करता है और आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट और मोबाइल ऐप का उपयोग करते हैं तो हम आपके डेटा को कैसे एकत्र, उपयोग और साझा करते हैं।",
              )}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="privacy-sections">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`privacy-section ${activeSection === index ? "active" : ""}`}
              onClick={() => toggleSection(index)}
            >
              <div className="privacy-section-header">
                <span className="section-icon">{section.icon}</span>
                <h3>{section.title}</h3>
                <span className="section-toggle">{activeSection === index ? "−" : "+"}</span>
              </div>
              {activeSection === index && (
                <div className="privacy-section-content">
                  {section.items.map((item, i) => (
                    <div key={i} className="section-item">
                      <span className="item-bullet">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="privacy-footer">
          <span>
            © {new Date().getFullYear()} Uslugi Technology Pvt. Ltd. •{" "}
            {t("All Rights Reserved", "सभी अधिकार सुरक्षित")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

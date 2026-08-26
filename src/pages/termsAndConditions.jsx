// Modern Terms and Conditions Page - AapkaKaam

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./TermsAndConditions.css";

const TermsAndConditions = () => {
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
      title: t("Use of Service", "सेवा का उपयोग"),
      items: [
        t(
          "You agree to use the platform only for lawful purposes and not to misuse or disrupt the service.",
          "आप सहमत हैं कि आप प्लेटफ़ॉर्म का उपयोग केवल कानूनी उद्देश्यों के लिए करेंगे और सेवा का दुरुपयोग या व्यवधान नहीं करेंगे।",
        ),
      ],
    },
    {
      icon: "💰",
      title: t("Vendor Commission and Balance", "विक्रेता कमीशन और बैलेंस"),
      items: [
        t(
          "Vendors receive the first 5 service orders free. Thereafter, a commission ranging from ₹30 to ₹100 per order applies. No refunds will be issued for canceled orders. Vendors must maintain a sufficient balance to continue using our services. Failure to do so may result in suspension of vendor services. User will pay ₹10 from balance Amount. First 5 service booking is free because that required amount is given at signup. User will not get ₹10 of balance amount for Canceled orders by user-(who booked any service).",
          "विक्रेताओं को पहले 5 सेवा ऑर्डर मुफ्त मिलते हैं। उसके बाद, प्रति ऑर्डर ₹30 से ₹100 तक का कमीशन लागू होता है। रद्द किए गए ऑर्डर के लिए कोई रिफंड जारी नहीं किया जाएगा। विक्रेताओं को हमारी सेवाओं का उपयोग जारी रखने के लिए पर्याप्त बैलेंस बनाए रखना होगा। ऐसा करने में विफलता के परिणामस्वरूप विक्रेता सेवाएं निलंबित हो सकती हैं। उपयोगकर्ता बैलेंस राशि से ₹10 का भुगतान करेगा। पहली 5 सेवा बुकिंग मुफ्त है क्योंकि वह आवश्यक राशि साइनअप पर दी जाती है। उपयोगकर्ता द्वारा रद्द किए गए ऑर्डर के लिए उपयोगकर्ता को ₹10 की बैलेंस राशि नहीं मिलेगी।",
        ),
      ],
    },
    {
      icon: "🌟",
      title: t("Share & Earn Program", "शेयर और कमाएं कार्यक्रम"),
      items: [
        t(
          "Users or Vendors sharing referral links can earn between ₹1.5 and ₹5 or 5% of the commission the company receives from vendors on completed orders after the first 5 free orders. Canceled orders do not count towards referral earnings. Earnings may be affected due to discount given to vendors and users. It will be based on discounted percentage. Daily attendance is mandatory - 6 minutes total per day and 2 minutes on each three pages (Home Page, Share Page, View Share Page) with 100% to qualify for withdraw.",
          "संदर्भ लिंक साझा करने वाले उपयोगकर्ता या विक्रेता पहले 5 मुफ्त ऑर्डर के बाद पूर्ण ऑर्डर पर कंपनी को विक्रेताओं से मिलने वाले कमीशन का ₹1.5 से ₹5 या 5% तक कमा सकते हैं। रद्द किए गए ऑर्डर रेफरल कमाई में नहीं गिने जाते हैं। विक्रेताओं और उपयोगकर्ताओं को दी गई छूट के कारण कमाई प्रभावित हो सकती है। यह छूट प्रतिशत पर आधारित होगी। दैनिक उपस्थिति अनिवार्य है - प्रति दिन कुल 6 मिनट और तीन पृष्ठों (होम पेज, शेयर पेज, व्यू शेयर पेज) पर 2 मिनट 100% के साथ निकासी के लिए योग्य होने के लिए।",
        ),
      ],
    },
    {
      icon: "⭐",
      title: t("Ratings and Reviews", "रेटिंग और समीक्षाएँ"),
      items: [
        t(
          "Users are encouraged to rate and review vendors after service completion to help maintain the quality of the platform.",
          "उपयोगकर्ताओं को प्लेटफ़ॉर्म की गुणवत्ता बनाए रखने में मदद करने के लिए सेवा पूर्ण होने के बाद विक्रेताओं को रेट और समीक्षा करने के लिए प्रोत्साहित किया जाता है।",
        ),
      ],
    },
    {
      icon: "🖼️",
      title: t("User Profile Pictures", "उपयोगकर्ता प्रोफ़ाइल चित्र"),
      items: [
        t(
          "Users may upload profile pictures while using Aapkakaam.com or our app. Please ensure that your pictures comply with our content guidelines.",
          "उपयोगकर्ता Aapkakaam.com या हमारे ऐप का उपयोग करते समय प्रोफ़ाइल चित्र अपलोड कर सकते हैं। कृपया सुनिश्चित करें कि आपके चित्र हमारी सामग्री दिशानिर्देशों का पालन करते हैं।",
        ),
      ],
    },
    {
      icon: "📢",
      title: t("Advertising", "विज्ञापन"),
      items: [
        t(
          "We use advertising services such as Google AdSense, Adsterra, Monetag and AdMob to generate revenue. Your activity on the platform may be used to serve personalized ads.",
          "हम राजस्व उत्पन्न करने के लिए Google AdSense, Adsterra, Monetag और AdMob जैसी विज्ञापन सेवाओं का उपयोग करते हैं। प्लेटफ़ॉर्म पर आपकी गतिविधि का उपयोग व्यक्तिगत विज्ञापन दिखाने के लिए किया जा सकता है।",
        ),
      ],
    },
    {
      icon: "📱",
      title: t("Mobile Number Usage", "मोबाइल नंबर का उपयोग"),
      items: [
        t(
          "We use your registered mobile number to send important alerts and notifications via SMS.",
          "हम आपके पंजीकृत मोबाइल नंबर का उपयोग SMS के माध्यम से महत्वपूर्ण अलर्ट और सूचनाएं भेजने के लिए करते हैं।",
        ),
      ],
    },
    {
      icon: "📝",
      title: t("Modifications to Terms", "नियमों में संशोधन"),
      items: [
        t(
          "We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of the platform constitutes acceptance of those changes.",
          "हम किसी भी समय इन नियमों और शर्तों को संशोधित करने का अधिकार सुरक्षित रखते हैं। परिवर्तन इस पृष्ठ पर एक अद्यतन प्रभावी तिथि के साथ पोस्ट किए जाएंगे। प्लेटफ़ॉर्म का निरंतर उपयोग उन परिवर्तनों की स्वीकृति है।",
        ),
      ],
    },
    {
      icon: "⚖️",
      title: t("Limitation of Liability", "दायित्व की सीमा"),
      items: [
        t(
          "We shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the service.",
          "हम सेवा के उपयोग या उपयोग करने में असमर्थता से उत्पन्न होने वाली किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक या परिणामी क्षति के लिए उत्तरदायी नहीं होंगे।",
        ),
      ],
    },
    {
      icon: "📧",
      title: t("Contact", "संपर्क करें"),
      items: [
        t(
          "For questions or concerns regarding these terms, please contact us at",
          "इन नियमों के बारे में प्रश्नों या चिंताओं के लिए, कृपया हमसे संपर्क करें",
        ) + " support@aapkakaam.com",
      ],
    },
  ];

  return (
    <div className="terms-modern">
      {/* Back Button */}
      <button className="terms-back-btn" onClick={() => navigate(-1)}>
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

      <div className="terms-container">
        {/* Decorative Elements */}
        <div className="terms-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Header */}
        <div className="terms-header">
          <div className="terms-header-icon">📜</div>
          <div className="terms-header-content">
            <span className="terms-badge">{t("TERMS & CONDITIONS", "नियम और शर्तें")}</span>
            <h1>{t("Terms and Conditions", "नियम और शर्तें")}</h1>
            <p>
              <strong>{t("Effective Date:", "प्रभावी तिथि:")}</strong> June 11, 2025
            </p>
            <p className="terms-intro">
              {t(
                "By accessing or using Aapkakaam.com and our mobile app, you agree to be bound by these Terms and Conditions. Please read them carefully.",
                "Aapkakaam.com और हमारे मोबाइल ऐप का उपयोग करके, आप इन नियमों और शर्तों से बंधने के लिए सहमत होते हैं। कृपया उन्हें ध्यान से पढ़ें।",
              )}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="terms-sections">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`terms-section ${activeSection === index ? "active" : ""}`}
              onClick={() => toggleSection(index)}
            >
              <div className="terms-section-header">
                <span className="section-icon">{section.icon}</span>
                <h3>{section.title}</h3>
                <span className="section-toggle">{activeSection === index ? "−" : "+"}</span>
              </div>
              {activeSection === index && (
                <div className="terms-section-content">
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
        <div className="terms-footer">
          <span>
            © {new Date().getFullYear()} Uslugi Technology Pvt. Ltd. •{" "}
            {t("All Rights Reserved", "सभी अधिकार सुरक्षित")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

import "./Footer.css";
import appStore from "../../resources/img/appStore.jpg";
import playStore from "../../resources/img/playstore.jpg";
import facebook from "../../resources/svg/facebook-svgrepo-com.svg";
import linkedin from "../../resources/svg/linkedin-svgrepo-com.svg";
import insta from "../../resources/svg/instagram-svgrepo-com.svg";
import youtube from "../../resources/svg/youtube-168-svgrepo-com.svg";
import whatsapp from "../../resources/svg/whatsapp-svgrepo-com.svg";
import twitter from "../../resources/img/x.jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  const lang = useSelector((store) => store.category.selectLanguage);

  const whatsappGroupLink = "https://whatsapp.com/channel/0029VaiZeaiCHDyo3UOCvV1v";

  const handleWhatsAppClick = () => {
    window.open(whatsappGroupLink, "_blank", "noopener,noreferrer");
  };

  const socialLinks = [
    {
      icon: facebook,
      label: "Facebook",
      labelHi: "फेसबुक",
      url: "https://www.facebook.com/groups/807413335463061/?ref=share&mibextid=NSMWBT",
    },
    {
      icon: youtube,
      label: "YouTube",
      labelHi: "यूट्यूब",
      url: "https://youtube.com/@aapkakaam?si=WSUqqsDsOGhaanN1",
    },
    {
      icon: insta,
      label: "Instagram",
      labelHi: "इंस्टाग्राम",
      url: "https://www.instagram.com/aapkakaam?igsh=MTNvbDd2dm1kMnI0eg==",
    },
    {
      icon: linkedin,
      label: "LinkedIn",
      labelHi: "लिंक्डइन",
      url: "https://www.linkedin.com/groups/16537011",
    },
  ];

  // Hindi translations for footer sections
  const t = {
    about: {
      en: "ABOUT AAPKAKAAM",
      hi: "आपकाकाम के बारे में",
    },
    connect: {
      en: "CONNECT WITH US",
      hi: "हमसे जुड़ें",
    },
    app: {
      en: "EXPERIENCE APP",
      hi: "ऐप डाउनलोड करें",
    },
    links: {
      aboutUs: { en: "About Us", hi: "हमारे बारे में" },
      privacy: { en: "Privacy Policy", hi: "गोपनीयता नीति" },
      terms: { en: "Terms & Conditions", hi: "नियम और शर्तें" },
      faqs: { en: "FAQs", hi: "अक्सर पूछे जाने वाले प्रश्न" },
      feedback: { en: "Feedback", hi: "सुझाव दें" },
      contact: { en: "Contact Us", hi: "संपर्क करें" },
      advertise: { en: "Advertise with Us", hi: "हमारे साथ विज्ञापन दें" },
      connectLabel: { en: "Connect :", hi: "जुड़ें :" },
      copyright: {
        en: "Uslugi Technology Pvt. Ltd.",
        hi: "उसलुगी टेक्नोलॉजी प्राइवेट लिमिटेड",
      },
      appStore: { en: "App Store", hi: "ऐप स्टोर" },
      playStore: { en: "Play Store", hi: "प्ले स्टोर" },
    },
  };

  const isHindi = lang === "hin";

  return (
    <footer className="modern-footer">
      <div className="footer-grid">
        {/* About Section */}
        <div className="footer-column">
          <h4 className="footer-title">{isHindi ? t.about.hi : t.about.en}</h4>
          <ul className="footer-links">
            <li>
              <Link to="/aboutUs">{isHindi ? t.links.aboutUs.hi : t.links.aboutUs.en}</Link>
            </li>
            <li>
              <Link to="/privacy-policy">{isHindi ? t.links.privacy.hi : t.links.privacy.en}</Link>
            </li>
            <li>
              <Link to="/terms">{isHindi ? t.links.terms.hi : t.links.terms.en}</Link>
            </li>
            <li>
              <span>{isHindi ? t.links.faqs.hi : t.links.faqs.en}</span>
            </li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className="footer-column">
          <h4 className="footer-title">{isHindi ? t.connect.hi : t.connect.en}</h4>
          <ul className="footer-links">
            <li>
              <span>{isHindi ? t.links.feedback.hi : t.links.feedback.en}</span>
            </li>
            <li>
              <Link to="/contactUs">{isHindi ? t.links.contact.hi : t.links.contact.en}</Link>
            </li>
            <li>
              <span>{isHindi ? t.links.advertise.hi : t.links.advertise.en}</span>
            </li>
          </ul>
        </div>

        {/* App Section */}
        <div className="footer-column">
          <h4 className="footer-title">{isHindi ? t.app.hi : t.app.en}</h4>
          <div className="app-badges">
            <a
              href="#"
              className="app-badge"
              aria-label={isHindi ? t.links.appStore.hi : t.links.appStore.en}
            >
              <img src={appStore} alt={isHindi ? t.links.appStore.hi : t.links.appStore.en} />
            </a>
            <a
              href="#"
              className="app-badge"
              aria-label={isHindi ? t.links.playStore.hi : t.links.playStore.en}
            >
              <img src={playStore} alt={isHindi ? t.links.playStore.hi : t.links.playStore.en} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-copy">
            © {new Date().getFullYear()} {t.links.copyright.en}
          </div>

          <div className="footer-social">
            <span className="social-label">
              {isHindi ? t.links.connectLabel.hi : t.links.connectLabel.en}
            </span>
            {socialLinks.map((social, index) => (
              <button
                key={index}
                className="social-btn"
                onClick={() => window.open(social.url, "_blank")}
                aria-label={isHindi ? social.labelHi : social.label}
                title={isHindi ? social.labelHi : social.label}
              >
                <img src={social.icon} alt={isHindi ? social.labelHi : social.label} />
              </button>
            ))}
            <button
              className="social-btn whatsapp"
              onClick={handleWhatsAppClick}
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <img src={whatsapp} alt="WhatsApp" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

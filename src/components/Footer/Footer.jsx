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

export default function Footer() {
  const whatsappGroupLink = "https://whatsapp.com/channel/0029VaiZeaiCHDyo3UOCvV1v";

  const handleWhatsAppClick = () => {
    window.open(whatsappGroupLink, "_blank", "noopener,noreferrer");
  };

  const socialLinks = [
    {
      icon: facebook,
      label: "Facebook",
      url: "https://www.facebook.com/groups/807413335463061/?ref=share&mibextid=NSMWBT",
    },
    { icon: youtube, label: "YouTube", url: "https://youtube.com/@aapkakaam?si=WSUqqsDsOGhaanN1" },
    {
      icon: insta,
      label: "Instagram",
      url: "https://www.instagram.com/aapkakaam?igsh=MTNvbDd2dm1kMnI0eg==",
    },
    { icon: linkedin, label: "LinkedIn", url: "https://www.linkedin.com/groups/16537011" },
  ];

  return (
    <footer className="modern-footer">
      <div className="footer-grid">
        {/* About Section */}
        <div className="footer-column">
          <h4 className="footer-title">ABOUT AAPKAKAAM</h4>
          <ul className="footer-links">
            <li>
              <Link to="/aboutUs">About Us</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
            <li>
              <span>FAQs</span>
            </li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className="footer-column">
          <h4 className="footer-title">CONNECT WITH US</h4>
          <ul className="footer-links">
            <li>
              <span>Feedback</span>
            </li>
            <li>
              <Link to="/contactUs">Contact Us</Link>
            </li>
            <li>
              <span>Advertise with Us</span>
            </li>
          </ul>
        </div>

        {/* App Section */}
        <div className="footer-column">
          <h4 className="footer-title">EXPERIENCE APP</h4>
          <div className="app-badges">
            <a href="#" className="app-badge">
              <img src={appStore} alt="App Store" />
            </a>
            <a href="#" className="app-badge">
              <img src={playStore} alt="Play Store" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-copy">
            © {new Date().getFullYear()} Uslugi Technology Pvt. Ltd.
          </div>

          <div className="footer-social">
            <span className="social-label">Connect :</span>
            {socialLinks.map((social, index) => (
              <button
                key={index}
                className="social-btn"
                onClick={() => window.open(social.url, "_blank")}
                aria-label={social.label}
              >
                <img src={social.icon} alt={social.label} />
              </button>
            ))}
            <button
              className="social-btn whatsapp"
              onClick={handleWhatsAppClick}
              aria-label="WhatsApp"
            >
              <img src={whatsapp} alt="WhatsApp" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

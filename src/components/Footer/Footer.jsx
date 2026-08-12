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
  // Add your WhatsApp group link here
  const whatsappGroupLink =
    "https://whatsapp.com/channel/0029VaiZeaiCHDyo3UOCvV1v";

  const handleWhatsAppClick = () => {
    // Open WhatsApp group link in new tab
    window.open(whatsappGroupLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="footer-div">
      <div className="footer-div1st">
        {" "}
        <div>
          <div className="title">ABOUT AAPKAKAAM</div>
          <div className="title_child">
            <div>
              <Link to="/aboutUs">About Us</Link>
            </div>
            <div>
              {" "}
              <Link to="/privacy-policy">Privacy Policy</Link> |{" "}
            </div>
            <div>
              {" "}
              <Link to="/terms">Terms & Conditions</Link>
            </div>
            <div>FAQs</div>
          </div>
        </div>
        <div>
          <div className="title">CONNECT WITH US</div>
          <div className="title_child">
            <div>Feedback</div>
            <div>
              <Link to="/contactUs">Contact Us</Link>
            </div>
            <div>Advertise with Us</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="title">EXPERIENCE AAPKAKAAM APP</div>
          <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <div style={{ cursor: "pointer" }}>
              <img src={appStore} alt="logo" style={{ width: "50px" }} />
            </div>
            <div style={{ cursor: "pointer" }}>
              <img src={playStore} alt="logo" style={{ width: "50px" }} />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)", width: "100vw" }}
      >
        <div className="footer-div2nd">
          <div className="copyRight">
            © {new Date().getFullYear()} Uslugi Technology Pvt. Ltd.
          </div>
          <div></div>
          <div className="connect">
            <div
              className="title"
              style={{ color: "#24272c", fontSize: "1.5rem" }}
            >
              Connect :
            </div>
            <img
              src={facebook}
              alt="facebook"
              style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
              onClick={() =>
                window.open(
                  "https://www.facebook.com/groups/807413335463061/?ref=share&mibextid=NSMWBT",
                  "_blank"
                )
              }
            />

            <img
              src={youtube}
              alt="youtube"
              style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
              onClick={() =>
                window.open(
                  "https://youtube.com/@aapkakaam?si=WSUqqsDsOGhaanN1",
                  "_blank"
                )
              }
            />
            <img
              src={insta}
              alt="insta"
              style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
              onClick={() =>
                window.open(
                  "https://www.instagram.com/aapkakaam?igsh=MTNvbDd2dm1kMnI0eg==",
                  "_blank"
                )
              }
            />
            <img
              src={linkedin}
              alt="linkedin"
              style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/groups/16537011",
                  "_blank"
                )
              }
            />
            <img
              src={whatsapp}
              alt="whatsapp"
              style={{ width: "2rem", height: "2rem", cursor: "pointer" }}
              onClick={handleWhatsAppClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../utils/categoryslice";
import "./category.css";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";

const RightArrowIcon = () => (
  <svg
    className="right-arrow"
    fill="none"
    strokeWidth={2.5}
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
    />
  </svg>
);

export default function Category() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { cd, id } = useParams();

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  const handleLogin = (userType) => {
    dispatch(setCategory(userType));
    localStorage.setItem("category", userType);
    navigate("/login", {
      state: {
        category: userType,
        cd,
        id,
        // Pass the selected service data if it exists
        selectedService: location.state?.selectedService || null,
        categoryName: location.state?.category || null,
      },
    });
  };

  const loginOptions = [
    {
      label: "Continue As a User",
      labelHindi: "यूजर के रूप में जारी रखें",
      type: "user",
      icon: "👤",
      description: "Book services & find professionals",
      descriptionHindi: "सेवाएँ बुक करें और प्रोफेशनल खोजें",
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Continue As a Vendor",
      labelHindi: "वेंडर के रूप में जारी रखें",
      type: "vendor",
      icon: "🔧",
      description: "Offer services & grow your business",
      descriptionHindi: "सेवाएँ दें और अपना व्यवसाय बढ़ाएँ",
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
  ];

  // Check if there's a selected service from navigation state
  const selectedService = location.state?.selectedService;
  const categoryName = location.state?.category;

  return (
    <div className="category-modern">
      <AdsterraBanner_320x50 />

      <div className="category-modern-container">
        {/* Header */}
        <div className="category-modern-header">
          <div className="category-modern-badge">
            {lang === "hin" ? "🔐 स्वागत है" : "🔐 WELCOME"}
          </div>
          <h1>
            {lang === "hin" ? "अपनी" : "Choose Your"}{" "}
            <span className="highlight">{lang === "hin" ? "भूमिका" : "Role"}</span>{" "}
            {lang === "hin" ? "चुनें" : ""}
          </h1>
          <p>
            {lang === "hin"
              ? "Aapkakaam का उपयोग कैसे करना चाहते हैं, चुनें"
              : "Select how you want to use Aapkakaam"}
          </p>

          {categoryName && !selectedService && (
            <div className="category-selected-service">
              <span>📂</span>
              <div>
                <strong>{categoryName}</strong>
                <small>श्रेणी</small>
              </div>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="category-modern-grid">
          {loginOptions.map((option) => (
            <div
              key={option.type}
              className="category-modern-card"
              onClick={() => handleLogin(option.type)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleLogin(option.type)}
              style={{
                "--card-color": option.color,
                "--card-bg": option.bg,
              }}
            >
              <div className="card-icon-wrapper" style={{ background: option.bg }}>
                <span className="card-icon">{option.icon}</span>
              </div>

              <div className="card-content">
                <h3>{lang === "hin" ? option.labelHindi : option.label}</h3>
                <p>{lang === "hin" ? option.descriptionHindi : option.description}</p>
              </div>

              <div className="card-arrow">
                <RightArrowIcon />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdsterraBanner />
    </div>
  );
}

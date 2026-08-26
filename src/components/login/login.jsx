// Modern Login Page - AapkaKaam

import { useLocation, useNavigate } from "react-router";
import "./login.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import eye from "../../resources/svg/eye-svgrepo-com.svg";
import line from "../../resources/svg/line-svgrepo-com.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addDataUser } from "../../utils/userslice";
import { SERVER_URL } from "../../utils/base";
import { addDataVendor } from "../../utils/vendorslice";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showSuccess, showError } from "../showAlert";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  // State management
  const [formData, setFormData] = useState({
    phoneNo: "",
    pass: "",
  });
  const [uiState, setUiState] = useState({
    isEyeClicked: false,
    isPhoneNoEmpty: true,
    isPassEmpty: true,
    isLoading: false,
  });
  const [messages, setMessages] = useState({
    err: "",
    success: "",
  });

  // Memoized values from location state
  const { category, cd, id } = useMemo(() => location.state || {}, [location.state]);
  const profileCategory = useMemo(
    () => (category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : ""),
    [category],
  );

  // Derived values
  const address = useMemo(() => {
    if (!category) return null;
    const storedData = JSON.parse(localStorage.getItem(category));
    return storedData?.address;
  }, [category]);

  // Effect hooks
  useEffect(() => {
    setUiState((prev) => ({
      ...prev,
      isPhoneNoEmpty: formData.phoneNo.length > 0,
    }));
  }, [formData.phoneNo]);

  useEffect(() => {
    setUiState((prev) => ({ ...prev, isPassEmpty: formData.pass.length > 0 }));
  }, [formData.pass]);

  // Handlers
  const showMessage = useCallback((type, message, duration = 3000) => {
    setMessages((prev) => ({ ...prev, [type]: message }));
    setTimeout(() => {
      setMessages((prev) => ({ ...prev, [type]: "" }));
    }, duration);
  });

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleLogin = useCallback(async () => {
    if (!formData.phoneNo) {
      setUiState((prev) => ({ ...prev, isPhoneNoEmpty: false }));
      return;
    }
    if (!formData.pass) {
      setUiState((prev) => ({ ...prev, isPassEmpty: false }));
      return;
    }
    if (!navigator.onLine) {
      showMessage("err", lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
      return;
    }

    setUiState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await axios.post(`${SERVER_URL}/${category}/login`, {
        phoneNo: formData.phoneNo,
        password: formData.pass,
      });
      showSuccess(response.data.message);
      localStorage.setItem(category, JSON.stringify(response.data));

      setTimeout(() => {
        navigate("/");
        if (category === "user") {
          dispatch(addDataUser(response.data));
        } else if (category === "vendor") {
          dispatch(addDataVendor(response.data));
        }
      }, 2000);
    } catch (error) {
      showError(error.response?.data?.message || (lang === "hin" ? "लॉगिन विफल" : "Login failed"));
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [formData.phoneNo, formData.pass, category, dispatch, navigate, showMessage, lang]);

  const handlePasswordChange = useCallback(() => {
    navigate("/editPhoneEmail", { state: { editType: "pass" } });
  }, [navigate]);

  const handleSignup = useCallback(() => {
    navigate("/signup", { state: { category, cd, id } });
  }, [navigate, category, cd, id]);

  const handleEyeClicked = useCallback(() => {
    setUiState((prev) => ({ ...prev, isEyeClicked: !prev.isEyeClicked }));
  }, []);

  // Early return if category is not available
  if (!category) {
    return (
      <div className="login-modern">
        <div className="login-error">
          {lang === "hin"
            ? "अमान्य पहुँच। कृपया सही नेविगेशन से पुनः प्रयास करें।"
            : "Invalid access. Please try again from proper navigation."}
        </div>
      </div>
    );
  }

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="login-modern">
        <div className="login-modern-container">
          {/* Decorative Elements */}
          <div className="login-decoration">
            <div className="deco-circle c1"></div>
            <div className="deco-circle c2"></div>
            <div className="deco-circle c3"></div>
          </div>

          {/* Header */}
          <div className="login-header">
            <div className="login-badge">{lang === "hin" ? "🔐 स्वागत है" : "🔐 WELCOME BACK"}</div>
            <h1>
              {lang === "hin" ? "लॉगिन करें" : "Login to"}{" "}
              <span className="highlight">{profileCategory}</span>
            </h1>
            <p>
              {lang === "hin"
                ? "अपने खाते में लॉगिन करें और सेवाएँ बुक करें"
                : "Login to your account and book services"}
            </p>
          </div>

          {/* Login Form */}
          <div className="login-form">
            {/* Phone Number Input */}
            <div className="form-group">
              <label>{lang === "hin" ? "📱 मोबाइल नंबर" : "📱 Mobile Number"}</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  placeholder={lang === "hin" ? "मोबाइल नंबर दर्ज करें" : "Enter mobile number"}
                  value={formData.phoneNo}
                  onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                  // className={!uiState.isPhoneNoEmpty ? "error" : ""}
                  maxLength="10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label>{lang === "hin" ? "🔒 पासवर्ड" : "🔒 Password"}</label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={uiState.isEyeClicked ? "text" : "password"}
                  placeholder={lang === "hin" ? "पासवर्ड दर्ज करें" : "Enter password"}
                  value={formData.pass}
                  onChange={(e) => handleInputChange("pass", e.target.value)}
                  // className={!uiState.isPassEmpty ? "error" : ""}
                />
                <button
                  className="eye-toggle"
                  onClick={handleEyeClicked}
                  type="button"
                  aria-label={uiState.isEyeClicked ? "Hide password" : "Show password"}
                >
                  <img src={eye} alt="Toggle password" />
                  {uiState.isEyeClicked && <img src={line} alt="" className="eye-line" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button className="login-btn" onClick={handleLogin} disabled={uiState.isLoading}>
              {uiState.isLoading ? (
                <span className="loader"></span>
              ) : (
                <span>
                  {lang === "hin" ? "लॉगिन करें" : "Login"}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </button>

            {/* Forgot Password */}
            <div className="forgot-password" onClick={handlePasswordChange}>
              <span>{lang === "hin" ? "🔑 पासवर्ड भूल गए?" : "🔑 Forgot Password?"}</span>
            </div>

            {/* Signup Link */}
            <div className="signup-link">
              <span>{lang === "hin" ? "खाता नहीं है?" : "Don't have an account?"}</span>
              <button onClick={handleSignup}>{lang === "hin" ? "साइनअप करें" : "Signup"} →</button>
            </div>
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
}

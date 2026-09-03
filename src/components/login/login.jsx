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

  // ============================================================
  // LANGUAGE
  // ============================================================

  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const isHindi = lang === "hin";

  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    phoneNo: "",
    pass: "",
  });

  // ============================================================
  // UI STATE
  // ============================================================

  const [uiState, setUiState] = useState({
    isEyeClicked: false,
    isPhoneNoEmpty: true,
    isPassEmpty: true,
    isLoading: false,
  });

  // ============================================================
  // MESSAGES
  // ============================================================

  const [messages, setMessages] = useState({
    err: "",
    success: "",
  });

  // ============================================================
  // LOCATION DATA
  // ============================================================
  // Add this after the isHindi declaration
  const _t = useCallback(
    (en, hin) => {
      return isHindi ? hin : en;
    },
    [isHindi],
  );

  const { category, cd, id } = useMemo(() => location.state || {}, [location.state]);

  const profileCategory = useMemo(
    () => (category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : ""),
    [category],
  );

  // ============================================================
  // ADDRESS
  // ============================================================

  const address = useMemo(() => {
    if (!category) return null;

    try {
      const storedData = JSON.parse(localStorage.getItem(category));

      return storedData?.address;
    } catch (error) {
      console.error("Unable to read stored address:", error);
      return null;
    }
  }, [category]);

  // ============================================================
  // PHONE NUMBER
  // ============================================================

  /*
   * This is the phone number that will be passed to
   * AppDownloadPrompt.
   *
   * We use the login form phone number because login has
   * already been successful.
   */
  const loggedInPhoneNo = useMemo(() => {
    return formData.phoneNo?.trim() || "";
  }, [formData.phoneNo]);

  // ============================================================
  // INPUT VALIDATION
  // ============================================================

  useEffect(() => {
    setUiState((prev) => ({
      ...prev,
      isPhoneNoEmpty: formData.phoneNo.length > 0,
    }));
  }, [formData.phoneNo]);

  useEffect(() => {
    setUiState((prev) => ({
      ...prev,
      isPassEmpty: formData.pass.length > 0,
    }));
  }, [formData.pass]);

  // ============================================================
  // SHOW MESSAGE
  // ============================================================

  const showMessage = useCallback((type, message, duration = 3000) => {
    setMessages((prev) => ({
      ...prev,
      [type]: message,
    }));

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [type]: "",
      }));
    }, duration);
  }, []);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = useCallback(async () => {
    // ----------------------------------------------------------
    // Phone validation
    // ----------------------------------------------------------

    if (!formData.phoneNo) {
      setUiState((prev) => ({
        ...prev,
        isPhoneNoEmpty: false,
      }));

      showError(_t("Please enter your mobile number", "कृपया अपना मोबाइल नंबर दर्ज करें"));
      return;
    }

    // ----------------------------------------------------------
    // Phone number length validation (10 digits)
    // ----------------------------------------------------------

    if (formData.phoneNo.length !== 10) {
      setUiState((prev) => ({
        ...prev,
        isPhoneNoEmpty: false,
      }));

      showError(
        _t(
          "Please enter a valid 10-digit mobile number",
          "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें",
        ),
      );
      return;
    }

    // ----------------------------------------------------------
    // Phone number numeric validation
    // ----------------------------------------------------------

    if (!/^\d+$/.test(formData.phoneNo)) {
      setUiState((prev) => ({
        ...prev,
        isPhoneNoEmpty: false,
      }));

      showError(
        _t("Mobile number must contain only digits", "मोबाइल नंबर में केवल अंक होने चाहिए"),
      );
      return;
    }

    // ----------------------------------------------------------
    // Password validation
    // ----------------------------------------------------------

    if (!formData.pass) {
      setUiState((prev) => ({
        ...prev,
        isPassEmpty: false,
      }));

      showError(_t("Please enter your password", "कृपया अपना पासवर्ड दर्ज करें"));
      return;
    }

    // ----------------------------------------------------------
    // Password length validation (minimum 6 characters)
    // ----------------------------------------------------------

    if (formData.pass.length < 6) {
      setUiState((prev) => ({
        ...prev,
        isPassEmpty: false,
      }));

      showError(
        _t("Password must be at least 6 characters", "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"),
      );
      return;
    }

    // ----------------------------------------------------------
    // Internet check
    // ----------------------------------------------------------

    if (!navigator.onLine) {
      showError(_t("You are offline", "आप ऑफलाइन हैं"));
      return;
    }

    // ----------------------------------------------------------
    // Loading
    // ----------------------------------------------------------

    setUiState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      // --------------------------------------------------------
      // LOGIN API
      // --------------------------------------------------------

      const response = await axios.post(`${SERVER_URL}/${category}/login`, {
        phoneNo: formData.phoneNo,
        password: formData.pass,
      });

      // --------------------------------------------------------
      // LOGIN SUCCESS
      // --------------------------------------------------------

      showSuccess(response.data.message);

      // --------------------------------------------------------
      // SAVE USER/VENDOR DATA
      // --------------------------------------------------------

      localStorage.setItem(category, JSON.stringify(response.data));

      // --------------------------------------------------------
      // DISPATCH USER/VENDOR DATA
      // --------------------------------------------------------

      if (category === "user") {
        dispatch(addDataUser(response.data));
      } else if (category === "vendor") {
        dispatch(addDataVendor(response.data));
      }

      // --------------------------------------------------------
      // NAVIGATION
      // --------------------------------------------------------

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("Login error:", error);

      showError(error.response?.data?.message || _t("Login failed", "लॉगिन विफल"));
    } finally {
      setUiState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [
    formData.phoneNo,
    formData.pass,
    category,
    dispatch,
    navigate,
    showError,
    showSuccess,
    isHindi,
  ]);
  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  const handlePasswordChange = useCallback(() => {
    navigate("/editPhoneEmail", {
      state: {
        editType: "pass",
      },
    });
  }, [navigate]);

  // ============================================================
  // SIGNUP
  // ============================================================

  const handleSignup = useCallback(() => {
    navigate("/signup", {
      state: {
        category,
        cd,
        id,
      },
    });
  }, [navigate, category, cd, id]);

  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  const handleEyeClicked = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      isEyeClicked: !prev.isEyeClicked,
    }));
  }, []);

  // ============================================================
  // INVALID CATEGORY
  // ============================================================

  if (!category) {
    return (
      <div className="login-modern">
        <div className="login-error">
          {isHindi
            ? "अमान्य पहुँच। कृपया सही नेविगेशन से पुनः प्रयास करें।"
            : "Invalid access. Please try again from proper navigation."}
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <AdsterraBanner_320x50 />

      <div className="login-modern">
        <div className="login-modern-container">
          {/* ====================================================
              DECORATIVE ELEMENTS
              ==================================================== */}

          <div className="login-decoration">
            <div className="deco-circle c1"></div>
            <div className="deco-circle c2"></div>
            <div className="deco-circle c3"></div>
          </div>

          {/* ====================================================
              HEADER
              ==================================================== */}

          <div className="login-header">
            <div className="login-badge">{isHindi ? "🔐 स्वागत है" : "🔐 WELCOME BACK"}</div>

            <h1>
              {isHindi ? "लॉगिन करें" : "Login to"}{" "}
              <span className="highlight">
                {profileCategory == "Vendor" ? "Service Provider" : profileCategory}
              </span>
            </h1>

            <p>
              {isHindi
                ? "अपने खाते में लॉगिन करें और सेवाएँ बुक करें"
                : "Login to your account and book services"}
            </p>
          </div>

          {/* ====================================================
              LOGIN FORM
              ==================================================== */}

          <div className="login-form">
            {/* ==================================================
                PHONE
                ================================================== */}

            <div className="form-group">
              <label>{isHindi ? "📱 मोबाइल नंबर" : "📱 Mobile Number"}</label>

              <div className="input-wrapper">
                <input
                  type="tel"
                  placeholder={isHindi ? "मोबाइल नंबर दर्ज करें" : "Enter mobile number"}
                  value={formData.phoneNo}
                  onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                  maxLength="10"
                />
              </div>
            </div>

            {/* ==================================================
                PASSWORD
                ================================================== */}

            <div className="form-group">
              <label>{isHindi ? "🔒 पासवर्ड" : "🔒 Password"}</label>

              <div className="input-wrapper password-wrapper">
                <input
                  type={uiState.isEyeClicked ? "text" : "password"}
                  placeholder={isHindi ? "पासवर्ड दर्ज करें" : "Enter password"}
                  value={formData.pass}
                  onChange={(e) => handleInputChange("pass", e.target.value)}
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

            {/* ==================================================
                LOGIN BUTTON
                ================================================== */}

            {/* Login Button */}
            <button
              className={`login-btn ${uiState.isLoading ? "login-btn-loading" : ""}`}
              onClick={handleLogin}
              disabled={uiState.isLoading}
              type="button"
            >
              {uiState.isLoading ? (
                <>
                  <span className="signup-loader" />

                  <span>{isHindi ? "लॉगिन हो रहा है..." : "Logging in..."}</span>
                </>
              ) : (
                <>
                  <span>{isHindi ? "लॉगिन करें" : "Login"}</span>

                  <svg
                    className="login-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            {/* ==================================================
                FORGOT PASSWORD
                ================================================== */}

            <div className="forgot-password" onClick={handlePasswordChange}>
              <span>{isHindi ? "🔑 पासवर्ड भूल गए?" : "🔑 Forgot Password?"}</span>
            </div>

            {/* ==================================================
                SIGNUP
                ================================================== */}

            <div className="signup-link">
              <span>{isHindi ? "खाता नहीं है?" : "Don't have an account?"}</span>

              <button onClick={handleSignup}>{isHindi ? "साइनअप करें" : "Signup"} →</button>
            </div>
          </div>
        </div>
      </div>

      <AdsterraBanner />
    </>
  );
}

// Modern SignUp Page - AapkaKaam (with English & Hindi Job Types)

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import "./signup.css";
import eye from "../../resources/svg/eye-svgrepo-com.svg";
import line from "../../resources/svg/line-svgrepo-com.svg";
import rightTck from "../../resources/svg/sign-check-svgrepo-com.svg";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { useDispatch, useSelector } from "react-redux";
import { setValidEmailId, setValidPhoneNoId } from "../../utils/categoryslice";

import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showError, showSuccess } from "../showAlert";
import serviceData from "../../data/serviceData";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  // State management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    otp: "",
    pass: "",
    rePass: "",
    job: "",
    gender: "",
    experience: "",
  });

  const [validation, setValidation] = useState({
    isPassValid: true,
    isNumValid: true,
    isNameEmpty: true,
    isRePassMatch: true,
    isGender: true,
    isValidPass: true,
  });

  const [agreed, setAgreed] = useState(false);

  const [uiState, setUiState] = useState({
    isLoading: false,
    isPhoneOtpLoading: false,
    isOtpSent: false,
    isEyeClicked: false,
    verifyPhoneNo: false,
  });

  const [messages, setMessages] = useState({
    err: "",
    success: "",
  });

  const [otpId, setOtpId] = useState("");
  const validPhoneNoId = useSelector((state) => state.category.validPhoneNoId);

  // Derived values
  const { category, cd, id } = useMemo(() => location.state || {}, [location.state]);
  const profileCategory = useMemo(
    () => (category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : ""),
    [category],
  );

  // Effect hooks for validation
  useEffect(() => {
    setValidation((prev) => ({ ...prev, isPassValid: true }));
  }, [formData.pass]);

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      isNameEmpty: formData.name.length > 0,
    }));
  }, [formData.name]);

  useEffect(() => {
    setValidation((prev) => ({ ...prev, isRePassMatch: true }));
  }, [formData.rePass]);

  useEffect(() => {
    setValidation((prev) => ({ ...prev, isNumValid: true }));
  }, [formData.phoneNo]);

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      isGender: formData.gender.length > 0,
    }));
  }, [formData.gender]);

  useEffect(() => {
    setMessages((prev) => ({ ...prev, err: "" }));
  }, [formData.otp]);

  // Helper functions
  const showMessage = useCallback((type, message, duration = 2000) => {
    setMessages((prev) => ({ ...prev, [type]: message }));
    setTimeout(() => {
      setMessages((prev) => ({ ...prev, [type]: "" }));
    }, duration);
  });

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // API handlers
  const handlePhoneVerify = useCallback(async () => {
    if (!navigator.onLine) {
      showMessage("err", lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
      return;
    }

    if (!uiState.isOtpSent) {
      if (!/^\d{10}$/.test(formData.phoneNo)) {
        showMessage(
          "err",
          lang === "hin" ? "मोबाइल नंबर 10 अंकों का होना चाहिए" : "Mobile Number must be 10 digits",
        );
        return;
      }

      setUiState((prev) => ({ ...prev, isPhoneOtpLoading: true }));

      try {
        const res = await axios.post(`${SERVER_URL}/${category}/phoneVerification`, {
          phoneNo: formData.phoneNo,
        });
        if (res.data.verified) {
          setOtpId(res.data.otpId);
          dispatch(setValidPhoneNoId(res.data.otpId));
          setUiState((prev) => ({
            ...prev,
            isOtpSent: true,
            isPhoneOtpLoading: false,
          }));
          showMessage("success", res.data.message, 2000);
        } else {
          showMessage("err", res.data.message, 15000);
        }
      } catch (error) {
        showMessage(
          "err",
          error.response?.data?.message ||
            (lang === "hin" ? "फोन वेरिफिकेशन विफल" : "Phone verification failed"),
        );
      } finally {
        setUiState((prev) => ({ ...prev, isPhoneOtpLoading: false }));
      }
    } else {
      setUiState((prev) => ({ ...prev, isPhoneOtpLoading: true }));

      try {
        const res = await axios.post(`${SERVER_URL}/${category}/otpVerification`, {
          otp: formData.otp,
          otpId,
        });
        if (res.data.verified) {
          setUiState((prev) => ({
            ...prev,
            verifyPhoneNo: true,
            isOtpSent: false,
            isPhoneOtpLoading: false,
          }));
          showMessage(
            "success",
            lang === "hin" ? "OTP सफलतापूर्वक वेरिफाइड" : "OTP verified successfully",
            2000,
          );
        } else {
          showMessage(
            "err",
            res.data.message ||
              (lang === "hin" ? "OTP वेरिफिकेशन विफल" : "OTP verification failed"),
          );
        }
      } catch (error) {
        showMessage(
          "err",
          error.response?.data?.message ||
            (lang === "hin" ? "OTP वेरिफिकेशन विफल" : "OTP verification failed"),
        );
      } finally {
        setUiState((prev) => ({ ...prev, isPhoneOtpLoading: false }));
      }
    }
  }, [
    formData.phoneNo,
    formData.otp,
    otpId,
    category,
    dispatch,
    uiState.isOtpSent,
    showMessage,
    lang,
  ]);

  const handleSignup = useCallback(async () => {
    // Validation checks
    if (!formData.name) {
      setValidation((prev) => ({ ...prev, isNameEmpty: false }));
      return;
    }
    if (formData.phoneNo.length !== 10) {
      setValidation((prev) => ({ ...prev, isNumValid: false }));
      return;
    }
    if (formData.pass.length <= 5) {
      setValidation((prev) => ({
        ...prev,
        isPassValid: false,
        isValidPass: false,
      }));
      return;
    }
    if (formData.pass !== formData.rePass) {
      setValidation((prev) => ({ ...prev, isRePassMatch: false }));
      return;
    }
    if (!formData.gender) {
      setValidation((prev) => ({ ...prev, isGender: false }));
      return;
    }
    if (!navigator.onLine) {
      showMessage("err", lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
      return;
    }
    if (!agreed) {
      showMessage(
        "err",
        lang === "hin"
          ? "आपको नियम एवं शर्तें और गोपनीयता नीति स्वीकार करनी होगी"
          : "You must accept the Terms & Conditions and Privacy Policy",
      );
      return;
    }
    if (!uiState.verifyPhoneNo) {
      showMessage(
        "err",
        lang === "hin"
          ? "कृपया पहले अपना मोबाइल नंबर वेरिफाई करें"
          : "Please verify your mobile number first",
      );
      return;
    }
    setUiState((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await axios.post(`${SERVER_URL}/${category}/signup`, {
        name: formData.name,
        phoneNo: formData.phoneNo,
        password: formData.pass,
        sharedBy: id,
        gender: formData.gender,
        type: formData.job,
        experience: formData.experience,
        cd,
        validPhoneNoId,
        agreedToTnCnP: agreed,
      });

      showMessage("success", result.data.message, 2000);
      setTimeout(() => {
        navigate("/login", { state: { category } });
      }, 2000);
    } catch (err) {
      showMessage(
        "err",
        err.response?.data?.message || (lang === "hin" ? "साइनअप विफल" : "Signup failed"),
      );
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [
    formData,
    category,
    id,
    cd,
    validPhoneNoId,
    navigate,
    showMessage,
    lang,
    agreed,
    uiState.verifyPhoneNo,
  ]);

  // Navigation handlers
  const handleLogin = useCallback(() => {
    navigate("/login", { state: { category } });
  }, [navigate, category]);

  const handleEyeClicked = useCallback(() => {
    setUiState((prev) => ({ ...prev, isEyeClicked: !prev.isEyeClicked }));
  }, []);

  // Early return if category is missing
  if (!category) {
    return (
      <div className="signup-modern">
        <div className="signup-error">
          {lang === "hin"
            ? "अमान्य पहुँच। कृपया सही नेविगेशन से पुनः प्रयास करें।"
            : "Invalid access. Please try again from proper navigation."}
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (messages.err) {
      showError(messages.err);
    } else if (messages.success) {
      showSuccess(messages.success);
    }
  }, [messages.err, messages.success]);

  // Get all services with Hindi names from serviceData
  const allServices = useMemo(() => {
    return serviceData.flatMap((category) =>
      category.services.map((service) => ({
        value: service.jobType,
        label: service.title,
        labelHindi: service.hindi || service.title,
        category: category.heading,
        headingHindi: category.headingHindi || category.heading,
      })),
    );
  }, []);

  // Group services by category for better organization
  const groupedServices = useMemo(() => {
    const groups = {};
    allServices.forEach((service) => {
      const key = lang === "hin" ? service.headingHindi : service.category;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(service);
    });
    return groups;
  }, [allServices, lang]);

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="signup-modern">
        <div className="signup-modern-container">
          {/* Decorative Elements */}
          <div className="signup-decoration">
            <div className="deco-circle c1"></div>
            <div className="deco-circle c2"></div>
            <div className="deco-circle c3"></div>
          </div>

          {/* Header */}
          <div className="signup-header">
            <div className="signup-badge">{lang === "hin" ? "✨ नया खाता" : "✨ NEW ACCOUNT"}</div>
            <h1>
              {lang === "hin" ? "साइनअप करें" : "Signup as"}{" "}
              <span className="highlight">{profileCategory}</span>
            </h1>
            <p>
              {lang === "hin"
                ? "अपना खाता बनाएं और सेवाएँ शुरू करें"
                : "Create your account and get started"}
            </p>
          </div>

          {/* Form */}
          <div className="signup-form">
            {/* Name Input */}
            <div className="form-group">
              <label>{lang === "hin" ? "👤 पूरा नाम" : "👤 Full Name"}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder={lang === "hin" ? "पूरा नाम दर्ज करें" : "Enter full name"}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  // className={!validation.isNameEmpty ? "error" : ""}
                />
              </div>
            </div>

            {/* Phone Verification */}
            <div className="form-group">
              <label>{lang === "hin" ? "📱 मोबाइल नंबर" : "📱 Mobile Number"}</label>
              <div className="input-wrapper phone-wrapper">
                {uiState.isOtpSent ? (
                  <input
                    type="text"
                    placeholder={lang === "hin" ? "OTP दर्ज करें" : "Enter OTP"}
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value)}
                    className="otp-input"
                  />
                ) : (
                  <input
                    type="tel"
                    placeholder={lang === "hin" ? "मोबाइल नंबर दर्ज करें" : "Enter mobile number"}
                    value={formData.phoneNo}
                    readOnly={uiState.verifyPhoneNo}
                    onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                    className={!validation.isNumValid ? "error" : ""}
                    maxLength="10"
                  />
                )}

                {uiState.verifyPhoneNo && (
                  <div className="verified-badge">
                    <img src={rightTck} alt="Verified" />
                  </div>
                )}

                {formData.phoneNo.length === 10 && !uiState.verifyPhoneNo && (
                  <button
                    className="verify-btn-modern"
                    onClick={handlePhoneVerify}
                    type="button"
                    disabled={uiState.isPhoneOtpLoading}
                  >
                    {uiState.isPhoneOtpLoading ? (
                      <span className="loader-small"></span>
                    ) : uiState.isOtpSent ? (
                      lang === "hin" ? (
                        "OTP वेरिफाई करें"
                      ) : (
                        "Verify OTP"
                      )
                    ) : lang === "hin" ? (
                      "वेरिफाई करें"
                    ) : (
                      "Verify"
                    )}
                  </button>
                )}

                {!validation.isNumValid && (
                  <span className="input-error">
                    ⚠️ {lang === "hin" ? "10 अंकों का नंबर दर्ज करें" : "Enter 10 digit number"}
                  </span>
                )}
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
                  className={!validation.isPassValid ? "error" : ""}
                />
                <button className="eye-toggle" onClick={handleEyeClicked} type="button">
                  <img src={eye} alt="Toggle password" />
                  {uiState.isEyeClicked && <img src={line} alt="" className="eye-line" />}
                </button>
                {!validation.isValidPass && (
                  <span className="input-error">
                    ⚠️{" "}
                    {lang === "hin"
                      ? "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"
                      : "Password must be at least 6 characters"}
                  </span>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>{lang === "hin" ? "🔐 पासवर्ड दोबारा" : "🔐 Confirm Password"}</label>
              <div className="input-wrapper">
                <input
                  type={uiState.isEyeClicked ? "text" : "password"}
                  placeholder={lang === "hin" ? "पासवर्ड दोबारा दर्ज करें" : "Re-enter password"}
                  value={formData.rePass}
                  onChange={(e) => handleInputChange("rePass", e.target.value)}
                  className={!validation.isRePassMatch ? "error" : ""}
                />
                {!validation.isRePassMatch && (
                  <span className="input-error">
                    ⚠️ {lang === "hin" ? "पासवर्ड मैच नहीं हो रहा" : "Passwords do not match"}
                  </span>
                )}
              </div>
            </div>

            {/* Job Select (Vendor only) */}
            {category === "vendor" && (
              <>
                <div className="form-group">
                  <label>{lang === "hin" ? "💼 जॉब टाइप" : "💼 Job Type"}</label>
                  <div className="input-wrapper">
                    <select
                      className="modern-select"
                      value={formData.job || ""}
                      onChange={(e) => handleInputChange("job", e.target.value)}
                    >
                      <option value="">
                        {lang === "hin" ? "जॉब टाइप चुनें" : "Select Job Type"}
                      </option>
                      {Object.entries(groupedServices).map(([categoryName, services]) => (
                        <optgroup key={categoryName} label={categoryName}>
                          {services.map((service) => (
                            <option key={service.value} value={service.value}>
                              {lang === "hin" ? service.labelHindi : service.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    {lang === "hin" ? "📅 अनुभव (वर्षों में)" : "📅 Experience (in years)"}
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      placeholder={lang === "hin" ? "अनुभव दर्ज करें" : "Enter experience"}
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Gender Select */}
            <div className="form-group">
              <label>{lang === "hin" ? "👤 लिंग" : "👤 Gender"}</label>
              <div className="input-wrapper">
                <select
                  className={`modern-select `}
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <option value="">{lang === "hin" ? "लिंग चुनें" : "Select Gender"}</option>
                  <option value="male">{lang === "hin" ? "पुरुष" : "Male"}</option>
                  <option value="female">{lang === "hin" ? "महिला" : "Female"}</option>
                  <option value="other">{lang === "hin" ? "अन्य" : "Other"}</option>
                </select>
                {/* {!validation.isGender && (
                  <span className="input-error">
                    ⚠️ {lang === "hin" ? "लिंग चुनें" : "Please select gender"}
                  </span>
                )} */}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="terms-group">
              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  {lang === "hin" ? "मैं" : "I agree to the"}{" "}
                  <a href="https://aapkakaam.com/terms" target="_blank" rel="noopener noreferrer">
                    {lang === "hin" ? "नियम एवं शर्तें" : "Terms & Conditions"}
                  </a>{" "}
                  {lang === "hin" ? "और" : "and"}{" "}
                  <a
                    href="https://aapkakaam.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lang === "hin" ? "गोपनीयता नीति" : "Privacy Policy"}
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button className="signup-btn" onClick={handleSignup} disabled={uiState.isLoading}>
              {uiState.isLoading ? (
                <span className="loader"></span>
              ) : (
                <span>
                  {lang === "hin" ? "साइनअप करें" : "Signup"}
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

            {/* Login Link */}
            <div className="login-link">
              <span>{lang === "hin" ? "पहले से खाता है?" : "Already have an account?"}</span>
              <button onClick={handleLogin}>{lang === "hin" ? "लॉगिन करें" : "Login"} →</button>
            </div>
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
}

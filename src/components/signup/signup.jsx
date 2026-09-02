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
  const MAX_JOBS = 5;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // ============================================================
  // LANGUAGE
  // ============================================================

  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    otp: "",
    pass: "",
    rePass: "",
    jobs: [],
    gender: "",
    experience: "",
  });

  // ============================================================
  // VALIDATION
  // ============================================================

  const [validation, setValidation] = useState({
    isPassValid: true,
    isNumValid: true,
    isNameEmpty: true,
    isRePassMatch: true,
    isGender: true,
    isValidPass: true,
  });

  // ============================================================
  // UI STATE
  // ============================================================

  const [agreed, setAgreed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeField, setActiveField] = useState(null);

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

  // ============================================================
  // THEME COLORS
  // ============================================================

  const themeColors = {
    primary: "#4F46E5",
    primaryLight: "#EEF2FF",
    primaryDark: "#4338CA",
    secondary: "#7C3AED",
    accent: "#22C55E",
    textDark: "#1A1A2E",
    textLight: "#6B7280",
    error: "#EF4444",
    success: "#22C55E",
    gradient: "linear-gradient(135deg, #4F46E5, #7C3AED)",
  };

  // ============================================================
  // LOCATION DATA
  // ============================================================

  const { category, cd, id } = useMemo(() => location.state || {}, [location.state]);

  const profileCategory = useMemo(() => {
    if (!category) return "";
    return `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  }, [category]);

  // ============================================================
  // SERVICES
  // ============================================================

  const allServices = useMemo(() => {
    return serviceData.flatMap((categoryItem) =>
      categoryItem.services.map((service) => ({
        value: service.jobType,
        label: service.title,
        labelHindi: service.hindi || service.title,
        category: categoryItem.heading,
        headingHindi: categoryItem.headingHindi || categoryItem.heading,
        emoji: categoryItem.emoji || "🔧",
      })),
    );
  }, []);

  // ============================================================
  // SELECTED JOB DETAILS
  // ============================================================

  const selectedJobsDetails = useMemo(() => {
    return formData.jobs.map((job) => {
      const service = allServices.find((item) => item.value === job);
      return {
        value: job,
        label: lang === "hin" ? service?.labelHindi || job : service?.label || job,
        category: service?.category || "",
        emoji: service?.emoji || "🔧",
      };
    });
  }, [formData.jobs, allServices, lang]);

  // ============================================================
  // VALIDATION EFFECTS
  // ============================================================

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      isPassValid: true,
      isValidPass: true,
    }));
  }, [formData.pass]);

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      isNameEmpty: formData.name.length > 0,
    }));
  }, [formData.name]);

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      isRePassMatch: true,
    }));
  }, [formData.rePass]);

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      isNumValid: true,
    }));
  }, [formData.phoneNo]);

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      isGender: formData.gender.length > 0,
    }));
  }, [formData.gender]);

  useEffect(() => {
    setMessages((prev) => ({
      ...prev,
      err: "",
    }));
  }, [formData.otp]);

  // ============================================================
  // MESSAGE
  // ============================================================

  const showMessage = useCallback((type, message, duration = 2000) => {
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
  // CATEGORY TOGGLE
  // ============================================================

  const toggleCategory = useCallback((categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  }, []);

  // ============================================================
  // FILTER SERVICES
  // ============================================================

  const getFilteredServices = useCallback(() => {
    if (!searchTerm.trim()) {
      return allServices;
    }

    const term = searchTerm.toLowerCase().trim();
    return allServices.filter((service) => {
      const label = lang === "hin" ? service.labelHindi : service.label;
      return label.toLowerCase().includes(term);
    });
  }, [searchTerm, allServices, lang]);

  // ============================================================
  // GROUP SERVICES
  // ============================================================

  const groupedServices = useMemo(() => {
    const groups = {};
    const filtered = getFilteredServices();

    filtered.forEach((service) => {
      const key = lang === "hin" ? service.headingHindi : service.category;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(service);
    });

    return groups;
  }, [getFilteredServices, lang]);

  // ============================================================
  // PHONE VERIFICATION
  // ============================================================

  const handlePhoneVerify = useCallback(async () => {
    if (!navigator.onLine) {
      showMessage("err", lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
      return;
    }

    if (!uiState.isOtpSent) {
      if (!/^\d{10}$/.test(String(formData.phoneNo))) {
        showMessage(
          "err",
          lang === "hin" ? "मोबाइल नंबर 10 अंकों का होना चाहिए" : "Mobile Number must be 10 digits",
        );
        return;
      }

      setUiState((prev) => ({
        ...prev,
        isPhoneOtpLoading: true,
      }));

      try {
        const res = await axios.post(
          `${SERVER_URL}/${category}/phoneVerification`,
          { phoneNo: String(formData.phoneNo).trim() },
          { headers: { "Content-Type": "application/json" }, timeout: 15000 },
        );

        if (res.data?.verified) {
          setOtpId(res.data.otpId);
          dispatch(setValidPhoneNoId(res.data.otpId));
          setUiState((prev) => ({
            ...prev,
            isOtpSent: true,
            isPhoneOtpLoading: false,
          }));
          showMessage(
            "success",
            res.data.message || (lang === "hin" ? "OTP भेज दिया गया" : "OTP sent successfully"),
            2000,
          );
        } else {
          showMessage(
            "err",
            res.data?.message ||
              (lang === "hin" ? "OTP भेजने में समस्या हुई" : "Unable to send OTP"),
            15000,
          );
        }
      } catch (error) {
        console.error("Phone verification error:", error);
        showMessage(
          "err",
          error?.response?.data?.message ||
            (lang === "hin" ? "फोन वेरिफिकेशन विफल" : "Phone verification failed"),
        );
      } finally {
        setUiState((prev) => ({
          ...prev,
          isPhoneOtpLoading: false,
        }));
      }
      return;
    }

    setUiState((prev) => ({
      ...prev,
      isPhoneOtpLoading: true,
    }));

    try {
      const res = await axios.post(
        `${SERVER_URL}/${category}/otpVerification`,
        { otp: String(formData.otp).trim(), otpId },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 },
      );

      if (res.data?.verified) {
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
          res.data?.message || (lang === "hin" ? "OTP वेरिफिकेशन विफल" : "OTP verification failed"),
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      showMessage(
        "err",
        error?.response?.data?.message ||
          (lang === "hin" ? "OTP वेरिफिकेशन विफल" : "OTP verification failed"),
      );
    } finally {
      setUiState((prev) => ({
        ...prev,
        isPhoneOtpLoading: false,
      }));
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

  // ============================================================
  // SIGNUP
  // ============================================================

  const handleSignup = useCallback(async () => {
    if (uiState.isLoading) return;

    if (!formData.name.trim()) {
      setValidation((prev) => ({ ...prev, isNameEmpty: false }));
      return;
    }

    if (!/^\d{10}$/.test(String(formData.phoneNo))) {
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

    if (category === "vendor" && (!Array.isArray(formData.jobs) || formData.jobs.length === 0)) {
      showMessage(
        "err",
        lang === "hin" ? "कृपया कम से कम एक काम चुनें" : "Please select at least one job",
      );
      return;
    }

    if (category === "vendor" && formData.jobs.length > MAX_JOBS) {
      showMessage(
        "err",
        lang === "hin"
          ? `आप अधिकतम ${MAX_JOBS} काम चुन सकते हैं`
          : `You can select a maximum of ${MAX_JOBS} jobs`,
      );
      return;
    }

    if (!formData.gender) {
      setValidation((prev) => ({ ...prev, isGender: false }));
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

    if (!navigator.onLine) {
      showMessage("err", lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
      return;
    }

    setUiState((prev) => ({ ...prev, isLoading: true }));

    try {
      if (category === "vendor") {
        const jobs = [
          ...new Set(formData.jobs.map((job) => String(job || "").trim()).filter(Boolean)),
        ];

        if (jobs.length === 0) {
          throw new Error(
            lang === "hin" ? "कृपया कम से कम एक काम चुनें" : "Please select at least one job",
          );
        }

        if (jobs.length > MAX_JOBS) {
          throw new Error(
            lang === "hin"
              ? `आप अधिकतम ${MAX_JOBS} काम चुन सकते हैं`
              : `You can select a maximum of ${MAX_JOBS} jobs`,
          );
        }

        const response = await axios.post(
          `${SERVER_URL}/vendor/signup/create-order`,
          {
            name: formData.name.trim(),
            phoneNo: String(formData.phoneNo).trim(),
            password: formData.pass,
            gender: formData.gender,
            type: jobs,
            experience: Number(formData.experience) || 0,
            sharedBy: id || "",
            cd: cd || "",
            validPhoneNoId: validPhoneNoId || "",
            agreedToTnCnP: true,
          },
          { headers: { "Content-Type": "application/json" }, timeout: 15000 },
        );

        if (!response.data?.success || !response.data?.order || !response.data?.signupToken) {
          throw new Error(
            response.data?.message ||
              (lang === "hin"
                ? "भुगतान ऑर्डर बनाने में समस्या हुई"
                : "Unable to create payment order"),
          );
        }

        const { order, signupToken } = response.data;

        if (typeof window === "undefined" || !window.Razorpay) {
          throw new Error(lang === "hin" ? "Razorpay लोड नहीं हुआ है" : "Razorpay is not loaded");
        }

        const razorpayOptions = {
          key: order.key,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Aapkakaam",
          description:
            lang === "hin" ? "वेंडर रजिस्ट्रेशन शुल्क ₹50" : "Vendor Registration Fee ₹50",
          order_id: order.id,
          prefill: {
            name: formData.name.trim(),
            contact: String(formData.phoneNo).trim(),
          },
          notes: { purpose: "vendor_signup" },
          theme: { color: "#4F46E5" },

          handler: async (paymentResponse) => {
            try {
              setUiState((prev) => ({ ...prev, isLoading: true }));

              if (
                !paymentResponse?.razorpay_payment_id ||
                !paymentResponse?.razorpay_order_id ||
                !paymentResponse?.razorpay_signature
              ) {
                throw new Error(
                  lang === "hin" ? "अमान्य भुगतान प्रतिक्रिया" : "Invalid payment response",
                );
              }

              const verifyResponse = await axios.post(
                `${SERVER_URL}/vendor/signup/verify-payment`,
                {
                  signupToken,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                },
                { headers: { "Content-Type": "application/json" }, timeout: 20000 },
              );

              const data = verifyResponse.data;

              if (!data?.success) {
                throw new Error(
                  data?.message ||
                    (lang === "hin" ? "भुगतान सत्यापन विफल" : "Payment verification failed"),
                );
              }

              showMessage(
                "success",
                lang === "hin"
                  ? "₹50 भुगतान सफल! आपका वेंडर अकाउंट बन गया है और ₹50 बैलेंस में जोड़ दिए गए हैं।"
                  : "₹50 payment successful! Your vendor account has been created and ₹50 has been added to your balance.",
                3500,
              );

              setTimeout(() => {
                navigate("/login", { state: { category: "vendor" } });
              }, 3500);
            } catch (error) {
              console.error("Vendor signup payment verification error:", error);
              showMessage(
                "err",
                error?.response?.data?.message ||
                  error?.message ||
                  (lang === "hin" ? "भुगतान सत्यापन विफल" : "Payment verification failed"),
              );
              setUiState((prev) => ({ ...prev, isLoading: false }));
            }
          },

          modal: {
            ondismiss: () => {
              setUiState((prev) => ({ ...prev, isLoading: false }));
              showMessage("err", lang === "hin" ? "भुगतान रद्द कर दिया गया" : "Payment cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);

        razorpay.on("payment.failed", (response) => {
          console.error("Vendor signup payment failed:", response);
          setUiState((prev) => ({ ...prev, isLoading: false }));
          showMessage(
            "err",
            response?.error?.description ||
              (lang === "hin" ? "भुगतान विफल हो गया" : "Payment failed"),
          );
        });

        razorpay.open();
        return;
      }

      const result = await axios.post(
        `${SERVER_URL}/${category}/signup`,
        {
          name: formData.name.trim(),
          phoneNo: String(formData.phoneNo).trim(),
          password: formData.pass,
          sharedBy: id || "",
          gender: formData.gender,
          type: formData.jobs,
          experience: Number(formData.experience) || 0,
          cd: cd || "",
          validPhoneNoId: validPhoneNoId || "",
          agreedToTnCnP: agreed,
        },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 },
      );

      showMessage(
        "success",
        result.data?.message || (lang === "hin" ? "साइनअप सफल" : "Signup successful"),
        2000,
      );

      setTimeout(() => {
        navigate("/login", { state: { category } });
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      showMessage(
        "err",
        err?.response?.data?.message ||
          err?.message ||
          (lang === "hin" ? "साइनअप विफल" : "Signup failed"),
      );
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
    uiState.isLoading,
  ]);

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = useCallback(() => {
    navigate("/login", { state: { category } });
  }, [navigate, category]);

  // ============================================================
  // PASSWORD EYE
  // ============================================================

  const handleEyeClicked = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      isEyeClicked: !prev.isEyeClicked,
    }));
  }, []);

  // ============================================================
  // ALERT EFFECT
  // ============================================================

  useEffect(() => {
    if (messages.err) {
      showError(messages.err);
    } else if (messages.success) {
      showSuccess(messages.success);
    }
  }, [messages.err, messages.success]);

  // ============================================================
  // INVALID CATEGORY
  // ============================================================

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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <AdsterraBanner_320x50 />

      <div className="signup-modern">
        <div className="signup-container">
          {/* Decorative Background */}
          <div className="signup-decoration">
            <div className="deco-circle deco-circle-1" />
            <div className="deco-circle deco-circle-2" />
            <div className="deco-circle deco-circle-3" />
            <div className="deco-circle deco-circle-4" />
          </div>

          {/* Floating Elements */}
          <div className="floating-shapes">
            <div className="floating-shape shape-1">✦</div>
            <div className="floating-shape shape-2">●</div>
            <div className="floating-shape shape-3">◆</div>
          </div>

          {/* Header */}
          <div className="signup-header">
            <div className="signup-badge">{lang === "hin" ? "✨ नया खाता" : "✨ NEW ACCOUNT"}</div>
            <h1 className="signup-title">
              {lang === "hin" ? "साइनअप करें" : "Signup as"}{" "}
              <span className="signup-highlight">{profileCategory}</span>
            </h1>
            <p className="signup-subtitle">
              {lang === "hin"
                ? "अपना खाता बनाएं और सेवाएँ शुरू करें"
                : "Create your account and get started"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="signup-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-label">{lang === "hin" ? "जानकारी" : "Details"}</span>
            </div>
            <div className="step-line" />
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-label">{lang === "hin" ? "सत्यापन" : "Verify"}</span>
            </div>
            <div className="step-line" />
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">{lang === "hin" ? "पूर्ण" : "Complete"}</span>
            </div>
          </div>

          {/* Form */}
          <div className="signup-form">
            {/* Name */}
            <div className="signup-form-group floating-label-group">
              <div className="signup-input-wrapper">
                <input
                  type="text"
                  className={`signup-input `}
                  placeholder=" "
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  id="name-input"
                />
                <label htmlFor="name-input" className="floating-label">
                  {lang === "hin" ? "पूरा नाम" : "Full Name"}
                </label>
                <span className="input-icon">👤</span>
              </div>
            </div>

            {/* Phone / OTP */}
            <div className="signup-form-group floating-label-group">
              <div className="signup-input-wrapper phone-wrapper">
                {uiState.isOtpSent ? (
                  <>
                    <input
                      type="text"
                      className="signup-input otp-input"
                      placeholder=" "
                      value={formData.otp}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      maxLength={6}
                      id="otp-input"
                    />
                    <label htmlFor="otp-input" className="floating-label">
                      {lang === "hin" ? "OTP दर्ज करें" : "Enter OTP"}
                    </label>
                    <span className="input-icon">📱</span>
                  </>
                ) : (
                  <>
                    <input
                      type="tel"
                      className={`signup-input phone-input ${
                        !validation.isNumValid ? "input-error" : ""
                      } ${uiState.verifyPhoneNo ? "input-verified" : ""}`}
                      placeholder=" "
                      value={formData.phoneNo}
                      readOnly={uiState.verifyPhoneNo}
                      onChange={(e) =>
                        handleInputChange("phoneNo", e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={10}
                      id="phone-input"
                    />
                    <label htmlFor="phone-input" className="floating-label">
                      {lang === "hin" ? "मोबाइल नंबर" : "Mobile Number"}
                    </label>
                    <span className="input-icon">📱</span>
                  </>
                )}

                {uiState.verifyPhoneNo && (
                  <div className="verified-badge">
                    <img src={rightTck} alt="Verified" />
                  </div>
                )}

                {formData.phoneNo.length === 10 && !uiState.verifyPhoneNo && (
                  <button
                    className={`verify-btn ${uiState.isPhoneOtpLoading ? "verify-btn-disabled" : ""}`}
                    onClick={handlePhoneVerify}
                    type="button"
                    disabled={uiState.isPhoneOtpLoading}
                  >
                    {uiState.isPhoneOtpLoading ? (
                      <span className="signup-loader small" />
                    ) : uiState.isOtpSent ? (
                      lang === "hin" ? (
                        "OTP वेरिफाई"
                      ) : (
                        "Verify OTP"
                      )
                    ) : lang === "hin" ? (
                      "वेरिफाई"
                    ) : (
                      "Verify"
                    )}
                  </button>
                )}
              </div>
              {!validation.isNumValid && (
                <span className="signup-error-text">
                  ⚠️ {lang === "hin" ? "10 अंकों का नंबर दर्ज करें" : "Enter 10 digit number"}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="signup-form-group floating-label-group">
              <div className="signup-input-wrapper password-wrapper">
                <input
                  type={uiState.isEyeClicked ? "text" : "password"}
                  className={`signup-input password-input ${
                    !validation.isPassValid ? "input-error" : ""
                  }`}
                  placeholder=" "
                  value={formData.pass}
                  onChange={(e) => handleInputChange("pass", e.target.value)}
                  id="password-input"
                />
                <label htmlFor="password-input" className="floating-label">
                  {lang === "hin" ? "पासवर्ड" : "Password"}
                </label>
                <span className="input-icon">🔒</span>
                <button
                  className="password-eye-toggle"
                  onClick={handleEyeClicked}
                  type="button"
                  aria-label={uiState.isEyeClicked ? "Hide password" : "Show password"}
                >
                  <img src={eye} alt="" className="password-eye-icon" />
                  {uiState.isEyeClicked && <img src={line} alt="" className="password-line-icon" />}
                </button>
              </div>
              {!validation.isValidPass && (
                <span className="signup-error-text">
                  ⚠️{" "}
                  {lang === "hin"
                    ? "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"
                    : "Password must be at least 6 characters"}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="signup-form-group floating-label-group">
              <div className="signup-input-wrapper password-wrapper">
                <input
                  type={uiState.isEyeClicked ? "text" : "password"}
                  className={`signup-input password-input ${
                    !validation.isRePassMatch ? "input-error" : ""
                  }`}
                  placeholder=" "
                  value={formData.rePass}
                  onChange={(e) => handleInputChange("rePass", e.target.value)}
                  id="confirm-password-input"
                />
                <label htmlFor="confirm-password-input" className="floating-label">
                  {lang === "hin" ? "पासवर्ड दोबारा" : "Confirm Password"}
                </label>
                <span className="input-icon">🔐</span>
              </div>
              {!validation.isRePassMatch && (
                <span className="signup-error-text">
                  ⚠️ {lang === "hin" ? "पासवर्ड मैच नहीं हो रहा" : "Passwords do not match"}
                </span>
              )}
            </div>

            {/* Vendor Jobs */}
            {category === "vendor" && (
              <>
                <div className="signup-form-group">
                  <div className="jobs-section-header">
                    <label className="signup-label">
                      {lang === "hin"
                        ? `💼 काम चुनें (अधिकतम ${MAX_JOBS})`
                        : `💼 Select Jobs (Maximum ${MAX_JOBS})`}
                    </label>
                    <span className="jobs-selection-count">
                      {formData.jobs.length}/{MAX_JOBS}
                    </span>
                  </div>

                  <div className="jobs-wrapper">
                    {/* Selected Jobs */}
                    <div className="selected-jobs-container">
                      {formData.jobs.length === 0 ? (
                        <span className="selected-jobs-placeholder">
                          {lang === "hin"
                            ? "🔍 एक या अधिक काम चुनें"
                            : "🔍 Select one or more jobs"}
                        </span>
                      ) : (
                        selectedJobsDetails.map((job) => (
                          <span className="selected-job-chip" key={job.value}>
                            <span className="selected-job-emoji">{job.emoji}</span>
                            <span className="selected-job-name">{job.label}</span>
                            <button
                              type="button"
                              className="selected-job-remove"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  jobs: prev.jobs.filter((item) => item !== job.value),
                                }))
                              }
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Search */}
                    <div className="jobs-search-wrapper">
                      <span className="jobs-search-icon">🔍</span>
                      <input
                        type="text"
                        className="jobs-search-input"
                        placeholder={lang === "hin" ? "काम खोजें..." : "Search jobs..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          className="jobs-search-clear"
                          onClick={() => setSearchTerm("")}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Jobs List */}
                    <div className="jobs-list">
                      {Object.keys(groupedServices).length === 0 ? (
                        <div className="jobs-no-results">
                          {lang === "hin" ? "😕 कोई काम नहीं मिला" : "😕 No jobs found"}
                        </div>
                      ) : (
                        Object.entries(groupedServices).map(([categoryName, services]) => {
                          const isExpanded = expandedCategories[categoryName] !== false;
                          const categoryCount = services.length;
                          const selectedInCategory = services.filter((s) =>
                            formData.jobs.includes(s.value),
                          ).length;

                          return (
                            <div className="job-category" key={categoryName}>
                              <button
                                type="button"
                                className={`job-category-header ${isExpanded ? "expanded" : ""}`}
                                onClick={() => toggleCategory(categoryName)}
                              >
                                <span className="job-category-title">{categoryName}</span>
                                <span className="job-category-badge">
                                  {selectedInCategory}/{categoryCount}
                                </span>
                                <span className="job-category-arrow">▼</span>
                              </button>

                              {isExpanded && (
                                <div className="job-options">
                                  {services.map((service) => {
                                    const selected = formData.jobs.includes(service.value);
                                    const disabled = !selected && formData.jobs.length >= MAX_JOBS;

                                    return (
                                      <label
                                        className={`job-option ${
                                          selected ? "job-option-selected" : ""
                                        } ${disabled ? "job-option-disabled" : ""}`}
                                        key={service.value}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selected}
                                          disabled={disabled}
                                          className="job-checkbox"
                                          onChange={() => {
                                            setFormData((prev) => {
                                              if (prev.jobs.includes(service.value)) {
                                                return {
                                                  ...prev,
                                                  jobs: prev.jobs.filter(
                                                    (item) => item !== service.value,
                                                  ),
                                                };
                                              }

                                              if (prev.jobs.length >= MAX_JOBS) {
                                                return prev;
                                              }

                                              return {
                                                ...prev,
                                                jobs: [...prev.jobs, service.value],
                                              };
                                            });
                                          }}
                                        />

                                        <span
                                          className={`job-option-check ${
                                            selected ? "checked" : ""
                                          }`}
                                        >
                                          {selected && "✓"}
                                        </span>

                                        <span className="job-option-label">
                                          {lang === "hin" ? service.labelHindi : service.label}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {formData.jobs.length >= MAX_JOBS && (
                      <div className="jobs-limit-message">
                        <span>⚠️</span>
                        {lang === "hin"
                          ? `आप अधिकतम ${MAX_JOBS} काम चुन सकते हैं।`
                          : `You can select a maximum of ${MAX_JOBS} jobs.`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="signup-form-group floating-label-group">
                  <div className="signup-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      max="60"
                      className="signup-input"
                      placeholder=" "
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      id="experience-input"
                    />
                    <label htmlFor="experience-input" className="floating-label">
                      {lang === "hin" ? "अनुभव (वर्षों में)" : "Experience (in years)"}
                    </label>
                    <span className="input-icon">📅</span>
                  </div>
                </div>
              </>
            )}

            {/* Gender */}
            <div className="signup-form-group floating-label-group">
              <div className="signup-select-wrapper">
                <select
                  className={`signup-input signup-select `}
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  id="gender-select"
                >
                  <option value="">{lang === "hin" ? "लिंग चुनें" : "Select Gender"}</option>
                  <option value="male">{lang === "hin" ? "पुरुष" : "Male"}</option>
                  <option value="female">{lang === "hin" ? "महिला" : "Female"}</option>
                  <option value="other">{lang === "hin" ? "अन्य" : "Other"}</option>
                </select>
                <label htmlFor="gender-select" className="floating-label">
                  {lang === "hin" ? "लिंग" : "Gender"}
                </label>
                <span className="input-icon">👤</span>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            {/* Terms */}
            <div className="signup-terms">
              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="terms-checkbox"
                />
                <span className="custom-checkbox">{agreed && "✓"}</span>
                <span className="terms-text">
                  {lang === "hin" ? "मैं" : "I agree to the"}{" "}
                  <a
                    href="https://aapkakaam.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terms-link"
                  >
                    {lang === "hin" ? "नियम एवं शर्तें" : "Terms & Conditions"}
                  </a>{" "}
                  {lang === "hin" ? "और" : "and"}{" "}
                  <a
                    href="https://aapkakaam.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terms-link"
                  >
                    {lang === "hin" ? "गोपनीयता नीति" : "Privacy Policy"}
                  </a>
                </span>
              </label>
            </div>

            {/* Payment Info */}
            {category === "vendor" && (
              <div className="vendor-payment-card">
                <div className="vendor-payment-icon">💳</div>
                <div className="vendor-payment-content">
                  <strong>
                    {lang === "hin" ? "वेंडर खाता निर्माण शुल्क" : "Vendor Account Creation Fee"}
                  </strong>
                  <p>
                    {lang === "hin"
                      ? "साइनअप पूरा करने के लिए ₹50 भुगतान करें।"
                      : "Pay ₹50 to complete vendor signup."}
                  </p>
                  <small>
                    {lang === "hin"
                      ? "₹50 आपके वेंडर बैलेंस में जोड़ दिए जाएंगे।"
                      : "₹50 will be added to your vendor balance."}
                  </small>
                </div>
                <div className="vendor-payment-amount">₹50</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              className={`signup-submit-btn ${uiState.isLoading ? "signup-submit-loading" : ""}`}
              onClick={handleSignup}
              disabled={uiState.isLoading}
              type="button"
            >
              {uiState.isLoading ? (
                <>
                  <span className="signup-loader" />
                  <span>
                    {category === "vendor"
                      ? lang === "hin"
                        ? "भुगतान प्रक्रिया..."
                        : "Processing payment..."
                      : lang === "hin"
                        ? "साइनअप हो रहा है..."
                        : "Creating account..."}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {category === "vendor"
                      ? lang === "hin"
                        ? "₹50 भुगतान करके खाता बनाएं"
                        : "Pay ₹50 & Signup"
                      : lang === "hin"
                        ? "खाता बनाएं"
                        : "Signup"}
                  </span>
                  <svg
                    className="signup-arrow"
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

            {/* Login */}
            <div className="signup-login">
              <span>{lang === "hin" ? "पहले से खाता है?" : "Already have an account?"}</span>
              <button onClick={handleLogin} className="signup-login-btn" type="button">
                {lang === "hin" ? "लॉगिन करें" : "Login"} →
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdsterraBanner />
    </>
  );
}

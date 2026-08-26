// Modern Change Password Page - AapkaKaam (Fixed OTP Input)

import "./changePhoneEmail&Password.css";
import { useEffect, useState, useRef } from "react";
import { SERVER_URL } from "../../utils/base";
import { useLocation, useNavigate } from "react-router";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import axios from "axios";
import Timer from "../timer/timer";
import { useDispatch, useSelector } from "react-redux";
import { showError, showSuccess } from "../showAlert";

export default function ChangePhoneEmailPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const containerRef = useRef(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const category = localStorage.getItem("category");
  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);
  const token = `Bearer ${userData[0]?.token}`;

  // Password change states
  const [phoneNo, setPhoneNo] = useState(userData[0]?.phoneNo || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Helper function for translations
  const t = (en, hi) => {
    return lang === "hin" ? hi : en;
  };

  function handleCrossClick() {
    navigate("/");
  }

  useEffect(() => {
    if (err) showError(err);
  }, [err]);

  useEffect(() => {
    if (success) showSuccess(success);
  }, [success]);

  // Send OTP for password reset
  const handleSendOtp = () => {
    if (!navigator.onLine) {
      setErr(t("You are offline", "आप ऑफलाइन हैं"));
      setTimeout(() => setErr(""), 3000);
      return;
    }

    if (phoneNo.length !== 10) {
      setErr(t("Mobile Number must be 10 digits", "मोबाइल नंबर 10 अंकों का होना चाहिए"));
      setTimeout(() => setErr(""), 3000);
      return;
    }

    setIsLoading(true);
    setOtpTimer(true);

    axios
      .post(`${SERVER_URL}/${category}/phoneVerificationPasswordReset`, {
        phoneNo,
        changingPass: true,
      })
      .then((res) => {
        setOtpId(res.data.otpId);
        setSuccess(t("OTP sent successfully", "OTP सफलतापूर्वक भेजा गया"));
        setIsOtpSent(true);
        setOtpTimer(false);
        setIsLoading(false);
        setTimeout(() => setSuccess(""), 2000);
      })
      .catch((err) => {
        setIsLoading(false);
        setOtpTimer(false);
        setErr(err.response?.data?.message || t("Something went wrong", "कुछ गलत हो गया"));
        setTimeout(() => setErr(""), 3000);
      });
  };

  // Verify OTP and update password
  const handleVerifyOtp = () => {
    if (!navigator.onLine) {
      setErr(t("You are offline", "आप ऑफलाइन हैं"));
      setTimeout(() => setErr(""), 3000);
      return;
    }

    if (!otp || otp.length < 4) {
      setErr(t("Please enter valid OTP", "कृपया सही OTP दर्ज करें"));
      setTimeout(() => setErr(""), 3000);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErr(t("Password must be at least 6 characters", "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"));
      setTimeout(() => setErr(""), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr(t("Passwords do not match", "पासवर्ड मेल नहीं खाते"));
      setTimeout(() => setErr(""), 3000);
      return;
    }

    setIsLoading(true);

    axios
      .post(`${SERVER_URL}/${category}/otpVerificationResetPassword`, { otp, otpId })
      .then((res) => {
        if (res.data.verified) {
          // OTP verified, now update password
          const endpoint = `${SERVER_URL}/${category}/edit/password`;
          const body = {
            phoneNo,
            password: newPassword,
            otpId,
          };

          axios
            .patch(endpoint, body, { headers: { Authorization: token } })
            .then(() => {
              setSuccess(t("Password Updated Successfully", "पासवर्ड सफलतापूर्वक अपडेट किया गया"));
              setIsLoading(false);
              setTimeout(() => {
                navigate("/login", { state: { category } });
              }, 2000);
            })
            .catch((err) => {
              setIsLoading(false);
              setErr(err.response?.data?.message || t("Something went wrong", "कुछ गलत हो गया"));
              setTimeout(() => setErr(""), 3000);
            });
        } else {
          setErr(res.data?.message || t("OTP verification failed", "OTP सत्यापन विफल"));
          setIsLoading(false);
          setTimeout(() => setErr(""), 3000);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setErr(err.response?.data?.message || t("Something went wrong", "कुछ गलत हो गया"));
        setTimeout(() => setErr(""), 3000);
      });
  };

  // Handle button click
  const handleSubmit = () => {
    if (!isOtpSent) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  // Check if passwords match
  const doPasswordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <div className="change-modern" ref={containerRef}>
      <div className="change-modern-container">
        {/* Decorative Elements */}
        <div className="change-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Close Button */}
        <button className="change-close-btn" onClick={handleCrossClick}>
          <svg viewBox="0 0 24 24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="change-header-modern">
          <div className="change-header-left">
            <div className="header-icon-wrapper">
              <span className="header-icon">🔒</span>
            </div>
            <div>
              <h1>{t("Change Password", "पासवर्ड बदलें")}</h1>
              <p>
                {!isOtpSent
                  ? t("Verify your identity", "अपनी पहचान सत्यापित करें")
                  : t("Set new password", "नया पासवर्ड सेट करें")}
              </p>
            </div>
          </div>
          <div className="change-step-indicator">
            <span className={`step-dot ${!isOtpSent ? "active" : ""}`}></span>
            <span className="step-line"></span>
            <span className={`step-dot ${isOtpSent ? "active" : ""}`}></span>
          </div>
        </div>

        {/* Form */}
        <div className="change-form-modern">
          {/* Phone Number / OTP Input */}
          <div className="form-group-modern">
            <label>
              {!isOtpSent
                ? t("Enter your mobile number", "अपना मोबाइल नंबर दर्ज करें")
                : t("Enter OTP sent to your mobile", "अपने मोबाइल पर भेजा गया OTP दर्ज करें")}
            </label>
            <div className="input-wrapper-modern">
              <span className="input-icon">{!isOtpSent ? "📱" : "🔐"}</span>
              <input
                type={!isOtpSent ? "tel" : "text"}
                placeholder={
                  !isOtpSent
                    ? t("Enter Mobile Number", "मोबाइल नंबर दर्ज करें")
                    : t("Enter OTP", "OTP दर्ज करें")
                }
                value={!isOtpSent ? phoneNo : otp}
                onChange={(e) => {
                  if (!isOtpSent) {
                    setPhoneNo(e.target.value);
                  } else {
                    setOtp(e.target.value);
                  }
                }}
                className="modern-input-field"
                autoFocus
                maxLength={!isOtpSent ? 10 : 6}
              />
            </div>
          </div>

          {/* Step 2: New Password (only shown after OTP sent) */}
          {isOtpSent && (
            <>
              <div className="form-group-modern">
                <label>{t("New Password", "नया पासवर्ड")}</label>
                <div className="input-wrapper-modern">
                  <span className="input-icon">🔒</span>
                  <input
                    type="text"
                    placeholder={t(
                      "Enter new password (min 6 characters)",
                      "नया पासवर्ड दर्ज करें (कम से कम 6 अक्षर)",
                    )}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="modern-input-field"
                  />
                </div>
              </div>

              <div className="form-group-modern">
                <label>{t("Confirm Password", "पासवर्ड पुष्टि करें")}</label>
                <div className="input-wrapper-modern">
                  <span className="input-icon">✓</span>
                  <input
                    type="text"
                    placeholder={t("Re-enter new password", "नया पासवर्ड दोबारा दर्ज करें")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="modern-input-field"
                    style={{
                      borderColor:
                        doPasswordsMatch && confirmPassword
                          ? "#16a34a"
                          : confirmPassword && !doPasswordsMatch
                            ? "#dc2626"
                            : "",
                    }}
                  />
                  {confirmPassword && (
                    <span className="password-match-icon">{doPasswordsMatch ? "✅" : "❌"}</span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* OTP Timer */}
          {otpTimer && (
            <div className="otp-timer-modern">
              <span className="timer-icon">⏳</span>
              <span>{t("Resend OTP in", "OTP पुनः भेजें")}</span>
              <Timer setOtpTimer={setOtpTimer} />
            </div>
          )}

          {/* Submit Button */}
          <button
            className={`change-submit-btn ${otpTimer ? "disabled" : ""}`}
            onClick={handleSubmit}
            disabled={otpTimer || isLoading}
          >
            {isLoading ? (
              <span className="btn-spinner-modern"></span>
            ) : (
              <>
                <span>
                  {!isOtpSent
                    ? t("Send OTP", "OTP भेजें")
                    : t("Update Password", "पासवर्ड अपडेट करें")}
                </span>
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
              </>
            )}
          </button>

          {/* Info Message */}
          <div className="change-info-modern">
            <span className="info-icon">💡</span>
            <span>
              {!isOtpSent
                ? t(
                    "An OTP will be sent to your registered mobile number",
                    "आपके पंजीकृत मोबाइल नंबर पर OTP भेजा जाएगा",
                  )
                : t(
                    "Enter the OTP and your new password to reset",
                    "OTP और अपना नया पासवर्ड दर्ज करें",
                  )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

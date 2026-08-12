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
      showMessage("err", "You are offline");
      return;
    }

    if (!uiState.isOtpSent) {
      if (!/^\d{10}$/.test(formData.phoneNo)) {
        showMessage("err", "Mobile Number must be 10 digits");
        return;
      }

      setUiState((prev) => ({ ...prev, isPhoneOtpLoading: true }));

      try {
        const res = await axios.post(`${SERVER_URL}/${category}/phoneVerification`, {
          phoneNo: formData.phoneNo,
        });
        console.log(res);
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
          showMessage("err", error.message, 15000);
        }
      } catch (error) {
        showMessage("err", error.response?.data?.message || "Phone verification failed");
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
          showMessage("success", "OTP verified successfully", 2000);
        } else {
          showMessage("err", res.data.message || "OTP verification failed");
        }
      } catch (error) {
        console.log(error);
        showMessage("err", error.response?.data?.message || "OTP verification failed");
      } finally {
        setUiState((prev) => ({ ...prev, isPhoneOtpLoading: false }));
      }
    }
  }, [formData.phoneNo, formData.otp, otpId, category, dispatch, uiState.isOtpSent, showMessage]);

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
    if (!formData.gender) {
      setValidation((prev) => ({ ...prev, isGender: false }));
      return;
    }
    if (!navigator.onLine) {
      showMessage("err", "You are offline");
      return;
    }
    if (!agreed) {
      showMessage("err", "You must accept the Terms & Conditions and Privacy Policy");
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
      showMessage("err", err.response?.data?.message || "Signup failed");
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [formData, category, id, cd, validPhoneNoId, navigate, showMessage]);

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
      <div className="signup">
        <div className="err" style={{ opacity: 1, top: "-5rem" }}>
          Invalid access. Please try again from proper navigation.
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (showMessage) {
      if (messages.err) {
        showError(messages.err);
      } else if (messages.success) {
        showSuccess(messages.success);
      }
    }
  }, [messages.err, messages.success, showMessage]);

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="signup">
        {/* Messages */}

        {/* Form Header */}
        <div className="signup__1stChild">
          <h3 style={{ color: "whitesmoke" }}>{profileCategory} Signup</h3>
        </div>

        {/* Form Body */}
        <div className="signup__2ndChild">
          {/* Name Input */}
          <div>
            <input
              placeholder="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              style={{ border: validation.isNameEmpty ? "" : "2px solid red" }}
            />
          </div>

          {/* Phone Verification */}
          <div style={{ position: "relative" }}>
            {uiState.isOtpSent ? (
              <input
                placeholder="Enter OTP"
                type="number"
                value={formData.otp}
                onChange={(e) => handleInputChange("otp", e.target.value)}
              />
            ) : (
              <input
                placeholder="Phone No."
                type="number"
                value={formData.phoneNo}
                readOnly={uiState.verifyPhoneNo}
                onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                style={{
                  marginBottom: validation.isNumValid ? "" : "0",
                  border: validation.isNumValid ? "" : "2px solid red",
                }}
              />
            )}

            {uiState.verifyPhoneNo && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "5px",
                  transform: "translateY(-40%)",
                }}
              >
                <img src={rightTck} alt="Verified" style={{ width: "2rem", height: "2rem" }} />
              </div>
            )}

            {formData.phoneNo.length === 10 && !uiState.verifyPhoneNo && (
              <div className="verify" onClick={handlePhoneVerify}>
                {uiState.isOtpSent ? (
                  uiState.isPhoneOtpLoading ? (
                    <div className="loading"></div>
                  ) : (
                    "Verify OTP"
                  )
                ) : uiState.isPhoneOtpLoading ? (
                  <div className="loading"></div>
                ) : (
                  "Verify Mobile Number"
                )}
              </div>
            )}

            <h6
              style={{
                display: validation.isNumValid ? "none" : "",
                color: "red",
                textAlign: "left",
              }}
            >
              Incorrect Number
            </h6>
          </div>

          {/* Password Input */}
          <div className="password">
            <input
              placeholder="Password"
              type={uiState.isEyeClicked ? "text" : "password"}
              value={formData.pass}
              onChange={(e) => handleInputChange("pass", e.target.value)}
              style={{
                marginBottom: validation.isPassValid ? "" : "0",
                border: validation.isPassValid ? "" : "2px solid red",
              }}
            />

            <div className="eyesvg" onClick={handleEyeClicked}>
              <img src={eye} alt="Toggle password visibility" />
            </div>
            <div
              className="cross-line"
              style={{
                display: uiState.isEyeClicked ? "block" : "none",
                pointerEvents: "none",
              }}
            >
              <img src={line} alt="" />
            </div>
          </div>

          <h6
            style={{
              display: validation.isValidPass ? "none" : "",
              color: "red",
              textAlign: "left",
              fontSize: "1rem",
            }}
          >
            Password must be at least 6 characters long
          </h6>

          {/* Job Select (Vendor only) */}
          {category === "vendor" && (
            <>
              <div>
                <select
                  className="job-select"
                  value={formData.job || ""}
                  onChange={(e) => handleInputChange("job", e.target.value)}
                >
                  <option value="">Select Job Type</option>

                  {serviceData.flatMap((category) =>
                    category.services.map((service) => (
                      <option
                        key={`${category.heading}-${service.jobType}`}
                        value={service.jobType}
                      >
                        {service.title}
                      </option>
                    )),
                  )}
                </select>
              </div>
              <div>
                <input
                  placeholder="How many years of experience do you have?"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  style={{ border: validation.isNameEmpty ? "" : "2px solid red" }}
                />
              </div>
            </>
          )}

          {/* Gender Select */}
          <div>
            <select
              className="job-select"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              style={{
                border: validation.isGender ? "" : "2px solid red",
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />{" "}
              I agree to the{" "}
              <a href="https://aapkakaam.com/terms" target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="https://aapkakaam.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button className="btn" onClick={handleSignup} disabled={uiState.isLoading}>
            {uiState.isLoading ? <div className="loading"></div> : "Signup"}
          </button>

          {/* Login Link */}
          <div>
            <h5>
              Already Have an Account?
              <span
                className="verify-btn forgetPass"
                onClick={handleLogin}
                style={{ border: "none" }}
              >
                Login
              </span>
            </h5>
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
}

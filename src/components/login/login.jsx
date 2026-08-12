// optimized and production ready

import { useLocation, useNavigate } from "react-router";
import "./login.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import eye from "../../resources/svg/eye-svgrepo-com.svg";
import line from "../../resources/svg/line-svgrepo-com.svg";
import axios from "axios";
import { useDispatch } from "react-redux";
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
      showMessage("err", "You are offline");
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
      showError(error.response?.data?.message || "Login failed");
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [formData.phoneNo, formData.pass, category, dispatch, navigate, showMessage]);

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
      <div className="login">
        <div className="err" style={{ opacity: 1 }}>
          Invalid access. Please try again from proper navigation.
        </div>
      </div>
    );
  }

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="login">
        {/* Login Form */}
        <div className="login__1stChild">
          <h3 style={{ color: "whitesmoke" }}>{profileCategory} Login</h3>
        </div>
        <div className="login__2ndChild">
          {/* Phone Number Input */}
          <div>
            <input
              placeholder="Mobile Number"
              type="tel"
              value={formData.phoneNo}
              onChange={(e) => handleInputChange("phoneNo", e.target.value)}
              style={{ border: uiState.isPhoneNoEmpty ? "" : "2px solid red" }}
            />
          </div>

          {/* Password Input */}
          <div className="password">
            <input
              placeholder="Password"
              type={uiState.isEyeClicked ? "text" : "password"}
              value={formData.pass}
              onChange={(e) => handleInputChange("pass", e.target.value)}
              style={{ border: uiState.isPassEmpty ? "" : "2px solid red" }}
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

          {/* Login Button */}
          <button className="btn" onClick={handleLogin} disabled={uiState.isLoading}>
            {uiState.isLoading ? <div className="loading"></div> : "Login"}
          </button>

          {/* Forgot Password */}
          <div className="forgetPass" onClick={handlePasswordChange}>
            <h5>Forgot Password?</h5>
          </div>

          {/* Signup Link */}
          <div>
            <h5>
              Don't Have an Account?{" "}
              <span
                className="verify-btn forgetPass"
                onClick={handleSignup}
                style={{ border: "none" }}
              >
                Signup
              </span>
            </h5>
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
}

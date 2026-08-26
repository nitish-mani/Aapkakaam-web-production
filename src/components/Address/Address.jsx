// Modern Address Page - AapkaKaam (with scroll to top)

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import "./Address.css";
import { useDispatch, useSelector } from "react-redux";
import { addDataUser, clearDataUser } from "../../utils/userslice";
import { addDataVendor, clearDataVendor } from "../../utils/vendorslice";
import { SERVER_URL } from "../../utils/base";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { setLocationPincode, setLocationPost } from "../../utils/categoryslice";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import CamleCase from "../camleCase/camleCase";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import { showError, showSuccess } from "../showAlert";

const Address = () => {
  // Hooks and initial setup
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const category = localStorage.getItem("category");
  const containerRef = useRef(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  // Select user data based on category
  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );

  // State management
  const [formData, setFormData] = useState({
    vill: "",
    post: "",
    dist: "",
    state: "",
    pincode: "",
  });
  const [errors, setError] = useState({
    vill: false,
    post: false,
    pincode: false,
  });
  const [success, setSuccess] = useState({ message: "", err: "" });
  const [isLoading, setIsLoading] = useState({
    address: false,
    submit: false,
  });
  const [postOfficeDetails, setPostOfficeDetails] = useState([{ Name: "Select Post Office" }]);

  // Derived values
  const viewOnLocation = location.state?.viewOnLocation;
  const token = `Bearer ${userData[0]?.token}`;
  const isOnline = navigator.onLine;
  const isPincodeValid = formData.pincode.length === 6;
  const isFormValid = !viewOnLocation
    ? formData.vill && isPincodeValid && formData.post && formData.post !== "Select Post Office"
    : isPincodeValid;

  // Memoized user ID based on category
  const userId = useMemo(() => {
    return category === "user" ? userData[0]?.userId : userData[0]?.vendorId;
  }, [category, userData]);

  // Scroll to top on mount
  useEffect(() => {
    // Scroll window to top
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    // Also scroll the container to top if it exists
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // API call to fetch post office details
  const fetchPostOfficeDetails = useCallback(async () => {
    if (!isPincodeValid) return;

    if (!isOnline) {
      setSuccess((prev) => ({
        ...prev,
        err: lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline",
      }));
      setTimeout(() => setSuccess((prev) => ({ ...prev, err: "" })), 3000);
      return;
    }

    setIsLoading((prev) => ({ ...prev, address: true }));

    try {
      const endpoint = category === "user" ? "getU" : "getV";
      const url = `${SERVER_URL}/pincode/${endpoint}`;

      const response = await axios.post(
        url,
        {
          pincode: formData.pincode,
        },
        {
          headers: { Authorization: token },
        },
      );

      if (response?.status === 200) {
        const result = response.data.data;
        const offices = result.offices || [];

        const cleanedOffices = offices.map((office) => ({
          Name: office.officename.replace(/\s(BO|SO|HO)$/, "").toUpperCase(),
          original: office,
        }));

        setPostOfficeDetails([
          { Name: lang === "hin" ? "पोस्ट ऑफिस चुनें" : "Select Post Office" },
          ...cleanedOffices,
        ]);

        setFormData((prev) => ({
          ...prev,
          dist: result.offices[0]?.district || "",
          state: result.offices[0]?.statename || "",
        }));
      } else {
        setSuccess((prev) => ({
          ...prev,
          err: lang === "hin" ? "मान्य पिनकोड दर्ज करें" : "Enter Valid Pincode",
        }));
      }
    } catch (error) {
      setSuccess((prev) => ({
        ...prev,
        err: lang === "hin" ? "मान्य पिनकोड दर्ज करें" : "Enter Valid Pincode",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, address: false }));
    }
  }, [formData.pincode, isOnline, isPincodeValid, category, token, lang]);

  // Handle form field changes
  const handleChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setSuccess((prev) => ({ ...prev, [field]: false, err: "" }));

      // Reset district and state when pincode changes
      if (field === "pincode") {
        setFormData((prev) => ({ ...prev, dist: "", state: "" }));
        setPostOfficeDetails([
          { Name: lang === "hin" ? "पोस्ट ऑफिस चुनें" : "Select Post Office" },
        ]);
      }
    },
    [lang],
  );

  // Handle form submission
  const handleSubmitAddress = useCallback(async () => {
    if (!isOnline) {
      setSuccess((prev) => ({
        ...prev,
        err: lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline",
      }));
      setTimeout(() => setSuccess((prev) => ({ ...prev, err: "" })), 3000);
      return;
    }

    // Validation
    const newErrors = {
      vill: viewOnLocation ? false : !formData.vill,
      post: viewOnLocation
        ? false
        : !formData.post ||
          formData.post === (lang === "hin" ? "पोस्ट ऑफिस चुनें" : "Select Post Office"),
      pincode: !isPincodeValid,
      err: "",
    };

    if (newErrors.vill || newErrors.post || newErrors.pincode) {
      setSuccess(newErrors);
      newErrors.err = newErrors.vill
        ? lang === "hin"
          ? "गाँव आवश्यक है"
          : "Village Required"
        : newErrors.pincode
          ? lang === "hin"
            ? "पिनकोड 6 अंकों का होना चाहिए"
            : "Pincode Must Have 6 Characters"
          : lang === "hin"
            ? "पोस्ट ऑफिस चुनें"
            : "Select Post Office";
      return;
    }

    if (viewOnLocation) {
      dispatch(setLocationPincode(formData.pincode));
      dispatch(setLocationPost(formData.post));
      navigate("/");
      return;
    }

    setIsLoading((prev) => ({ ...prev, submit: true }));

    try {
      const payload = {
        vill: formData.vill.toUpperCase(),
        post: formData.post,
        dist: formData.dist,
        state: formData.state,
        pincode: formData.pincode,
        [category === "user" ? "userId" : "vendorId"]: userId,
      };

      const response = await axios.patch(`${SERVER_URL}/${category}/update/address`, payload, {
        headers: { Authorization: token },
      });

      const updatedData = { ...userData[0], address: response.data.address };
      const action = category === "user" ? addDataUser : addDataVendor;

      dispatch(action(updatedData));
      localStorage.setItem(category, JSON.stringify(updatedData));

      setSuccess({ message: response.data.message });
      setTimeout(() => {
        setSuccess({ message: "" });
        navigate("/");
      }, 2000);
    } catch (error) {
      setSuccess((prev) => ({
        ...prev,
        err:
          error.response?.data?.message ||
          (lang === "hin" ? "कोई त्रुटि हुई" : "An error occurred"),
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
  }, [
    formData,
    isOnline,
    isPincodeValid,
    viewOnLocation,
    category,
    userId,
    token,
    userData,
    dispatch,
    navigate,
    lang,
  ]);

  // Effects
  useEffect(() => {
    if (success.err) showError(success.err);
    const timer = errors.err
      ? setTimeout(() => setSuccess((prev) => ({ ...prev, err: "" })), 1000)
      : null;
    return () => timer && clearTimeout(timer);
  }, [success.err]);

  useEffect(() => {
    if (success.message) showSuccess(success.message);
    const timer = success.message ? setTimeout(() => setSuccess({ message: "" }), 1000) : null;
    return () => timer && clearTimeout(timer);
  }, [success.message]);

  useEffect(() => {
    fetchPostOfficeDetails();
  }, [fetchPostOfficeDetails]);

  // Helper functions
  const handleCrossInAddress = useCallback(() => navigate("/"), [navigate]);

  const resetLocation = useCallback(() => {
    dispatch(setLocationPincode(""));
    dispatch(setLocationPost(""));
    navigate("/");
  }, [dispatch, navigate]);

  // Get title based on mode
  const getTitle = () => {
    if (viewOnLocation) {
      return lang === "hin" ? "📍 स्थान चुनें" : "📍 Select Location";
    }
    return lang === "hin"
      ? `${CamleCase({ element: category })} पता`
      : `${CamleCase({ element: category })} Address`;
  };

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="address-modern">
        <div className="address-modern-container" ref={containerRef}>
          {/* Decorative Elements */}
          <div className="address-decoration">
            <div className="deco-circle c1"></div>
            <div className="deco-circle c2"></div>
            <div className="deco-circle c3"></div>
          </div>

          {/* Close Button */}
          <button className="address-close-btn" onClick={handleCrossInAddress}>
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
          <div className="address-header">
            <div className="address-badge">{lang === "hin" ? "📍 पता" : "📍 ADDRESS"}</div>
            <h1>{getTitle()}</h1>
            <p>
              {lang === "hin"
                ? "अपना पता दर्ज करें ताकि आसपास के प्रोफेशनल आपको ढूंढ सकें"
                : "Enter your address so nearby professionals can find you"}
            </p>
          </div>

          {/* Form */}
          <div className="address-form">
            {/* Village */}
            {!viewOnLocation && (
              <div className="form-group">
                <label>{lang === "hin" ? "🏘️ गाँव" : "🏘️ Village"}</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder={lang === "hin" ? "गाँव का नाम दर्ज करें" : "Enter village name"}
                    value={formData.vill.toUpperCase()}
                    onChange={(e) => handleChange("vill", e.target.value)}
                    className={errors.vill ? "error" : ""}
                  />
                  {errors.vill && (
                    <span className="input-error">
                      ⚠️ {lang === "hin" ? "गाँव आवश्यक है" : "Village required"}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Pincode */}
            <div className="form-group">
              <label>{lang === "hin" ? "📮 पिनकोड" : "📮 Pincode"}</label>
              <div className="input-wrapper pincode-wrapper">
                <input
                  type="text"
                  placeholder={
                    lang === "hin" ? "6 अंकों का पिनकोड दर्ज करें" : "Enter 6-digit pincode"
                  }
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className={errors.pincode ? "error" : ""}
                  maxLength="6"
                />
                {isLoading.address && <span className="loading-spinner"></span>}
                {errors.pincode && (
                  <span className="input-error">
                    ⚠️ {lang === "hin" ? "6 अंकों का पिनकोड दर्ज करें" : "Enter 6-digit pincode"}
                  </span>
                )}
              </div>
            </div>

            {/* Post Office */}
            <div className="form-group">
              <label>{lang === "hin" ? "🏢 पोस्ट ऑफिस" : "🏢 Post Office"}</label>
              <div className="input-wrapper">
                {postOfficeDetails.length !== 1 ? (
                  <select
                    className="modern-select"
                    value={formData.post}
                    onChange={(e) => handleChange("post", e.target.value)}
                    style={{ border: errors.post ? "2px solid #dc2626" : "" }}
                  >
                    {postOfficeDetails.map((data, i) => (
                      <option key={i} value={data.Name}>
                        {data.Name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={lang === "hin" ? "पोस्ट ऑफिस" : "Post Office"}
                    value={formData.post.toUpperCase()}
                    onChange={(e) => handleChange("post", e.target.value)}
                    className={errors.post ? "error" : ""}
                  />
                )}
                {errors.post && (
                  <span className="input-error">
                    ⚠️ {lang === "hin" ? "पोस्ट ऑफिस चुनें" : "Select post office"}
                  </span>
                )}
              </div>
            </div>

            {/* District */}
            <div className="form-group">
              <label>{lang === "hin" ? "🗺️ जिला" : "🗺️ District"}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder={lang === "hin" ? "जिला" : "District"}
                  value={formData.dist.toUpperCase()}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            {/* State */}
            <div className="form-group">
              <label>{lang === "hin" ? "🏛️ राज्य" : "🏛️ State"}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder={lang === "hin" ? "राज्य" : "State"}
                  value={formData.state.toUpperCase()}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="address-submit-btn"
              onClick={handleSubmitAddress}
              disabled={!isFormValid || isLoading.submit}
            >
              {isLoading.submit ? (
                <span className="loader"></span>
              ) : (
                <span>
                  {lang === "hin" ? "सबमिट करें" : "Submit"}
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

            {/* Pick from Address */}
            {viewOnLocation && (
              <button className="address-pick-btn" onClick={resetLocation}>
                {lang === "hin" ? "📌 पते से चुनें" : "📌 Pick from Address"}
              </button>
            )}
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
};

export default Address;

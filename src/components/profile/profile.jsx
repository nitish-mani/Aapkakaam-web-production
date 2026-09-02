import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { addDataUser, clearDataUser, setPrIsVisibleUser } from "../../utils/userslice";
import { addDataVendor, clearDataVendor, setPrIsVisibleVendor } from "../../utils/vendorslice";
import CamleCase from "../camleCase/camleCase";
import {
  setCategory,
  setLocationPincode,
  setLocationPost,
  setURL,
} from "../../utils/categoryslice";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import male from "../../resources/svg/male-svgrepo-com.svg";
import female from "../../resources/svg/female-svgrepo-com.svg";
import rupee from "../../resources/svg/rupee-1-frame-svgrepo-com.svg";
import { SERVER_URL } from "../../utils/base";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import Attendance from "../Attendance/attendance";
import { showWarning } from "../showAlert";
import serviceData from "../../data/serviceData";

// Translation helper
const t = (lang, en, hi) => {
  return lang === "hin" ? hi : en;
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = localStorage.getItem("category");
  const containerRef = useRef(null);

  // Memoized selectors
  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const token = useMemo(() => `Bearer ${userData[0]?.token}`, [userData]);

  // ✅ ADD THESE STATE VARIABLES
  const [selectedJobForWage, setSelectedJobForWage] = useState("");
  const [showCustomWageType, setShowCustomWageType] = useState(false);
  const [customWageType, setCustomWageType] = useState("");

  // Get all services for job type display
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

  // Get job display name with emoji
  const getJobDisplay = useCallback(
    (jobValue) => {
      if (!jobValue) return t(lang, "Not set", "सेट नहीं");
      const service = allServices.find((s) => s.value === jobValue);
      if (service) {
        return lang === "hin" ? service.labelHindi : service.label;
      }
      return jobValue;
    },
    [allServices, lang],
  );

  // Get category for a job
  const getJobCategory = useCallback(
    (jobValue) => {
      if (!jobValue) return "";
      const service = allServices.find((s) => s.value === jobValue);
      return service ? service.category : "";
    },
    [allServices],
  );

  // Get emoji for job based on category
  const getJobEmoji = useCallback(
    (jobValue) => {
      if (!jobValue) return "🔧";
      const service = allServices.find((s) => s.value === jobValue);
      if (!service) return "🔧";

      const categoryEmojis = {
        Construction: "🏗️",
        Repair: "🔧",
        Services: "🛠️",
        Transport: "🚗",
        Events: "🎉",
        Household: "🏠",
        Education: "📚",
        Health: "💊",
        Beauty: "💄",
        Agriculture: "🌾",
        Cleaning: "🧹",
        Installation: "📡",
      };

      return categoryEmojis[service.category] || "🔧";
    },
    [allServices],
  );

  // Group jobs by category
  const getGroupedJobs = useCallback(
    (jobs) => {
      if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
        return {};
      }

      const groups = {};
      jobs.forEach((job) => {
        const category = getJobCategory(job) || t(lang, "Other", "अन्य");
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(job);
      });
      return groups;
    },
    [getJobCategory, lang],
  );

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

  // State management
  const [editStates, setEditStates] = useState({
    name: false,
    email: false,
    phoneNo: false,
    wageRate: false,
    wageRateType: false,
  });
  const [formData, setFormData] = useState({
    name: userData[0]?.name || "",
    email: userData[0]?.email || "",
    phoneNo: userData[0]?.phoneNo || "",
    wageRate: userData[0]?.wageRate || "",
    wageRateType: userData[0]?.wageRateType || "",
  });
  const [isLoading, setIsLoading] = useState({
    name: false,
    email: false,
    phoneNo: false,
    shareNo: false,
    wageRate: false,
    wageRateType: false,
  });
  const [err, setErr] = useState("");

  // Handlers

  const handleLogout = useCallback(() => {
    if (category === "user") {
      dispatch(clearDataUser());
      dispatch(setPrIsVisibleUser(false));
    } else if (category === "vendor") {
      dispatch(clearDataVendor());
      dispatch(setPrIsVisibleVendor(false));
    }

    dispatch(setLocationPincode(""));
    dispatch(setLocationPost(""));
    dispatch(setCategory(""));
    localStorage.clear();
    navigate("/");
  }, [category, dispatch, navigate]);

  const handleCrossInProfile = useCallback(() => {
    navigate("/");
    setEditStates({
      name: false,
      email: false,
      phoneNo: false,
      wageRate: false,
      wageRateType: false,
    });
    // Reset custom wage type states
    setShowCustomWageType(false);
    setCustomWageType("");
    setSelectedJobForWage("");
  }, [category, dispatch]);

  const showError = useCallback((message) => {
    showWarning(message);
    setTimeout(() => setErr(""), 1000);
  }, []);

  const handleEditToggle = useCallback(
    (field) => {
      setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));
      // Reset custom wage type states when canceling edit
      if (field === "wageRate" && editStates.wageRate) {
        setShowCustomWageType(false);
        setCustomWageType("");
        setSelectedJobForWage("");
      }
    },
    [editStates.wageRate],
  );

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // API call handlers
  const handleNameUpdate = useCallback(async () => {
    if (!navigator.onLine) {
      showError(t(lang, "You are offline", "आप ऑफलाइन हैं"));
      return;
    }

    setIsLoading((prev) => ({ ...prev, name: true }));

    try {
      const endpoint = `${SERVER_URL}/${category}/edit/name`;
      const body =
        category === "user"
          ? { name: formData.name, userId: userData[0].userId }
          : { name: formData.name, vendorId: userData[0].vendorId };

      const response = await axios.patch(endpoint, body, {
        headers: { Authorization: token },
      });

      const updatedData = { ...userData[0], name: response.data.name };

      if (category === "user") {
        dispatch(addDataUser(updatedData));
      } else {
        dispatch(addDataVendor(updatedData));
      }

      localStorage.setItem(category, JSON.stringify(updatedData));
      handleEditToggle("name");
    } catch (error) {
      showError(error.response?.data?.message || t(lang, "Something went wrong", "कुछ गलत हो गया"));
    } finally {
      setIsLoading((prev) => ({ ...prev, name: false }));
    }
  }, [category, formData.name, userData, token, dispatch, handleEditToggle, showError, lang]);

  useEffect(() => {
    if (err) showError(err);
  }, [err]);

  const handleWageRateUpdate = useCallback(async () => {
    if (!navigator.onLine) {
      showError(t(lang, "You are offline", "आप ऑफलाइन हैं"));
      return;
    }

    if (!selectedJobForWage) {
      showError(t(lang, "Please select a job", "कृपया काम चुनें"));
      return;
    }

    const rate = Number(formData.wageRate);

    if (!Number.isFinite(rate) || rate < 0) {
      showError(t(lang, "Please enter a valid wage rate", "कृपया सही मजदूरी दर दर्ज करें"));
      return;
    }

    const rateType = String(formData.wageRateType || "").trim();

    if (!rateType) {
      showError(t(lang, "Please select a rate type", "कृपया दर का प्रकार चुनें"));
      return;
    }

    setIsLoading((prev) => ({
      ...prev,
      wageRate: true,
      wageRateType: true,
    }));

    try {
      const currentJobs = Array.isArray(userData[0]?.type)
        ? [...userData[0].type]
        : userData[0]?.type
          ? [userData[0].type]
          : [];

      if (!currentJobs.length) {
        throw new Error(
          t(lang, "No jobs found for this vendor", "इस विक्रेता के लिए कोई काम नहीं मिला"),
        );
      }

      const jobIndex = currentJobs.indexOf(selectedJobForWage);

      if (jobIndex === -1) {
        throw new Error(t(lang, "Selected job not found", "चुना हुआ काम नहीं मिला"));
      }

      // ----------------------------------------
      // Existing arrays
      // ----------------------------------------

      const currentRates = Array.isArray(userData[0]?.wageRate) ? [...userData[0].wageRate] : [];

      const currentRateTypes = Array.isArray(userData[0]?.wageRateType)
        ? [...userData[0].wageRateType]
        : [];

      // ----------------------------------------
      // Keep arrays aligned with jobs
      // ----------------------------------------

      while (currentRates.length < currentJobs.length) {
        currentRates.push(0);
      }

      while (currentRateTypes.length < currentJobs.length) {
        currentRateTypes.push("");
      }

      // ----------------------------------------
      // Update ONLY selected job
      // ----------------------------------------

      currentRates[jobIndex] = rate;

      currentRateTypes[jobIndex] = rateType;

      // Keep maximum 5
      const wageRates = currentRates.slice(0, 5);

      const wageRateTypes = currentRateTypes.slice(0, 5);

      const response = await axios.patch(
        `${SERVER_URL}/${category}/wageRate`,
        {
          vendorId: userData[0].vendorId,

          type: currentJobs,

          wageRate: wageRates,

          wageRateType: wageRateTypes,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      // ----------------------------------------
      // Use backend response when available
      // ----------------------------------------

      const updatedData = {
        ...userData[0],

        type: Array.isArray(response.data?.type) ? response.data.type : currentJobs,

        wageRate: Array.isArray(response.data?.wageRate) ? response.data.wageRate : wageRates,

        wageRateType: Array.isArray(response.data?.wageRateType)
          ? response.data.wageRateType
          : wageRateTypes,
      };

      dispatch(addDataVendor(updatedData));

      localStorage.setItem(category, JSON.stringify(updatedData));

      // ----------------------------------------
      // Reset editor
      // ----------------------------------------

      setEditStates((prev) => ({
        ...prev,
        wageRate: false,
      }));

      setShowCustomWageType(false);
      setCustomWageType("");
      setSelectedJobForWage("");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          error.message ||
          t(lang, "Something went wrong", "कुछ गलत हो गया"),
      );
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        wageRate: false,
        wageRateType: false,
      }));
    }
  }, [
    category,
    formData.wageRate,
    formData.wageRateType,
    selectedJobForWage,
    userData,
    token,
    dispatch,
    showError,
    lang,
  ]);

  // Navigation handlers
  const navigateTo = useCallback(
    (path, state = {}) => {
      navigate(path, { state });
      if (category === "user") {
        dispatch(setPrIsVisibleUser(false));
      } else {
        dispatch(setPrIsVisibleVendor(false));
      }
    },
    [category, dispatch, navigate],
  );

  const handleEmailEdit = useCallback(() => {
    navigateTo("/editPhoneEmail", { editType: "email" });
  }, [navigateTo]);

  const handleOrdersView = useCallback(() => {
    navigateTo("/viewOrders", { category });
  }, [category, navigateTo]);

  const handleShareView = useCallback(() => {
    navigateTo("/viewShare", { category });
  }, [category, navigateTo]);

  const handleShare = useCallback(() => {
    navigateTo("/share");
  }, [navigateTo]);

  const handleAttendanceReport = useCallback(() => {
    navigateTo("/attendanceReport");
  }, [navigateTo]);

  const handleBookingsView = useCallback(() => {
    navigateTo("/viewBookings", { bookingsType: "view" });
  }, [navigateTo]);

  const handleBookings = useCallback(() => {
    navigateTo("/bookNow", { bookingsType: "book" });
  }, [navigateTo]);

  const handleAddAddress = useCallback(() => {
    navigateTo("/address");
  }, [navigateTo]);

  const handleEarnings = useCallback(() => {
    navigateTo("/earnings");
  }, [navigateTo]);

  const handleAddMoney = useCallback(() => {
    navigateTo("/addMoney");
  }, [navigateTo]);

  const takeLeave = useCallback(() => {
    navigateTo("/leaveManagement");
  }, [navigateTo]);

  const handleCreateConcern = useCallback(() => {
    navigateTo("/concern");
  }, [navigateTo]);

  // Memoized profile image component
  const ProfileImage = useMemo(() => {
    const gender = userData[0]?.gender;
    const imgURL = userData[0]?.imgURL;
    const imgStyle = {
      width: "5rem",
      height: "5rem",
      borderRadius: "50%",
      cursor: "pointer",
    };

    if (gender === "Male") {
      return imgURL ? (
        <img src={imgURL} alt="" style={imgStyle} />
      ) : (
        <img src={male} alt="" style={{ width: "5rem", cursor: "pointer" }} />
      );
    } else {
      return imgURL ? (
        <img src={`${imgURL}?t=${Date.now()}`} alt="" style={imgStyle} />
      ) : (
        <img src={female} alt="" style={{ width: "5rem", cursor: "pointer" }} />
      );
    }
  }, [userData]);

  // Get grouped jobs for display
  const groupedJobs = useMemo(() => {
    if (userData[0]?.type && Array.isArray(userData[0].type)) {
      return getGroupedJobs(userData[0].type);
    }
    return {};
  }, [userData, getGroupedJobs]);

  // Translation helper for section titles
  const sectionTitle = (en, hi) => t(lang, en, hi);
  const sectionSubtitle = (en, hi) => t(lang, en, hi);

  return (
    <main className="profile profile-modern" ref={containerRef}>
      <header className="profile-header">
        <div className="profile-cover">
          <div className="profile-cover-orb profile-cover-orb-one" />
          <div className="profile-cover-orb profile-cover-orb-two" />

          <button
            type="button"
            className="profile-close"
            onClick={handleCrossInProfile}
            aria-label={t(lang, "Close profile", "प्रोफ़ाइल बंद करें")}
          >
            <img src={cross} alt={t(lang, "Close", "बंद करें")} />
          </button>

          <div className="profile-avatar">
            {ProfileImage}
            <span className="profile-online-dot" />
          </div>
        </div>

        <div className="profile-heading">
          <span className="profile-badge">
            {category === "vendor"
              ? t(lang, "🛠️ Service Provider • Professional", "🛠️ सेवा प्रदाता • प्रोफेशनल")
              : t(lang, "👤 Customer • User", "👤 ग्राहक • उपयोगकर्ता")}
          </span>

          <h1>
            <CamleCase element={userData[0]?.name || category} />
          </h1>

          <p>
            {category === "vendor"
              ? t(lang, "Your Professional Profile", "आपका प्रोफेशनल प्रोफाइल")
              : t(lang, "Your Personal Profile", "आपकी व्यक्तिगत प्रोफाइल")}
          </p>
        </div>
      </header>

      {/* ================= AD ================= */}
      <div className="profile-ad">
        <AdsterraBanner_320x50 />
      </div>

      {/* ================= QUICK STATS ================= */}
      <section
        className="profile-stats"
        aria-label={t(lang, "Profile summary", "प्रोफ़ाइल सारांश")}
      >
        <div className="profile-stat-card blue">
          <span className="stat-icon">📦</span>
          <div>
            <strong>{userData[0]?.orders || 0}</strong>
            <small>{t(lang, "Orders", "ऑर्डर")}</small>
          </div>
        </div>

        <div className="profile-stat-card purple">
          <span className="stat-icon">🤝</span>
          <div>
            <strong>{userData[0]?.share || 0}</strong>
            <small>{t(lang, "Shares", "शेयर")}</small>
          </div>
        </div>

        <div className="profile-stat-card green">
          <span className="stat-icon">💰</span>
          <div>
            <strong>₹{Math.round((Number(userData[0]?.balance) || 0) * 100) / 100}</strong>
            <small>{t(lang, "Balance", "बैलेंस")}</small>
          </div>
        </div>
      </section>

      {/* ================= ACCOUNT DETAILS ================= */}
      <section className="profile-section">
        <div className="profile-section-title">
          <span>👤</span>
          <div>
            <h2>{t(lang, "Account Details", "खाते की जानकारी")}</h2>
            <small>{t(lang, "Your personal information", "आपकी व्यक्तिगत जानकारी")}</small>
          </div>
        </div>

        {/* Name */}
        <div className="profile-item">
          <div className="profile-item-icon">👤</div>

          <div className="profile-item-content">
            <small>{t(lang, "Name", "नाम")}</small>

            {editStates.name ? (
              <input
                className="modern-profile-input"
                type="text"
                autoFocus
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t(lang, "Enter name", "नाम दर्ज करें")}
              />
            ) : (
              <strong>
                <CamleCase element={userData[0]?.name || t(lang, "Not available", "उपलब्ध नहीं")} />
              </strong>
            )}
          </div>

          <button
            type="button"
            className="profile-icon-action"
            onClick={editStates.name ? handleNameUpdate : () => handleEditToggle("name")}
            aria-label={
              editStates.name
                ? t(lang, "Save name", "नाम सेव करें")
                : t(lang, "Edit name", "नाम संपादित करें")
            }
          >
            {editStates.name ? (isLoading.name ? "⏳" : "✓") : "✏️"}
          </button>
        </div>

        {/* Mobile */}
        <div className="profile-item">
          <div className="profile-item-icon">📱</div>

          <div className="profile-item-content">
            <small>{t(lang, "Mobile", "मोबाइल")}</small>
            <strong>{userData[0]?.phoneNo || t(lang, "Not available", "उपलब्ध नहीं")}</strong>
          </div>

          <span className={`profile-status ${userData[0]?.verifyPhoneNo ? "verified" : "pending"}`}>
            {userData[0]?.verifyPhoneNo
              ? t(lang, "✓ Verified", "✓ सत्यापित")
              : t(lang, "Verify", "सत्यापित करें")}
          </span>
        </div>

        {/* Email */}
        {userData[0]?.email && (
          <div className="profile-item">
            <div className="profile-item-icon">📧</div>

            <div className="profile-item-content">
              <small>{t(lang, "Email", "ईमेल")}</small>
              <strong>{userData[0].email}</strong>
            </div>

            <button
              type="button"
              className="profile-icon-action"
              onClick={handleEmailEdit}
              aria-label={t(lang, "Edit email", "ईमेल संपादित करें")}
            >
              ✏️
            </button>
          </div>
        )}
      </section>

      {/* ================= CUSTOMER ACTIVITY ================= */}
      <section className="profile-section">
        <div className="profile-section-title">
          <span>⚡</span>
          <div>
            <h2>{t(lang, "My Activity", "मेरी गतिविधियाँ")}</h2>
            <small>{t(lang, "Your recent activity", "आपकी हाल की गतिविधियाँ")}</small>
          </div>
        </div>

        <div className="profile-actions-grid">
          <button type="button" onClick={handleOrdersView}>
            <span>📦</span>
            <strong>{t(lang, "Orders", "ऑर्डर")}</strong>
            <small>{t(lang, "My Orders", "मेरे ऑर्डर")}</small>
          </button>

          <button type="button" onClick={handleShareView}>
            <span>🤝</span>
            <strong>{t(lang, "Shares", "शेयर")}</strong>
            <small>{t(lang, "My Shares", "मेरी शेयरिंग")}</small>
          </button>

          <button type="button" onClick={handleShare}>
            <span>📤</span>
            <strong>{t(lang, "Share", "शेयर")}</strong>
            <small>{t(lang, "Share Now", "अभी शेयर करें")}</small>
          </button>

          <button type="button" onClick={handleEarnings}>
            <span>💰</span>
            <strong>{t(lang, "Earnings", "कमाई")}</strong>
            <small>{t(lang, "View Earnings", "कमाई देखें")}</small>
          </button>

          {category === "vendor" && (
            <button type="button" onClick={handleBookingsView}>
              <span>📅</span>
              <strong>{t(lang, "Bookings", "बुकिंग")}</strong>
              <small>{t(lang, "View Bookings", "बुकिंग देखें")}</small>
            </button>
          )}

          {category === "vendor" && (
            <button type="button" onClick={handleBookings}>
              <span>🚀</span>
              <strong>{t(lang, "Book Now", "अभी बुक करें")}</strong>
              <small>{t(lang, "Book Service", "सेवा बुक करें")}</small>
            </button>
          )}
        </div>
      </section>

      {/* ================= VENDOR PROFILE ================= */}
      {category === "vendor" && (
        <section className="profile-section vendor-section">
          <div className="profile-section-title">
            <span>🛠️</span>
            <div>
              <h2>{t(lang, "Professional Profile", "प्रोफेशनल प्रोफाइल")}</h2>
              <small>{t(lang, "Your professional information", "आपकी प्रोफेशनल जानकारी")}</small>
            </div>
          </div>

          {/* ================= BEAUTIFUL JOB PROFILE ================= */}
          <div className="profile-item profile-job-item">
            <div className="profile-item-icon">🔧</div>

            <div className="profile-item-content">
              <small>{t(lang, "Job Profile", "काम")}</small>

              {userData[0]?.type &&
              Array.isArray(userData[0].type) &&
              userData[0].type.length > 0 ? (
                <div className="job-cards-container">
                  {Object.entries(groupedJobs).map(([categoryName, jobs]) => (
                    <div className="job-tags-modern">
                      {jobs.map((job, index) => (
                        <span key={index} className="job-tag-modern">
                          <span className="job-tag-label">{getJobDisplay(job)}</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Ratings */}
          <div className="profile-item">
            <div className="profile-item-icon">⭐</div>

            <div className="profile-item-content">
              <small>{t(lang, "Customer Rating", "रेटिंग")}</small>
              <strong className="rating-value">
                {userData[0]?.rating
                  ? `${userData[0].rating} / 5`
                  : t(lang, "No Ratings", "कोई रेटिंग नहीं")}
              </strong>
            </div>

            {userData[0]?.ratingCount > 0 && (
              <span className="rating-count">
                {userData[0].ratingCount} {t(lang, "reviews", "समीक्षाएँ")}
              </span>
            )}
          </div>

          {/* Wage Rate */}
          <div className="profile-item profile-item-stack-mobile">
            <div className="profile-item-icon">💵</div>

            <div className="profile-item-content">
              <small>{t(lang, "Service Charge", "सेवा शुल्क")}</small>

              {editStates.wageRate ? (
                <div className="wage-editor-modern">
                  {/* =========================
            JOB SELECTION
        ========================== */}
                  <div className="wage-field-group">
                    <div className="wage-field-header">
                      <span className="wage-field-icon">🔧</span>

                      <label className="wage-label">{t(lang, "Select Job", "काम चुनें")}</label>
                    </div>

                    <div className="wage-select-wrapper">
                      <select
                        className="modern-profile-select wage-select"
                        value={selectedJobForWage || ""}
                        onChange={(e) => {
                          const job = e.target.value;

                          setSelectedJobForWage(job);

                          if (!job) {
                            handleInputChange("wageRate", "");
                            handleInputChange("wageRateType", "");
                            setShowCustomWageType(false);
                            setCustomWageType("");
                            return;
                          }

                          const jobs = Array.isArray(userData[0]?.type)
                            ? userData[0].type
                            : userData[0]?.type
                              ? [userData[0].type]
                              : [];

                          const rates = Array.isArray(userData[0]?.wageRate)
                            ? userData[0].wageRate
                            : [];

                          const rateTypes = Array.isArray(userData[0]?.wageRateType)
                            ? userData[0].wageRateType
                            : [];

                          const index = jobs.indexOf(job);

                          if (index >= 0) {
                            handleInputChange("wageRate", rates[index] ?? "");

                            const currentType = rateTypes[index] ?? "";

                            handleInputChange("wageRateType", currentType);

                            if (
                              currentType &&
                              !["Day", "Hour", "Km", "1k People", "Service"].includes(currentType)
                            ) {
                              setShowCustomWageType(true);
                              setCustomWageType(currentType);
                            } else {
                              setShowCustomWageType(false);
                              setCustomWageType("");
                            }
                          }
                        }}
                      >
                        <option value="">{t(lang, "Select a job", "कोई काम चुनें")}</option>

                        {Array.isArray(userData[0]?.type) &&
                          userData[0].type.map((job) => (
                            <option key={job} value={job}>
                              {getJobEmoji(job)} {getJobDisplay(job)}
                            </option>
                          ))}
                      </select>

                      <span className="select-arrow">▼</span>
                    </div>
                  </div>

                  {/* =========================
            WAGE RATE
        ========================== */}
                  <div className="wage-field-group">
                    <div className="wage-field-header">
                      <span className="wage-field-icon">💰</span>

                      <label className="wage-label">{t(lang, "Rate Amount", "दर राशि")}</label>
                    </div>

                    <div className="wage-input-wrapper">
                      <span className="wage-currency-symbol">₹</span>

                      <input
                        className="modern-profile-input wage-amount-input"
                        type="number"
                        min="0"
                        step="1"
                        placeholder={t(lang, "Enter rate", "दर दर्ज करें")}
                        autoFocus
                        value={formData.wageRate ?? ""}
                        onChange={(e) => handleInputChange("wageRate", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* =========================
            RATE TYPE
        ========================== */}
                  <div className="wage-field-group">
                    <div className="wage-field-header">
                      <span className="wage-field-icon">⏱️</span>

                      <label className="wage-label">{t(lang, "Rate Type", "दर का प्रकार")}</label>
                    </div>

                    <div className="wage-select-wrapper">
                      <select
                        className="modern-profile-select wage-select"
                        value={showCustomWageType ? "Other" : formData.wageRateType || ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "Other") {
                            setShowCustomWageType(true);
                            setCustomWageType(
                              formData.wageRateType &&
                                !["Day", "Hour", "Km", "1k People", "Service"].includes(
                                  formData.wageRateType,
                                )
                                ? formData.wageRateType
                                : "",
                            );

                            return;
                          }

                          setShowCustomWageType(false);
                          setCustomWageType("");

                          handleInputChange("wageRateType", value);
                        }}
                      >
                        <option value="">{t(lang, "Select type", "प्रकार चुनें")}</option>

                        <option value="Day">📅 {t(lang, "Per Day", "प्रति दिन")}</option>

                        <option value="Hour">⏰ {t(lang, "Per Hour", "प्रति घंटा")}</option>

                        <option value="Km">🚗 {t(lang, "Per Km", "प्रति किलोमीटर")}</option>

                        <option value="1k People">
                          👥 {t(lang, "Per 1k People", "प्रति 1 हजार लोग")}
                        </option>

                        <option value="Service">🛠️ {t(lang, "Per Service", "प्रति सेवा")}</option>

                        <option value="Other">✨ {t(lang, "Other", "अन्य")}</option>
                      </select>

                      <span className="select-arrow">▼</span>
                    </div>

                    {/* =========================
              CUSTOM RATE TYPE
          ========================== */}
                    {showCustomWageType && (
                      <div className="custom-wage-input-modern">
                        <div className="custom-wage-input-wrapper">
                          <span className="custom-input-icon">✏️</span>

                          <input
                            className="modern-profile-input custom-type-input-modern"
                            type="text"
                            placeholder={t(
                              lang,
                              "e.g. Per Square Feet, Per Month, etc.",
                              "जैसे: प्रति वर्ग फुट, प्रति महीना, आदि।",
                            )}
                            value={customWageType}
                            onChange={(e) => {
                              const value = e.target.value;

                              setCustomWageType(value);

                              handleInputChange("wageRateType", value);
                            }}
                            autoFocus
                          />
                        </div>

                        <div className="custom-input-tip">
                          <span className="tip-icon">💡</span>

                          <span className="tip-text">
                            {t(
                              lang,
                              "Enter your own custom rate type",
                              "अपनी खुद की कस्टम दर प्रकार दर्ज करें",
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* =========================
            ACTION BUTTONS
        ========================== */}
                  <div className="wage-action-buttons">
                    <button
                      type="button"
                      className="wage-cancel-btn"
                      onClick={() => {
                        setEditStates((prev) => ({
                          ...prev,
                          wageRate: false,
                        }));

                        setShowCustomWageType(false);
                        setCustomWageType("");
                        setSelectedJobForWage("");
                      }}
                    >
                      ✕ {t(lang, "Cancel", "रद्द करें")}
                    </button>

                    <button
                      type="button"
                      className="wage-save-btn-modern"
                      onClick={handleWageRateUpdate}
                      disabled={isLoading.wageRate || !selectedJobForWage}
                    >
                      {isLoading.wageRate ? (
                        <span className="profile-spinner" />
                      ) : (
                        <>
                          <span className="save-icon">✓</span>
                          {t(lang, "Save Service Charge", "सेवा शुल्क सेव करें")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* =========================
          DISPLAY ALL JOB RATES
      ========================== */
                <div className="wage-display-modern">
                  {Array.isArray(userData[0]?.type) && userData[0].type.length > 0 ? (
                    <div className="wage-display-list">
                      {userData[0].type.map((job, index) => {
                        const rate = Array.isArray(userData[0]?.wageRate)
                          ? userData[0].wageRate[index]
                          : null;

                        const rateType = Array.isArray(userData[0]?.wageRateType)
                          ? userData[0].wageRateType[index]
                          : "";

                        return (
                          <div className="wage-display-content" key={`${job}-${index}`}>
                            <span className="wage-display-job">{getJobDisplay(job)}</span>

                            {rate !== undefined && rate !== null && rate !== "" ? (
                              <div>
                                <span className="wage-display-amount">₹{rate}</span>

                                {rateType && (
                                  <>
                                    <span className="wage-display-divider">/</span>

                                    <span className="wage-display-type">{rateType}</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="wage-display-empty">
                                {t(lang, "Rate not set", "दर निर्धारित नहीं")}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="wage-display-empty">
                      {t(lang, "No Wage Rate Set", "कोई मजदूरी दर निर्धारित नहीं")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* =========================
      EDIT / CANCEL BUTTON
  ========================== */}
            <button
              type="button"
              className={`profile-icon-action profile-save-action ${
                editStates.wageRate ? "active" : ""
              }`}
              onClick={
                editStates.wageRate
                  ? () => {
                      setEditStates((prev) => ({
                        ...prev,
                        wageRate: false,
                      }));

                      setShowCustomWageType(false);
                      setCustomWageType("");
                      setSelectedJobForWage("");
                    }
                  : () => handleEditToggle("wageRate")
              }
              title={
                editStates.wageRate
                  ? t(lang, "Cancel", "रद्द करें")
                  : t(lang, "Edit", "संपादित करें")
              }
            >
              {editStates.wageRate ? (
                <span className="cancel-icon">✕</span>
              ) : (
                <span className="edit-icon">✏️</span>
              )}
            </button>
          </div>
          {/* Commission */}
          <div className="profile-item">
            <div className="profile-item-icon">📊</div>

            <div className="profile-item-content">
              <small>{t(lang, "Commission", "कमीशन")}</small>
              <strong className="commission-value">
                {userData[0]?.commission || 0} / {t(lang, "Order", "ऑर्डर")}
              </strong>
            </div>
          </div>
        </section>
      )}

      {/* ================= BALANCE ================= */}
      <section className="profile-section money-section">
        <div className="profile-section-title">
          <span>💰</span>
          <div>
            <h2>{t(lang, "Wallet", "वॉलेट ")}</h2>
            <small>{t(lang, "Your balance ", "आपका बैलेंस ")}</small>
          </div>
        </div>

        <div className="wallet-card">
          <div className="wallet-icon">💳</div>

          <div className="wallet-info">
            <small>{t(lang, "Available Balance", "उपलब्ध बैलेंस")}</small>
            <strong>₹{Math.round((Number(userData[0]?.balance) || 0) * 100) / 100}</strong>
          </div>

          <button type="button" className="wallet-add-button" onClick={handleAddMoney}>
            ➕ {t(lang, "Add Money", "पैसे जोड़ें")}
          </button>
        </div>
      </section>

      {/* ================= COMPLETE ADDRESS ================= */}
      <section className="profile-section">
        <div className="profile-section-title">
          <span>📍</span>
          <div>
            <h2>{t(lang, "My Address", "मेरा पता")}</h2>
            <small>{t(lang, "Complete Address", "पूरा पता")}</small>
          </div>
        </div>

        {userData[0]?.address?.[0] ? (
          <div className="full-address-card">
            <div className="address-main-icon">🏠</div>

            <div className="address-details">
              {userData[0].address[0].vill && (
                <div className="address-line">
                  <span>🏠</span>
                  <strong>{userData[0].address[0].vill}</strong>
                </div>
              )}

              {userData[0].address[0].post && (
                <div className="address-line">
                  <span>📮</span>
                  <span>
                    {t(lang, "Post", "पोस्ट")}: {userData[0].address[0].post}
                  </span>
                </div>
              )}

              {userData[0].address[0].dist && (
                <div className="address-line">
                  <span>🏙️</span>
                  <span>
                    {t(lang, "District", "जिला")}: {userData[0].address[0].dist}
                  </span>
                </div>
              )}

              {userData[0].address[0].state && (
                <div className="address-line">
                  <span>🗺️</span>
                  <span>
                    {t(lang, "State", "राज्य")}: {userData[0].address[0].state}
                  </span>
                </div>
              )}

              {userData[0].address[0].pincode && (
                <div className="address-line">
                  <span>📌</span>
                  <strong>
                    {t(lang, "PIN", "पिन")}: {userData[0].address[0].pincode}
                  </strong>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-address">
            <span>📍</span>
            <div>
              <strong>{t(lang, "Address not added", "पता नहीं जोड़ा गया")}</strong>
              <small>{t(lang, "Add your complete address", "अपना पूरा पता जोड़ें")}</small>
            </div>
          </div>
        )}

        <button type="button" className="full-width-action" onClick={handleAddAddress}>
          📍{" "}
          {userData[0]?.address?.[0]
            ? t(lang, "Change Address", "पता बदलें")
            : t(lang, "Add Address", "पता जोड़ें")}
        </button>
      </section>

      {/* ================= HELP / LOGOUT ================= */}
      <section className="profile-footer-actions">
        <button type="button" className="concern-button" onClick={handleCreateConcern}>
          <span>🆘</span>
          <div>
            <strong>{t(lang, "Raise Concern", "समस्या बताएं")}</strong>
            <small>{t(lang, "Report an issue", "कोई समस्या रिपोर्ट करें")}</small>
          </div>
        </button>

        {category === "vendor" && (
          <button type="button" className="leave-button" onClick={takeLeave}>
            <div>
              <strong>{t(lang, "🌴 Leave Management", "🌴 छुट्टी प्रबंधन")}</strong>
            </div>
          </button>
        )}

        <button type="button" className="logout-button" onClick={handleLogout}>
          <span>🚪</span>
          <div>
            <strong>{t(lang, "Logout", "लॉगआउट")}</strong>
            <small>{t(lang, "Sign out", "साइन आउट करें")}</small>
          </div>
        </button>
      </section>
    </main>
  );
};

export default Profile;

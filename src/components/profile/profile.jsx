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
  }, [category, dispatch]);

  const showError = useCallback((message) => {
    showWarning(message);
    setTimeout(() => setErr(""), 1000);
  }, []);

  const handleEditToggle = useCallback((field) => {
    setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // API call handlers
  const handleNameUpdate = useCallback(async () => {
    if (!navigator.onLine) {
      showError(lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
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
      showError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading((prev) => ({ ...prev, name: false }));
    }
  }, [category, formData.name, userData, token, dispatch, handleEditToggle, showError, lang]);

  useEffect(() => {
    if (err) showError(err);
  }, [err]);

  const handleWageRateUpdate = useCallback(async () => {
    if (!navigator.onLine) {
      showError(lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
      return;
    }
    setIsLoading((prev) => ({ ...prev, wageRate: true }));
    setIsLoading((prev) => ({ ...prev, wageRateType: true }));

    try {
      const response = await axios.patch(
        `${SERVER_URL}/${category}/wageRate`,
        {
          wageRate: formData.wageRate,
          wageRateType: formData.wageRateType,
          vendorId: userData[0].vendorId,
        },
        { headers: { Authorization: token } },
      );

      const updatedData = {
        ...userData[0],
        wageRate: response.data.wageRate,
        wageRateType: response.data.wageRateType,
      };
      dispatch(addDataVendor(updatedData));
      localStorage.setItem(category, JSON.stringify(updatedData));
      handleEditToggle("wageRate");
    } catch (error) {
      showError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading((prev) => ({ ...prev, wageRate: false }));
      setIsLoading((prev) => ({ ...prev, wageRateType: false }));
    }
  }, [
    category,
    formData.wageRate,
    formData.wageRateType,
    userData,
    token,
    dispatch,
    handleEditToggle,
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

  return (
    <main className="profile profile-modern" ref={containerRef}>
      {/* ================= HEADER ================= */}
      <header className="profile-header">
        <div className="profile-cover">
          <div className="profile-cover-orb profile-cover-orb-one" />
          <div className="profile-cover-orb profile-cover-orb-two" />

          <button
            type="button"
            className="profile-close"
            onClick={handleCrossInProfile}
            aria-label="Close profile"
          >
            <img src={cross} alt="Close" />
          </button>

          <div className="profile-avatar">
            {ProfileImage}
            <span className="profile-online-dot" />
          </div>
        </div>

        <div className="profile-heading">
          <span className="profile-badge">
            {category === "vendor" ? "🛠️ सेवा प्रदाता • Professional" : "👤 ग्राहक • Customer"}
          </span>

          <h1>
            <CamleCase element={userData[0]?.name || category} />
          </h1>

          <p>
            {category === "vendor"
              ? "आपका प्रोफेशनल प्रोफाइल • Your Professional Profile"
              : "आपकी प्रोफाइल • Your Personal Profile"}
          </p>
        </div>
      </header>

      {/* ================= AD ================= */}
      <div className="profile-ad">
        <AdsterraBanner_320x50 />
      </div>

      {/* ================= QUICK STATS ================= */}
      <section className="profile-stats" aria-label="Profile summary">
        <div className="profile-stat-card blue">
          <span className="stat-icon">📦</span>
          <div>
            <strong>{userData[0]?.orders || 0}</strong>
            <small>Orders • ऑर्डर</small>
          </div>
        </div>

        <div className="profile-stat-card purple">
          <span className="stat-icon">🤝</span>
          <div>
            <strong>{userData[0]?.share || 0}</strong>
            <small>Shares • शेयर</small>
          </div>
        </div>

        <div className="profile-stat-card green">
          <span className="stat-icon">💰</span>
          <div>
            <strong>₹{Math.round((Number(userData[0]?.balance) || 0) * 100) / 100}</strong>
            <small>Balance • बैलेंस</small>
          </div>
        </div>
      </section>

      {/* ================= ACCOUNT DETAILS ================= */}
      <section className="profile-section">
        <div className="profile-section-title">
          <span>👤</span>
          <div>
            <h2>Account Details</h2>
            <small>खाते की जानकारी</small>
          </div>
        </div>

        {/* Name */}
        <div className="profile-item">
          <div className="profile-item-icon">👤</div>

          <div className="profile-item-content">
            <small>Name • नाम</small>

            {editStates.name ? (
              <input
                className="modern-profile-input"
                type="text"
                autoFocus
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <strong>
                <CamleCase element={userData[0]?.name || "Not available"} />
              </strong>
            )}
          </div>

          <button
            type="button"
            className="profile-icon-action"
            onClick={editStates.name ? handleNameUpdate : () => handleEditToggle("name")}
            aria-label={editStates.name ? "Save name" : "Edit name"}
          >
            {editStates.name ? (isLoading.name ? "⏳" : "✓") : "✏️"}
          </button>
        </div>

        {/* Mobile */}
        <div className="profile-item">
          <div className="profile-item-icon">📱</div>

          <div className="profile-item-content">
            <small>Mobile • मोबाइल</small>
            <strong>{userData[0]?.phoneNo || "Not available"}</strong>
          </div>

          <span className={`profile-status ${userData[0]?.verifyPhoneNo ? "verified" : "pending"}`}>
            {userData[0]?.verifyPhoneNo ? "✓ Verified" : "Verify"}
          </span>
        </div>

        {/* Email */}
        {userData[0]?.email && (
          <div className="profile-item">
            <div className="profile-item-icon">📧</div>

            <div className="profile-item-content">
              <small>Email • ईमेल</small>
              <strong>{userData[0].email}</strong>
            </div>

            <button
              type="button"
              className="profile-icon-action"
              onClick={handleEmailEdit}
              aria-label="Edit email"
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
            <h2>My Activity</h2>
            <small>मेरी गतिविधियाँ</small>
          </div>
        </div>

        <div className="profile-actions-grid">
          <button type="button" onClick={handleOrdersView}>
            <span>📦</span>
            <strong>Orders</strong>
            <small>मेरे ऑर्डर</small>
          </button>

          <button type="button" onClick={handleShareView}>
            <span>🤝</span>
            <strong>Shares</strong>
            <small>मेरी शेयरिंग</small>
          </button>

          <button type="button" onClick={handleShare}>
            <span>📤</span>
            <strong>Share</strong>
            <small>शेयर करें</small>
          </button>

          <button type="button" onClick={handleEarnings}>
            <span>💰</span>
            <strong>Earnings</strong>
            <small>कमाई देखें</small>
          </button>

          {category === "vendor" && (
            <button type="button" onClick={handleBookingsView}>
              <span>📅</span>
              <strong>Bookings</strong>
              <small>बुकिंग देखें</small>
            </button>
          )}

          {category === "vendor" && (
            <button type="button" onClick={handleBookings}>
              <span>🚀</span>
              <strong>Book Now</strong>
              <small>अभी बुक करें</small>
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
              <h2>Professional Profile</h2>
              <small>प्रोफेशनल जानकारी</small>
            </div>
          </div>

          {/* Job Profile */}
          <div className="profile-item">
            <div className="profile-item-icon">🔧</div>

            <div className="profile-item-content">
              <small>Job Profile • काम</small>
              <strong>
                <CamleCase element={userData[0]?.type || "Not set"} />
              </strong>
            </div>
          </div>

          {/* Ratings */}
          <div className="profile-item">
            <div className="profile-item-icon">⭐</div>

            <div className="profile-item-content">
              <small>Customer Rating • रेटिंग</small>
              <strong className="rating-value">
                {userData[0]?.rating ? `${userData[0].rating} / 5` : "No Ratings"}
              </strong>
            </div>

            {userData[0]?.ratingCount > 0 && (
              <span className="rating-count">{userData[0].ratingCount} reviews</span>
            )}
          </div>

          {/* Wage Rate */}
          <div className="profile-item profile-item-stack-mobile">
            <div className="profile-item-icon">💵</div>

            <div className="profile-item-content">
              <small>Wage Rate • मजदूरी</small>

              {editStates.wageRate ? (
                <div className="wage-editor">
                  <input
                    className="modern-profile-input"
                    type="number"
                    min="0"
                    placeholder="₹ Rate"
                    autoFocus
                    value={formData.wageRate}
                    onChange={(e) => handleInputChange("wageRate", e.target.value)}
                  />

                  <select
                    className="modern-profile-select"
                    value={formData.wageRateType}
                    onChange={(e) => handleInputChange("wageRateType", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Day">Per Day</option>
                    <option value="Hour">Per Hour</option>
                    <option value="Km">Per Km</option>
                    <option value="1k People">Per 1k People</option>
                    <option value="Service">Per Service</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <strong className="wage-value">
                  {userData[0]?.wageRate && userData[0]?.wageRateType ? (
                    <>
                      ₹{userData[0].wageRate}
                      <span> / {userData[0].wageRateType}</span>
                    </>
                  ) : (
                    "No Wage Rate"
                  )}
                </strong>
              )}
            </div>

            <button
              type="button"
              className="profile-icon-action profile-save-action"
              onClick={
                editStates.wageRate ? handleWageRateUpdate : () => handleEditToggle("wageRate")
              }
            >
              {isLoading.wageRate ? (
                <span className="profile-spinner" />
              ) : editStates.wageRate ? (
                "✓"
              ) : (
                "✏️"
              )}
            </button>
          </div>

          {/* Commission */}
          <div className="profile-item">
            <div className="profile-item-icon">📊</div>

            <div className="profile-item-content">
              <small>Commission • कमीशन</small>
              <strong className="commission-value">{userData[0]?.commission || 0} / Order</strong>
            </div>
          </div>
        </section>
      )}

      {/* ================= BALANCE ================= */}
      <section className="profile-section money-section">
        <div className="profile-section-title">
          <span>💰</span>
          <div>
            <h2>Wallet & Earnings</h2>
            <small>वॉलेट और कमाई</small>
          </div>
        </div>

        <div className="wallet-card">
          <div className="wallet-icon">💳</div>

          <div className="wallet-info">
            <small>Available Balance • उपलब्ध बैलेंस</small>
            <strong>₹{Math.round((Number(userData[0]?.balance) || 0) * 100) / 100}</strong>
          </div>

          <button type="button" className="wallet-add-button" onClick={handleAddMoney}>
            ➕ Add Money
          </button>
        </div>
      </section>

      {/* ================= COMPLETE ADDRESS ================= */}
      <section className="profile-section">
        <div className="profile-section-title">
          <span>📍</span>
          <div>
            <h2>My Address</h2>
            <small>मेरा पूरा पता • Complete Address</small>
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
                  <span>Post: {userData[0].address[0].post}</span>
                </div>
              )}

              {userData[0].address[0].dist && (
                <div className="address-line">
                  <span>🏙️</span>
                  <span>District: {userData[0].address[0].dist}</span>
                </div>
              )}

              {userData[0].address[0].state && (
                <div className="address-line">
                  <span>🗺️</span>
                  <span>State: {userData[0].address[0].state}</span>
                </div>
              )}

              {userData[0].address[0].pincode && (
                <div className="address-line">
                  <span>📌</span>
                  <strong>PIN: {userData[0].address[0].pincode}</strong>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-address">
            <span>📍</span>
            <div>
              <strong>Address not added</strong>
              <small>अभी अपना पूरा पता जोड़ें • Add your address</small>
            </div>
          </div>
        )}

        <button type="button" className="full-width-action" onClick={handleAddAddress}>
          📍 {userData[0]?.address?.[0] ? "Change Address • पता बदलें" : "Add Address • पता जोड़ें"}
        </button>
      </section>

      {/* ================= HELP / LOGOUT ================= */}
      <section className="profile-footer-actions">
        <button type="button" className="concern-button" onClick={handleCreateConcern}>
          <span>🆘</span>
          <div>
            <strong>Raise Concern</strong>
            <small>समस्या बताएं</small>
          </div>
        </button>

        {category === "vendor" && (
          <button type="button" className="leave-button" onClick={takeLeave}>
            <div>
              <strong>🌴 Leave Management • छुट्टी प्रबंधन</strong>
            </div>
          </button>
        )}

        <button type="button" className="logout-button" onClick={handleLogout}>
          <span>🚪</span>
          <div>
            <strong>Logout</strong>
            <small>लॉगआउट</small>
          </div>
        </button>
      </section>
    </main>
  );
};

export default Profile;

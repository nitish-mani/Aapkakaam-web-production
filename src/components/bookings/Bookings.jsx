// Modern Bookings Page - AapkaKaam (with color-coded calendar)

import Calendar from "../calendar/calendar";
import "./bookings.css";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { getCalendar } from "@skolacode/calendar-js";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { useSelector } from "react-redux";
import BookingList from "../bookingList/bookingList";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showError, showSuccess } from "../showAlert";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_HINDI = [
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

export default function Bookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const { bookingsType } = location.state || { bookingsType: "view" };

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const category = localStorage.getItem("category");
  const userData = useSelector((store) => store[category].data);
  const isSelectedDateValid = useSelector((store) => store.category.isSelectedDateValid);
  const clearDateField = useSelector((store) => store.category.clearDateField);

  const now = new Date();
  const [date, setDate] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDateClicked, setIsDateClicked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [vill, setVill] = useState("");
  const [pincode, setPincode] = useState("");
  const [post, setPost] = useState("");
  const [dist, setDist] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  const token = `Bearer ${JSON.parse(localStorage.getItem(category))?.token}`;
  const userId = JSON.parse(localStorage.getItem(category))?.[`${category}Id`];
  const bookedDate = new Date(`${year}/${month + 1}/${date}`).toDateString();
  const calendar = useMemo(() => getCalendar(month, year).calendar, [month, year]);

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

  // Process bookings data with color coding
  const {
    pendingDates,
    completeDates,
    cancelDates,
    pendingData,
    completeData,
    cancelData,
    bookingStatusMap,
  } = useMemo(() => {
    const pendingDates = [];
    const completeDates = [];
    const cancelDates = [];
    const pendingData = [];
    const completeData = [];
    const cancelData = [];
    const bookingStatusMap = {};

    if (Array.isArray(bookings)) {
      bookings.forEach((booking) => {
        const bookingDate = new Date(booking.bookingDate).toDateString();
        const parts = bookingDate.split(" ");
        const monthNames = {
          Jan: 1,
          Feb: 2,
          Mar: 3,
          Apr: 4,
          May: 5,
          Jun: 6,
          Jul: 7,
          Aug: 8,
          Sep: 9,
          Oct: 10,
          Nov: 11,
          Dec: 12,
        };
        const day = parseInt(parts[2], 10);
        const bookingYear = parseInt(parts[3], 10);
        const bookingMonth = monthNames[parts[1]];

        if (bookingYear == year && bookingMonth == month + 1) {
          if (!booking.cancelOrder && !booking.orderCompleted) {
            pendingDates.push(day);
            pendingData.push(booking);
            bookingStatusMap[day] = "pending";
          } else if (!booking.cancelOrder && booking.orderCompleted) {
            completeDates.push(day);
            completeData.push(booking);
            bookingStatusMap[day] = "completed";
          } else if (booking.cancelOrder && !booking.orderCompleted) {
            cancelDates.push(day);
            cancelData.push(booking);
            bookingStatusMap[day] = "canceled";
          }
        }
      });
    }

    return {
      pendingDates,
      completeDates,
      cancelDates,
      pendingData,
      completeData,
      cancelData,
      bookingStatusMap,
    };
  }, [bookings, month, year]);

  // Get color for calendar status
  const getBookingColor = useCallback(
    (day) => {
      const status = bookingStatusMap[day];
      if (status === "pending") return "#2563eb";
      if (status === "completed") return "#16a34a";
      if (status === "canceled") return "#dc2626";
      return null;
    },
    [bookingStatusMap],
  );

  // Get status label for calendar
  const getStatusLabel = useCallback(
    (day) => {
      const status = bookingStatusMap[day];
      const labels = {
        pending: lang === "hin" ? "लंबित" : "Pending",
        completed: lang === "hin" ? "पूर्ण" : "Completed",
        canceled: lang === "hin" ? "रद्द" : "Canceled",
      };
      return status ? labels[status] : null;
    },
    [bookingStatusMap, lang],
  );

  // Set booking date when date is selected
  useEffect(() => {
    setBookingDate(
      isSelectedDateValid && isDateClicked && clearDateField
        ? `${date} / ${month + 1} / ${year}`
        : "",
    );
  }, [date, month, year, isSelectedDateValid, isDateClicked, clearDateField]);

  // Fetch bookings data
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${SERVER_URL}/vendor/getBookings/${userId}/${month}/${year}`,
        { headers: { Authorization: token } },
      );
      setBookings(response.data);
    } catch (err) {
      showError(
        err.response?.data?.message ||
          (lang === "hin" ? "बुकिंग लोड करने में विफल" : "Failed to load bookings"),
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [month, year, userId, token, lang]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle booking submission
  const handleBookings = useCallback(async () => {
    if (completeDates.includes(date) || pendingDates.includes(date)) {
      showError(
        lang === "hin"
          ? "इस तारीख को बुकिंग पहले से मौजूद है"
          : "Booking already exists on this date",
      );
      return;
    }

    if (!name || !phoneNo || !vill || !pincode || !post || !dist) {
      showError(lang === "hin" ? "कृपया सभी फ़ील्ड भरें" : "Please fill all fields");
      return;
    }

    try {
      setIsClicked(true);

      const bookingResponse = await axios.post(
        `${SERVER_URL}/bookings/postToBookingsV`,
        {
          userId: userData[0].vendorId,
          vendorId: userData[0].vendorId,
          bookingDate: bookedDate,
          name,
          pincode,
          phoneNo,
          vill,
          post,
          dist,
          type: userData[0].type,
          isSelfBooking: true,
        },
        { headers: { Authorization: token } },
      );

      setSuccess(lang === "hin" ? "बुकिंग सफल!" : "Booking successful!");
      setTimeout(() => {
        setSuccess("");
        setName("");
        setPhoneNo("");
        setVill("");
        setPincode("");
        setPost("");
        setDist("");
        setBookingDate("");
        setShowForm(false);
        fetchBookings();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || (lang === "hin" ? "बुकिंग विफल" : "Booking failed"));
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsClicked(false);
    }
  }, [
    date,
    completeDates,
    pendingDates,
    name,
    phoneNo,
    vill,
    pincode,
    post,
    dist,
    userData,
    token,
    bookedDate,
    fetchBookings,
    lang,
  ]);

  const handleCrossClick = () => navigate("/");

  const renderStatusLabel = (status) => {
    const labels = {
      pending: lang === "hin" ? "लंबित" : "Pending",
      complete: lang === "hin" ? "पूर्ण" : "Completed",
      cancel: lang === "hin" ? "रद्द" : "Canceled",
    };
    return labels[status] || status;
  };

  const renderStatusColor = (status) => {
    const colors = {
      pending: "#2563eb",
      complete: "#16a34a",
      cancel: "#dc2626",
    };
    return colors[status] || "#64748b";
  };

  const renderStatusButton = (status, color) => (
    <button
      className={`booking-tab-btn ${orderStatus === status ? "active" : ""}`}
      onClick={() => setOrderStatus(status)}
      style={{ "--tab-color": color }}
    >
      <span className={`tab-dot ${status}`}></span>
      {renderStatusLabel(status)}
      <span className="tab-count">
        {status === "pending"
          ? pendingData.length
          : status === "complete"
            ? completeData.length
            : cancelData.length}
      </span>
    </button>
  );

  const renderBookingsList = () => {
    if (isLoading) {
      return (
        <div className="booking-loading-modern">
          <div className="loading-spinner-modern"></div>
          <p>{lang === "hin" ? "बुकिंग लोड हो रही है..." : "Loading bookings..."}</p>
        </div>
      );
    }

    if (!pendingDates.length && !completeDates.length && !cancelDates.length) {
      return (
        <div className="booking-empty-modern">
          <span className="empty-icon">📅</span>
          <h3>{lang === "hin" ? "इस महीने कोई बुकिंग नहीं" : "No bookings this month"}</h3>
          <p>
            {lang === "hin"
              ? "इस महीने के लिए कोई बुकिंग उपलब्ध नहीं है"
              : "No bookings available for this month"}
          </p>
        </div>
      );
    }

    let dataToRender = [];
    let emptyMessage = "";

    switch (orderStatus) {
      case "pending":
        dataToRender = pendingData;
        emptyMessage =
          lang === "hin" ? "इस महीने कोई लंबित बुकिंग नहीं" : "No pending bookings this month";
        break;
      case "complete":
        dataToRender = completeData;
        emptyMessage =
          lang === "hin" ? "इस महीने कोई पूर्ण बुकिंग नहीं" : "No completed bookings this month";
        break;
      case "cancel":
      default:
        dataToRender = cancelData;
        emptyMessage =
          lang === "hin" ? "इस महीने कोई रद्द बुकिंग नहीं" : "No canceled bookings this month";
    }

    return dataToRender.length ? (
      dataToRender.map((data, i) => <BookingList data={data} key={i} lang={lang} />)
    ) : (
      <div className="booking-empty-modern small">
        <span className="empty-icon">📭</span>
        <p>{emptyMessage}</p>
      </div>
    );
  };

  useEffect(() => {
    if (success) showSuccess(success);
    else if (error) showError(error);
    else if (!isSelectedDateValid && isDateClicked)
      showError(lang === "hin" ? "आप पिछली तारीख चुन नहीं सकते" : "You can't select previous date");
  }, [success, isSelectedDateValid, error, isDateClicked, lang]);

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="bookings-modern" ref={containerRef}>
        <div className="bookings-modern-container">
          {/* Close Button */}
          <button className="bookings-close-btn" onClick={handleCrossClick}>
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
          <div className="bookings-header-modern">
            <div className="bookings-header-left">
              <div className="header-icon-wrapper">
                <span className="header-icon">{bookingsType === "view" ? "📅" : "📖"}</span>
              </div>
              <div>
                <h1>
                  {bookingsType === "view"
                    ? lang === "hin"
                      ? "मेरी बुकिंग"
                      : "My Bookings"
                    : lang === "hin"
                      ? "बुक करें"
                      : "Book Now"}
                </h1>
                <p>
                  {bookingsType === "view"
                    ? lang === "hin"
                      ? "अपनी सभी बुकिंग देखें"
                      : "View all your bookings"
                    : lang === "hin"
                      ? "नई बुकिंग करें"
                      : "Create a new booking"}
                </p>
              </div>
            </div>
            <div className="bookings-month-display">
              <span className="month-icon">📅</span>
              <span className="month-text">
                {lang === "hin" ? MONTHS_HINDI[month] : MONTHS[month]} {year}
              </span>
            </div>
          </div>

          {/* Legend for Calendar */}
          <div className="bookings-legend-modern">
            <span className="legend-title">
              {lang === "hin" ? "📌 बुकिंग स्थिति" : "📌 Booking Status"}
            </span>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-dot pending-dot"></span>
                <span className="legend-label">{lang === "hin" ? "लंबित" : "Pending"}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot completed-dot"></span>
                <span className="legend-label">{lang === "hin" ? "पूर्ण" : "Completed"}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot canceled-dot"></span>
                <span className="legend-label">{lang === "hin" ? "रद्द" : "Canceled"}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bookings-content-modern">
            {bookingsType === "view" ? (
              <div className="bookings-view-modern">
                {/* Tabs */}
                <div className="booking-tabs-modern">
                  {renderStatusButton("pending", "#2563eb")}
                  {renderStatusButton("complete", "#16a34a")}
                  {renderStatusButton("cancel", "#dc2626")}
                </div>

                {/* Bookings List */}
                <div className="booking-list-modern">{renderBookingsList()}</div>
              </div>
            ) : (
              <div className="bookings-form-modern">
                {!showForm ? (
                  <div className="booking-form-prompt">
                    <div className="prompt-icon">📝</div>
                    <h3>{lang === "hin" ? "बुकिंग फॉर्म" : "Booking Form"}</h3>
                    <p>
                      {lang === "hin"
                        ? "नई बुकिंग बनाने के लिए नीचे दिए गए बटन पर क्लिक करें"
                        : "Click the button below to create a new booking"}
                    </p>
                    <button className="show-form-btn" onClick={() => setShowForm(true)}>
                      <span>➕</span> {lang === "hin" ? "बुकिंग फॉर्म खोलें" : "Open Booking Form"}
                    </button>
                  </div>
                ) : (
                  <div className="booking-form-fields">
                    <div className="form-header">
                      <h3>{lang === "hin" ? "बुकिंग विवरण" : "Booking Details"}</h3>
                      <button className="close-form-btn" onClick={() => setShowForm(false)}>
                        ✕
                      </button>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>{lang === "hin" ? "नाम" : "Name"} *</label>
                        <input
                          type="text"
                          placeholder={lang === "hin" ? "नाम दर्ज करें" : "Enter name"}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="modern-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>{lang === "hin" ? "मोबाइल नंबर" : "Mobile Number"} *</label>
                        <input
                          type="number"
                          placeholder={
                            lang === "hin" ? "मोबाइल नंबर दर्ज करें" : "Enter mobile number"
                          }
                          value={phoneNo}
                          onChange={(e) => setPhoneNo(e.target.value)}
                          className="modern-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>{lang === "hin" ? "गाँव" : "Village"} *</label>
                        <input
                          type="text"
                          placeholder={lang === "hin" ? "गाँव दर्ज करें" : "Enter village"}
                          value={vill}
                          onChange={(e) => setVill(e.target.value)}
                          className="modern-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>{lang === "hin" ? "पिनकोड" : "Pincode"} *</label>
                        <input
                          type="text"
                          placeholder={lang === "hin" ? "पिनकोड दर्ज करें" : "Enter pincode"}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="modern-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>{lang === "hin" ? "पोस्ट" : "Post"} *</label>
                        <input
                          type="text"
                          placeholder={lang === "hin" ? "पोस्ट दर्ज करें" : "Enter post"}
                          value={post}
                          onChange={(e) => setPost(e.target.value)}
                          className="modern-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>{lang === "hin" ? "जिला" : "District"} *</label>
                        <input
                          type="text"
                          placeholder={lang === "hin" ? "जिला दर्ज करें" : "Enter district"}
                          value={dist}
                          onChange={(e) => setDist(e.target.value)}
                          className="modern-input"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>{lang === "hin" ? "बुकिंग तारीख" : "Booking Date"}</label>
                        <input
                          type="text"
                          placeholder={
                            lang === "hin" ? "कैलेंडर से तारीख चुनें" : "Select date from calendar"
                          }
                          value={bookingDate}
                          readOnly
                          className="modern-input date-input"
                        />
                      </div>
                    </div>

                    <button
                      className="submit-booking-btn"
                      onClick={handleBookings}
                      disabled={isClicked}
                    >
                      {isClicked ? (
                        <span className="btn-spinner"></span>
                      ) : (
                        <span>{lang === "hin" ? "📖 बुक करें" : "📖 Book Now"}</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Calendar Section */}
          <div className="bookings-calendar-modern">
            <Calendar
              bookingDate={
                orderStatus === "pending"
                  ? pendingDates
                  : orderStatus === "complete"
                    ? completeDates
                    : cancelDates
              }
              orderStatus={orderStatus}
              month={month}
              year={year}
              months={MONTHS}
              setDate={setDate}
              setMonth={setMonth}
              setYear={setYear}
              calendar={calendar}
              setIsDateClicked={setIsDateClicked}
              setBooking_date={setBookingDate}
              lang={lang}
              getBookingColor={getBookingColor}
              getStatusLabel={getStatusLabel}
              bookingStatusMap={bookingStatusMap}
              language={lang}
            />
          </div>
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
}

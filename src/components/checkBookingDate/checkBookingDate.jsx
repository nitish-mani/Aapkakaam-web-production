import Calendar from "../calendar/calendar";
import "./checkBookingDate.css";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { getCalendar } from "@skolacode/calendar-js";
import { useSelector } from "react-redux";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showError } from "../showAlert";

export default function CheckBookingDate() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef(null);

  // Get service data from location state
  const jobType = location.state?.jobType || "";
  const serviceData = location.state?.serviceData || null;

  const category = localStorage.getItem("category");
  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );
  const lang = useSelector((store) => store.category.selectLanguage);
  const post = userData[0]?.address[0]?.post;
  const dist = userData[0]?.address[0]?.dist;

  const isSelectedDateValid = useSelector((store) => store.category.isSelectedDateValid);
  const clearDateField = useSelector((store) => store.category.clearDateField);

  const months = [
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

  const current_date = new Date().getDate();
  const current_month = new Date().getMonth();
  const current_year = new Date().getFullYear();

  const [month, setMonth] = useState(current_month);
  const [year, setYear] = useState(current_year);
  const [date, setDate] = useState(current_date);
  const [booking_date, setBooking_date] = useState("");
  const [isDateClicked, setIsDateClicked] = useState(false);

  const calendar = getCalendar(month, year).calendar;
  const bookingDate = [];
  const bookingUserData = [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    // Also scroll the container to top
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (isSelectedDateValid && isDateClicked && clearDateField)
      setBooking_date(`${date} / ${month + 1} / ${year}`);
    else setBooking_date("");
  }, [date, month, year, isSelectedDateValid, isDateClicked, clearDateField]);

  function handleCrossInShare() {
    navigate("/");
  }

  function handleCheckBookingDate() {
    if (booking_date) {
      navigate("/availableVendor", {
        state: {
          jobType: jobType,
          date,
          month,
          year,
          serviceData: serviceData,
        },
      });
    }
  }

  useEffect(() => {
    if (!isSelectedDateValid && isDateClicked) {
      showError("Selected date is not available for booking");
    }
  }, [isSelectedDateValid, isDateClicked]);

  // Get the description based on language
  const getDescription = () => {
    if (!serviceData) return "";
    return lang === "hin" ? serviceData.descriptionHindi : serviceData.description;
  };

  const getServiceTitle = () => {
    if (!serviceData) return jobType;
    return lang === "hin" ? serviceData.hindi : serviceData.title;
  };

  const getServiceEmoji = () => {
    const emojiMap = {
      Labour: "👷",
      Mason: "🧱",
      Electrician: "⚡",
      Plumber: "🔧",
      Painter: "🎨",
      Carpenter: "🪚",
      "Tiles Fitter": "🔲",
      "Marble Fitter": "💎",
      Shuttering: "🏗️",
      Welder: "🔥",
      Fabricator: "🔩",
      "Glass Fitter": "🪟",
      "POP Worker": "🎭",
      "AC Mechanic": "❄️",
      "Fridge Mechanic": "🧊",
      "Bike Repair": "🏍️",
      "Car Repair": "🚗",
      "Laptop Repair": "💻",
      "CCTV Installation": "📹",
      "Inverter Repair": "🔋",
      "Microwave Repair": "📡",
      Driver: "🚕",
      "Home Tutor": "📚",
      "Milk Man": "🥛",
      "Washer Man": "👕",
      Gardener: "🌱",
      "Security Guard": "🛡️",
      "House Maid": "🧹",
      "Baby Sitter": "👶",
      "Old Age Caregiver": "🤝",
      Parlour: "💄",
      "Mehandi Maker": "🤲",
      "Pandit Ji": "🕉️",
      Cook: "🍳",
      Lights: "💡",
      "Tent House": "⛺",
      "Kirtan Mandali": "🎵",
      Generator: "⚡",
      DJ: "🎧",
      Waiter: "🍽️",
      RO: "💧",
      Chaat: "🌮",
      "Dulha Rath": "🐎",
      "Paan Wala": "🌿",
      "Fruits Seller": "🍎",
      "Marriage Hall": "💒",
      Photographer: "📸",
      Videographer: "🎥",
      "Makeup Artist": "💋",
      "Band Party": "🥁",
      Fireworks: "🎆",
      Catering: "🍲",
      "Four Wheeler": "🚙",
      Bus: "🚌",
      Auto: "🛺",
      "E-Rikshaw": "🛵",
      "Mini Truck": "🚚",
      Dhankutti: "🌾",
      "Aata Chakki": "🌾",
      "Latrine Tank Cleaner": "🧹",
      "Pual Cutter": "✂️",
      "Bhoonsa Pual Seller": "🌾",
      "Pest Control": "🐜",
      "Deep Cleaning": "🧽",
      "Water Tank Cleaning": "💧",
      "Geyser Repair": "🔥",
      "Washing Machine Repair": "🧺",
      "TV Repair": "📺",
      "Computer Trainer": "💻",
    };
    return emojiMap[serviceData?.title] || "🔧";
  };

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="modern-booking-page" ref={pageRef}>
        {/* Close Button */}
        <button className="booking-close-btn" onClick={handleCrossInShare}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <div className="booking-header">
          <div className="booking-service-icon">
            <span>{getServiceEmoji()}</span>
          </div>
          <div className="booking-header-content">
            <h1>📅 Check Booking Date</h1>
            <div className="booking-service-info">
              <h2>{getServiceTitle()}</h2>
              <span className="booking-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {post}, {dist}
              </span>
            </div>
          </div>
        </div>

        {/* Service Description */}
        {serviceData && (
          <div className="booking-description-card">
            <div className="description-icon">📋</div>
            <div className="description-content">
              <span className="description-label">
                {lang === "hin" ? "सेवा विवरण" : "Service Description"}
              </span>
              <p className="description-text">{getDescription()}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="booking-main-content">
          <div className="booking-form-section">
            <div className="form-group">
              <label>{lang === "hin" ? "चुनी गई तारीख" : "Selected Date"}</label>
              <div className="date-input-wrapper">
                <input
                  type="text"
                  placeholder={
                    lang === "hin" ? "कैलेंडर से तारीख चुनें" : "Select Date From Calendar"
                  }
                  value={booking_date}
                  readOnly
                  className={booking_date ? "filled" : ""}
                />
                {booking_date && <span className="date-confirmed-badge">✓</span>}
              </div>
            </div>

            <button
              className={`proceed-btn ${booking_date ? "active" : ""}`}
              onClick={handleCheckBookingDate}
              disabled={!booking_date}
            >
              <span>{lang === "hin" ? "आगे बढ़ें" : "Proceed"}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="booking-calendar-section">
            <Calendar
              bookingDate={bookingDate}
              bookingUserData={bookingUserData}
              month={month}
              year={year}
              months={months}
              setDate={setDate}
              setMonth={setMonth}
              setYear={setYear}
              calendar={calendar}
              setIsDateClicked={setIsDateClicked}
              setBooking_date={setBooking_date}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <AdsterraBanner />
    </>
  );
}

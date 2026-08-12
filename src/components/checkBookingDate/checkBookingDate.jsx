import Calendar from "../calendar/calendar";
import "./checkBookingDate.css";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCalendar } from "@skolacode/calendar-js";
import { useSelector } from "react-redux";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showError } from "../showAlert";

export default function CheckBookingDate() {
  const navigate = useNavigate();
  const location = useLocation();
  const jobType = location.state.jobType;
  const category = localStorage.getItem("category");
  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );
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

  const calendar = getCalendar(month, year).calendar;

  const [booking_date, setBooking_date] = useState("");
  const [isDateClicked, setIsDateClicked] = useState(false);

  const bookingDate = [];
  const bookingUserData = [];

  useEffect(() => {
    if (isSelectedDateValid && isDateClicked && clearDateField)
      setBooking_date(`${date} / ${month + 1} / ${year}`);
    else setBooking_date("");
  }, [date, month, year]);

  function hanldeCrossInShare() {
    navigate("/");
  }

  function handleCheckBookingDate() {
    if (booking_date) {
      navigate("/availableVendor", {
        state: { jobType: jobType, date, month, year },
      });
    }
  }
  useEffect(() => {
    if (!isSelectedDateValid) {
      showError("Selected date is not available for booking");
    }
  }, [isSelectedDateValid]);

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="views-P">
        <img src={cross} alt="cross" onClick={hanldeCrossInShare} />
        <h1
          style={{
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(105, 102, 102, 0.637)",
          }}
        >
          Check Booking Date{" "}
          <span style={{ fontSize: "1.5rem", marginLeft: "1rem" }}>
            (for {jobType} in {post}, {dist})
          </span>
        </h1>
        <div className="checkBookingDate">
          <div>
            <input
              type="text"
              placeholder="Select Date From Calendar"
              value={booking_date}
              readOnly
            />
            <button className="btn" onClick={handleCheckBookingDate}>
              Proceed
            </button>
          </div>
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
          />
        </div>
      </div>

      <AdsterraBanner />
    </>
  );
}

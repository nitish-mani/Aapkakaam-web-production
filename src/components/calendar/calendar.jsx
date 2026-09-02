import React, { useCallback, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import "./calendar.css";

import { setClearDateField, setIsSelectedDateValid } from "../../utils/categoryslice";

import { showWarning } from "../showAlert";

// ============================================================
// DAYS
// ============================================================

const DAYS_OF_WEEK = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

  hi: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
};

// ============================================================
// HINDI MONTHS
// ============================================================

const MONTHS_HI = [
  "जनवरी",
  "फ़रवरी",
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

// ============================================================
// ENGLISH MONTHS
// ============================================================

const MONTHS_EN = [
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

// ============================================================
// STATUS TEXT
// ============================================================

const STATUS_TEXT = {
  en: {
    today: "Today",
    complete: "Completed",
    cancel: "Canceled",
    pending: "Pending",
    alreadyBooked: "Already Booked...",
    pastDate: "Past Date",
    previousYear: "Previous year",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    nextYear: "Next year",
  },

  hi: {
    today: "आज",
    complete: "पूरा हुआ",
    cancel: "रद्द",
    pending: "पेंडिंग",
    alreadyBooked: "पहले से बुक है...",
    pastDate: "पुरानी तारीख",
    previousYear: "पिछला वर्ष",
    previousMonth: "पिछला महीना",
    nextMonth: "अगला महीना",
    nextYear: "अगला वर्ष",
  },
};

// ============================================================
// MIN YEAR
// ============================================================

const MIN_YEAR = 2000;

// ============================================================
// NORMALIZE LANGUAGE
// ============================================================

const normalizeLanguage = (language) => {
  const value = String(language ?? "")
    .trim()
    .toLowerCase();

  if (value === "hi" || value === "hin" || value === "hindi") {
    return "hi";
  }

  return "en";
};

// ============================================================
// CALENDAR
// ============================================================

const Calendar = ({
  bookingDate,
  orderStatus,
  months,
  month,
  year,
  setDate,
  setMonth,
  setYear,
  calendar,
  setIsDateClicked,
  setBooking_date = () => {},
  language,
}) => {
  const dispatch = useDispatch();

  // ==========================================================
  // LANGUAGE
  //
  // Redux is the primary source.
  //
  // Supports:
  // "en"
  // "eng"
  // "hi"
  // "hin"
  //
  // ==========================================================

  const reduxLanguage = useSelector((store) => store.category?.selectLanguage);

  const lang = useMemo(() => {
    return normalizeLanguage(reduxLanguage ?? language ?? "en");
  }, [reduxLanguage, language]);

  // ==========================================================
  // TRANSLATION HELPER
  // ==========================================================

  const t = useCallback(
    (en, hi) => {
      return lang === "hi" ? hi : en;
    },
    [lang],
  );

  // ==========================================================
  // DAYS
  // ==========================================================

  const daysOfWeek = useMemo(() => {
    return DAYS_OF_WEEK[lang] || DAYS_OF_WEEK.en;
  }, [lang]);

  // ==========================================================
  // STATUS TEXT
  // ==========================================================

  const statusText = useMemo(() => {
    return STATUS_TEXT[lang] || STATUS_TEXT.en;
  }, [lang]);

  // ==========================================================
  // CURRENT DATE
  // ==========================================================

  const currentDate = useMemo(() => {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const current_date = currentDate.getDate();

  const current_month = currentDate.getMonth();

  const current_year = currentDate.getFullYear();

  // ==========================================================
  // MONTH NAME
  // ==========================================================

  const monthName = useMemo(() => {
    if (month === undefined || month === null) {
      return "";
    }

    if (lang === "hi") {
      return MONTHS_HI[month] || "";
    }

    return MONTHS_EN[month] || months?.[month] || "";
  }, [lang, month, months]);

  // ==========================================================
  // CREATE DATE
  // ==========================================================

  const createDate = useCallback((checkYear, checkMonth, day) => {
    return new Date(checkYear, checkMonth, day);
  }, []);

  // ==========================================================
  // CURRENT DAY
  // ==========================================================

  const isCurrentDay = useCallback(
    (checkYear, checkMonth, day) => {
      return checkYear === current_year && checkMonth === current_month && day === current_date;
    },
    [current_year, current_month, current_date],
  );

  // ==========================================================
  // PAST DATE
  // ==========================================================

  const isPastDate = useCallback(
    (checkYear, checkMonth, day) => {
      const date = createDate(checkYear, checkMonth, day);

      return date < currentDate;
    },
    [createDate, currentDate],
  );

  // ==========================================================
  // PREVIOUS MONTH
  // ==========================================================

  const handlePrevMonth = useCallback(() => {
    let newMonth = month - 1;

    let newYear = year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }

    setMonth(newMonth);
    setYear(newYear);

    dispatch(setClearDateField(""));
  }, [month, year, setMonth, setYear, dispatch]);

  // ==========================================================
  // NEXT MONTH
  // ==========================================================

  const handleNextMonth = useCallback(() => {
    let newMonth = month + 1;

    let newYear = year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }

    setMonth(newMonth);
    setYear(newYear);

    dispatch(setClearDateField(""));
  }, [month, year, setMonth, setYear, dispatch]);

  // ==========================================================
  // PREVIOUS YEAR
  // ==========================================================

  const handlePrevYear = useCallback(() => {
    const newYear = Math.max(year - 1, MIN_YEAR);

    setYear(newYear);

    dispatch(setClearDateField(""));
  }, [year, setYear, dispatch]);

  // ==========================================================
  // NEXT YEAR
  // ==========================================================

  const handleNextYear = useCallback(() => {
    setYear(year + 1);

    dispatch(setClearDateField(""));
  }, [year, setYear, dispatch]);

  // ==========================================================
  // CHECK BOOKED DATE
  // ==========================================================

  const isDateBooked = useCallback(
    (day) => {
      if (!Array.isArray(bookingDate)) {
        return false;
      }

      return bookingDate.some((item) => {
        // ------------------------------------------------
        // Number
        // ------------------------------------------------

        if (typeof item === "number") {
          return Number(item) === day;
        }

        // ------------------------------------------------
        // Object
        // ------------------------------------------------

        if (item && typeof item === "object") {
          const itemDay = item.day ?? item.date;

          const itemMonth = item.month;

          const itemYear = item.year;

          if (itemDay !== undefined && itemMonth !== undefined && itemYear !== undefined) {
            return (
              Number(itemDay) === day && Number(itemMonth) === month && Number(itemYear) === year
            );
          }

          if (itemDay !== undefined) {
            return Number(itemDay) === day;
          }

          return false;
        }

        // ------------------------------------------------
        // String
        // ------------------------------------------------

        if (typeof item === "string") {
          return (
            item.includes(`${day} / ${month + 1} / ${year}`) ||
            item.includes(`${day}/${month + 1}/${year}`)
          );
        }

        return false;
      });
    },
    [bookingDate, month, year],
  );

  // ==========================================================
  // SELECT DATE
  // ==========================================================

  const selectDate = useCallback(
    (date) => {
      const selectedDate = new Date(year, month, date);

      // ------------------------------------------------------
      // BOOKED
      // ------------------------------------------------------

      if (isDateBooked(date)) {
        showWarning(statusText.alreadyBooked);

        return;
      }

      // ------------------------------------------------------
      // PAST DATE
      // ------------------------------------------------------

      if (selectedDate < currentDate) {
        dispatch(setIsSelectedDateValid(false));

        setTimeout(() => {
          dispatch(setIsSelectedDateValid(true));
        }, 1000);

        dispatch(setClearDateField(""));

        return;
      }

      // ------------------------------------------------------
      // VALID DATE
      // ------------------------------------------------------

      setDate(date);

      setBooking_date(`${date} / ${month + 1} / ${year}`);

      setIsDateClicked(true);

      dispatch(setClearDateField(true));

      dispatch(setIsSelectedDateValid(true));
    },
    [
      year,
      month,
      isDateBooked,
      statusText,
      currentDate,
      setDate,
      setBooking_date,
      setIsDateClicked,
      dispatch,
    ],
  );

  // ==========================================================
  // DATE CELL
  // ==========================================================

  const renderDateCell = useCallback(
    (dayData) => {
      const { day, isCurrentMonth } = dayData;

      // ------------------------------------------------------
      // OUTSIDE CURRENT MONTH
      // ------------------------------------------------------

      if (!isCurrentMonth) {
        return (
          <div key={`${year}-${month}-${day}`} className="date isOutsideMonth" aria-hidden="true" />
        );
      }

      // ------------------------------------------------------
      // DATE STATUS
      // ------------------------------------------------------

      const isBooked = isDateBooked(day);

      const isToday = isCurrentDay(year, month, day);

      const isPast = isPastDate(year, month, day);

      let statusClass = "";

      if (isBooked) {
        if (orderStatus === "complete") {
          statusClass = "isBooked";
        } else if (orderStatus === "cancel") {
          statusClass = "isCanceled";
        } else if (orderStatus === "pending") {
          statusClass = "isPending";
        }
      }

      // ------------------------------------------------------
      // RENDER
      // ------------------------------------------------------

      return (
        <div
          key={`${year}-${month}-${day}`}
          className={`
              date
              ${isToday ? "isCurrentDay" : ""}
              ${isPast ? "isPastDate" : ""}
              ${statusClass}
            `}
          onClick={() => {
            if (!isPast) {
              selectDate(day);
            }
          }}
          role="button"
          tabIndex={isPast ? -1 : 0}
          aria-disabled={isPast}
          aria-label={
            isPast
              ? `${day} ${monthName} ${year} - ${statusText.pastDate}`
              : `${day} ${monthName} ${year}`
          }
        >
          {day}

          {isBooked && <span className="date__statusDot" aria-hidden="true" />}
        </div>
      );
    },
    [
      year,
      month,
      isDateBooked,
      isCurrentDay,
      isPastDate,
      orderStatus,
      selectDate,
      monthName,
      statusText,
    ],
  );

  // ==========================================================
  // STATUS CONFIG
  // ==========================================================

  const statusConfig = useMemo(() => {
    if (!orderStatus) {
      return null;
    }

    const config = {
      complete: {
        text: statusText.complete,
        className: "calendar__legend-dot--booked",
      },

      cancel: {
        text: statusText.cancel,
        className: "calendar__legend-dot--canceled",
      },

      pending: {
        text: statusText.pending,
        className: "calendar__legend-dot--pending",
      },
    };

    return config[orderStatus] || null;
  }, [orderStatus, statusText]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className={`calendar calendar--${lang}`} lang={lang}>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="calendar__header">
        {/* PREVIOUS YEAR */}

        <button
          type="button"
          onClick={handlePrevYear}
          className="calendar__nav calendar__nav--year"
          aria-label={statusText.previousYear}
        >
          &lt;&lt;
        </button>

        {/* PREVIOUS MONTH */}

        <button
          type="button"
          onClick={handlePrevMonth}
          className="calendar__nav"
          aria-label={statusText.previousMonth}
        >
          &lt;
        </button>

        {/* MONTH */}

        <div className="calendar__title" aria-label={`${monthName} ${year}`}>
          <span className="calendar__month">{monthName}</span>

          <span className="calendar__year">{year}</span>
        </div>

        {/* NEXT MONTH */}

        <button
          type="button"
          onClick={handleNextMonth}
          className="calendar__nav"
          aria-label={statusText.nextMonth}
        >
          &gt;
        </button>

        {/* NEXT YEAR */}

        <button
          type="button"
          onClick={handleNextYear}
          className="calendar__nav calendar__nav--year"
          aria-label={statusText.nextYear}
        >
          &gt;&gt;
        </button>
      </div>

      {/* ======================================================
          CALENDAR BODY
      ====================================================== */}

      <div className="calendar__body">
        {/* WEEKDAYS */}

        {daysOfWeek.map((day) => (
          <div key={day} className="calendar__weekday">
            {day}
          </div>
        ))}

        {/* DATES */}

        {Array.isArray(calendar) &&
          calendar.map((week, weekIndex) => (
            <React.Fragment key={`week-${weekIndex}`}>
              {Array.isArray(week) && week.map((dayData) => renderDateCell(dayData))}
            </React.Fragment>
          ))}
      </div>

      {/* ======================================================
          LEGEND
      ====================================================== */}

      <div className="calendar__legend">
        {/* TODAY */}

        <div className="calendar__legendItem">
          <span className="calendar__legend-dot calendar__legend-dot--today" aria-hidden="true" />

          <span>{statusText.today}</span>
        </div>

        {/* STATUS */}

        {statusConfig && (
          <div className="calendar__legendItem">
            <span className={`calendar__legend-dot ${statusConfig.className}`} aria-hidden="true" />

            <span>{statusConfig.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;

import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import "./calendar.css";
import { setClearDateField, setIsSelectedDateValid } from "../../utils/categoryslice";
import { showWarning } from "../showAlert";

/* ============================================================
   DAYS
   ============================================================ */

const DAYS_OF_WEEK = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  hi: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
};

/* ============================================================
   HINDI MONTHS
   ============================================================ */

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

/* ============================================================
   STATUS TEXT
   ============================================================ */

const STATUS_TEXT = {
  en: {
    today: "Today",
    complete: "Completed",
    cancel: "Canceled",
    pending: "Pending",
    alreadyBooked: "Already Booked...",
    pastDate: "Past Date",
  },

  hi: {
    today: "आज",
    complete: "पूरा हुआ",
    cancel: "रद्द",
    pending: "पेंडिंग",
    alreadyBooked: "पहले से बुक है...",
    pastDate: "पुरानी तारीख",
  },
};

/* ============================================================
   MIN YEAR
   ============================================================ */

const MIN_YEAR = 2000;

/* ============================================================
   CALENDAR
   ============================================================ */

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

  // "hi" or "en"
  language = "hi",
}) => {
  const dispatch = useDispatch();

  /* ==========================================================
     LANGUAGE
     ========================================================== */

  const lang = language === "hin" ? "hi" : language === "hi" ? "hi" : "en";

  const daysOfWeek = DAYS_OF_WEEK[lang];

  const statusText = STATUS_TEXT[lang];

  /* ==========================================================
     CURRENT DATE
     ========================================================== */

  const currentDate = useMemo(() => {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const current_date = currentDate.getDate();
  const current_month = currentDate.getMonth();
  const current_year = currentDate.getFullYear();

  /* ==========================================================
     MONTH NAME
     ========================================================== */

  const monthName = useMemo(() => {
    if (lang === "hi") {
      return MONTHS_HI[month];
    }

    return months?.[month] || "";
  }, [lang, month, months]);

  /* ==========================================================
     NUMBER FORMAT
     ========================================================== */

  const formatNumber = useCallback(
    (number) => {
      if (lang === "hi") {
        return new Intl.NumberFormat("hi-IN").format(number);
      }

      return number;
    },
    [lang],
  );

  /* ==========================================================
     CREATE DATE OBJECT
     ========================================================== */

  const createDate = useCallback((checkYear, checkMonth, day) => {
    return new Date(checkYear, checkMonth, day);
  }, []);

  /* ==========================================================
     CURRENT DAY
     ========================================================== */

  const isCurrentDay = useCallback(
    (checkYear, checkMonth, day) => {
      return checkYear === current_year && checkMonth === current_month && day === current_date;
    },
    [current_year, current_month, current_date],
  );

  /* ==========================================================
     PAST DATE
     ========================================================== */

  const isPastDate = useCallback(
    (checkYear, checkMonth, day) => {
      const date = createDate(checkYear, checkMonth, day);

      return date < currentDate;
    },
    [createDate, currentDate],
  );

  /* ==========================================================
     PREVIOUS MONTH
     ========================================================== */

  const handlePrevMonth = useCallback(() => {
    const newMonth = month < 1 ? 11 : month - 1;

    const newYear = month < 1 ? year - 1 : year;

    setMonth(newMonth);

    setYear(Math.max(newYear, MIN_YEAR));

    dispatch(setClearDateField(""));
  }, [month, year, setMonth, setYear, dispatch]);

  /* ==========================================================
     NEXT MONTH
     ========================================================== */

  const handleNextMonth = useCallback(() => {
    const newMonth = month > 10 ? 0 : month + 1;

    const newYear = month > 10 ? year + 1 : year;

    setMonth(newMonth);

    setYear(newYear);

    dispatch(setClearDateField(""));
  }, [month, year, setMonth, setYear, dispatch]);

  /* ==========================================================
     PREVIOUS YEAR
     ========================================================== */

  const handlePrevYear = useCallback(() => {
    const newYear = Math.max(year - 1, MIN_YEAR);

    setYear(newYear);

    dispatch(setClearDateField(""));
  }, [year, setYear, dispatch]);

  /* ==========================================================
     NEXT YEAR
     ========================================================== */

  const handleNextYear = useCallback(() => {
    setYear(year + 1);

    dispatch(setClearDateField(""));
  }, [year, setYear, dispatch]);

  /* ==========================================================
     CHECK BOOKED DATE
     
     IMPORTANT:
     We support:
       5
       "5"
       "5 / 8 / 2026"
       "05 / 08 / 2026"
       { date: 5, month: 7, year: 2026 }
     
     ========================================================== */

  const isDateBooked = useCallback(
    (day) => {
      if (!Array.isArray(bookingDate)) {
        return false;
      }

      return bookingDate.some((item) => {
        /* Simple number */
        if (typeof item === "number" || typeof item === "string") {
          return Number(item) === day;
        }

        /* Object */
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
        }

        /* String date */
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

  /* ==========================================================
     SELECT DATE
     ========================================================== */

  const selectDate = useCallback(
    (date) => {
      const selectedDate = new Date(year, month, date);

      /* -----------------------------------------------
         BOOKED
         ----------------------------------------------- */

      if (isDateBooked(date)) {
        showWarning(statusText.alreadyBooked);

        return;
      }

      /* -----------------------------------------------
         PAST DATE
         ----------------------------------------------- */

      if (selectedDate < currentDate) {
        dispatch(setIsSelectedDateValid(false));

        setTimeout(() => {
          dispatch(setIsSelectedDateValid(true));
        }, 1000);

        dispatch(setClearDateField(""));

        return;
      }

      /* -----------------------------------------------
         VALID FUTURE / TODAY
         ----------------------------------------------- */

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

  /* ==========================================================
     DATE CELL
     ========================================================== */

  const renderDateCell = useCallback(
    (dayData) => {
      const { day, isCurrentMonth } = dayData;

      if (!isCurrentMonth) {
        return (
          <div key={`${year}-${month}-${day}`} className="date isOutsideMonth" aria-hidden="true" />
        );
      }

      /* -----------------------------------------------
         DATE STATUS
         ----------------------------------------------- */

      const isBooked = isDateBooked(day);

      const isToday = isCurrentDay(year, month, day);

      const isPast = isPastDate(year, month, day);

      /* -----------------------------------------------
         STATUS CLASS
         ----------------------------------------------- */

      let statusClass = "";

      if (isBooked) {
        statusClass =
          orderStatus === "complete"
            ? "isBooked"
            : orderStatus === "cancel"
              ? "isCanceled"
              : orderStatus === "pending"
                ? "isPending"
                : "";
      }

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
          {formatNumber(day)}

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
      formatNumber,
      monthName,
      statusText,
    ],
  );

  /* ==========================================================
     STATUS CONFIG
     ========================================================== */

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

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className={`calendar calendar--${lang}`} lang={lang}>
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="calendar__header">
        <button
          type="button"
          onClick={handlePrevYear}
          className="
            calendar__nav
            calendar__nav--year
          "
          aria-label={lang === "hi" ? "पिछला वर्ष" : "Previous year"}
        >
          &lt;&lt;
        </button>

        <button
          type="button"
          onClick={handlePrevMonth}
          className="calendar__nav"
          aria-label={lang === "hi" ? "पिछला महीना" : "Previous month"}
        >
          &lt;
        </button>

        <div className="calendar__title" aria-label={`${monthName} ${year}`}>
          <span className="calendar__month">{monthName}</span>

          <span className="calendar__year">{formatNumber(year)}</span>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="calendar__nav"
          aria-label={lang === "hi" ? "अगला महीना" : "Next month"}
        >
          &gt;
        </button>

        <button
          type="button"
          onClick={handleNextYear}
          className="
            calendar__nav
            calendar__nav--year
          "
          aria-label={lang === "hi" ? "अगला वर्ष" : "Next year"}
        >
          &gt;&gt;
        </button>
      </div>

      {/* ======================================================
          CALENDAR BODY
          ====================================================== */}

      <div className="calendar__body">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar__weekday">
            {day}
          </div>
        ))}

        {calendar.map((week, weekIndex) => (
          <React.Fragment key={`week-${weekIndex}`}>
            {week.map((dayData) => renderDateCell(dayData))}
          </React.Fragment>
        ))}
      </div>

      {/* ======================================================
          LEGEND
          ====================================================== */}

      <div className="calendar__legend">
        {/* TODAY */}

        <div className="calendar__legendItem">
          <span
            className="
              calendar__legend-dot
              calendar__legend-dot--today
            "
            aria-hidden="true"
          />

          <span>{statusText.today}</span>
        </div>

        {/* STATUS */}

        {statusConfig && (
          <div className="calendar__legendItem">
            <span
              className={`
                calendar__legend-dot
                ${statusConfig.className}
              `}
              aria-hidden="true"
            />

            <span>{statusConfig.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Calendar);

// optimized and production ready

import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import "./calendar.css";
import { setClearDateField, setIsSelectedDateValid } from "../../utils/categoryslice";
import { showWarning } from "../showAlert";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MIN_YEAR = 2000;

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
}) => {
  const dispatch = useDispatch();

  // Current date values
  const currentDate = useMemo(() => new Date(), []);
  const current_date = currentDate.getDate();
  const current_month = currentDate.getMonth();
  const current_year = currentDate.getFullYear();

  // Check if a day is the current day
  const isCurrentDay = useCallback(
    (year, month, day) => year === current_year && month === current_month && day === current_date,
    [current_year, current_month, current_date],
  );

  // Navigation handlers
  const handlePrevMonth = useCallback(() => {
    const newMonth = month < 1 ? 11 : month - 1;
    const newYear = month < 1 ? year - 1 : year;
    setMonth(newMonth);
    setYear(Math.max(newYear, MIN_YEAR));
    dispatch(setClearDateField(""));
  }, [month, year, setMonth, setYear, dispatch]);

  const handleNextMonth = useCallback(() => {
    const newMonth = month > 10 ? 0 : month + 1;
    const newYear = month > 10 ? year + 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    dispatch(setClearDateField(""));
  }, [month, year, setMonth, setYear, dispatch]);

  const handlePrevYear = useCallback(() => {
    const newYear = Math.max(year - 1, MIN_YEAR);
    setYear(newYear);
    dispatch(setClearDateField(""));
  }, [year, setYear, dispatch]);

  const handleNextYear = useCallback(() => {
    setYear(year + 1);
    dispatch(setClearDateField(""));
  }, [year, setYear, dispatch]);

  // Date selection handler
  const selectDate = useCallback(
    (date) => {
      if (bookingDate.includes(date)) {
        showWarning("Already Booked...");
        return;
      }

      const isValidDate =
        (current_year === year && current_month === month && current_date <= date) ||
        (current_year === year && current_month < month) ||
        current_year < year;

      if (isValidDate) {
        setDate(date);
        setBooking_date(`${date} / ${month + 1} / ${year}`);
        setIsDateClicked(true);
        dispatch(setClearDateField(true));
        dispatch(setIsSelectedDateValid(true));
      } else {
        dispatch(setIsSelectedDateValid(false));
        setTimeout(() => dispatch(setIsSelectedDateValid(true)), 1000);
        dispatch(setClearDateField(""));
      }
    },
    [
      bookingDate,
      current_year,
      current_month,
      current_date,
      year,
      month,
      setDate,
      setBooking_date,
      setIsDateClicked,
      dispatch,
    ],
  );

  // Render a single date cell
  const renderDateCell = useCallback(
    (dayData) => {
      const { day, isCurrentMonth } = dayData;
      const isBooked = bookingDate.includes(day) && isCurrentMonth;

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
          className={`date 
          ${isCurrentDay(year, month, day) ? "isCurrentDay" : ""} 
          ${statusClass}`}
          style={{
            opacity: isCurrentMonth ? 1 : 0,
            cursor: "pointer",
            borderRadius: "5px",
          }}
          key={day}
          onClick={() => selectDate(day)}
        >
          {day}
        </div>
      );
    },
    [bookingDate, orderStatus, isCurrentDay, year, month, selectDate],
  );

  // Render status indicator
  const renderStatusIndicator = useMemo(() => {
    if (!orderStatus) return null;

    const statusText = {
      complete: "Completed",
      cancel: "Canceled",
      pending: "Pending",
    }[orderStatus];

    const statusClass = {
      complete: "calendar__colorDetailing--booked",
      cancel: "calendar__colorDetailing--canceled",
      pending: "calendar__colorDetailing--pending",
    }[orderStatus];

    return (
      <>
        <div>{statusText}</div>
        <div className={statusClass}></div>
      </>
    );
  }, [orderStatus]);

  return (
    <div className="calendar">
      {/* Calendar Header */}
      <div className="calendar__header">
        <div onClick={handlePrevYear} className="year" aria-label="Previous year">
          &lt;&lt;
        </div>
        <div onClick={handlePrevMonth} className="month" aria-label="Previous month">
          &lt;
        </div>
        <div className="year-month" aria-label="Current month and year">
          {months[month]} {year}
        </div>
        <div onClick={handleNextMonth} className="month" aria-label="Next month">
          &gt;
        </div>
        <div onClick={handleNextYear} className="year" aria-label="Next year">
          &gt;&gt;
        </div>
      </div>

      {/* Calendar Body */}
      <div className="calendar__body">
        {/* Days of week */}
        {DAYS_OF_WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}

        {/* Calendar dates */}
        {calendar.map((week, weekIndex) => (
          <React.Fragment key={`week-${weekIndex}`}>
            {week.map((dayData) => renderDateCell(dayData))}
          </React.Fragment>
        ))}
      </div>

      {/* Calendar Legend */}
      <div className="calendar__colorDetailing">
        <div className="calendar__colorDetailing-1st">
          <div>Today</div>
          {renderStatusIndicator && <div>{renderStatusIndicator[0]}</div>}
        </div>
        <div className="calendar__colorDetailing-2nd">
          <div
            className="calendar__colorDetailing--today"
            style={{
              boxShadow: "0 0 0 2px black",
              borderRadius: "5px",
            }}
            aria-hidden="true"
          ></div>
          {renderStatusIndicator && renderStatusIndicator[1]}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Calendar);

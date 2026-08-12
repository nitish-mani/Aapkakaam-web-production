import { useState, useEffect, useCallback } from "react";
import "./attendanceReport.css";
import { SERVER_URL } from "../../utils/base";
import { useSelector } from "react-redux";
import axios from "axios";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";

const AttendanceReport = () => {
  const navigate = useNavigate();

  const category = localStorage.getItem("category");

  // Select user data based on category
  const vendorId = JSON.parse(localStorage.getItem(category)).vendorId;
  const userId = JSON.parse(localStorage.getItem(category)).userId;
  const token = `Bearer ${JSON.parse(localStorage.getItem(category)).token}`;

  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountCreatedDate, setAccountCreatedDate] = useState(null);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1, // Current month
    year: new Date().getFullYear(), // Current year
  });

  // Fetch account creation date first
  const fetchAccountCreationDate = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/${category}/getVendor/${vendorId}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data && response.data.accountCreatedOn) {
        const accountCreatedOn = new Date(response.data.accountCreatedOn);

        // Validate the date
        if (!isNaN(accountCreatedOn.getTime())) {
          setAccountCreatedDate(accountCreatedOn);

          // If current filters are before account creation, auto-set to account creation month
          const accountCreationMonth = accountCreatedOn.getMonth() + 1;
          const accountCreationYear = accountCreatedOn.getFullYear();

          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear();

          // Set default to account creation month if current month is before account creation
          if (
            currentYear < accountCreationYear ||
            (currentYear === accountCreationYear &&
              currentMonth < accountCreationMonth)
          ) {
            setFilters({
              month: accountCreationMonth,
              year: accountCreationYear,
            });
          }
        } else {
          console.error(
            "Invalid account creation date:",
            response.data.accountCreatedOn
          );
        }
      }
    } catch (err) {
      console.error("Failed to fetch account creation date:", err);
    }
  };

  // Fetch attendance data
  const fetchAttendance = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${SERVER_URL}/${category}/getAttendance/${
          category === "user" ? userId : vendorId
        }/${filters.month}/${filters.year}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log(response.data);
      const data = response.data;
      console.log(data);
      setAttendanceData(data);
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Failed to fetch attendance data"
      );
      setAttendanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCrossInAddress = useCallback(() => navigate("/"), [navigate]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Format time from seconds to HH:MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Safe date formatting with validation
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Invalid Date";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Format date without weekday
  const formatDateShort = (dateString) => {
    try {
      if (!dateString) return "Invalid Date";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Get status badge based on new status field
  const getStatusBadge = (record) => {
    const status =
      record?.status || (record?.attendance ? "present" : "absent");

    switch (status) {
      case "present":
        return <span className="status-badge present">Present</span>;
      case "absent":
        return <span className="status-badge absent">Absent</span>;
      case "future":
        return <span className="status-badge future">Future</span>;
      case "before-account":
        return (
          <span className="status-badge before-account">Before Account</span>
        );
      case "no-record":
      default:
        return <span className="status-badge no-record">No Record</span>;
    }
  };

  // Generate month options starting from account creation month
  const generateMonthOptions = () => {
    if (!accountCreatedDate) {
      return Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(2000, i).toLocaleString("default", { month: "long" }),
      }));
    }

    const currentDate = new Date();
    const accountCreationMonth = accountCreatedDate.getMonth() + 1;
    const accountCreationYear = accountCreatedDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const options = [];

    for (let year = accountCreationYear; year <= currentYear; year++) {
      const startMonth =
        year === accountCreationYear ? accountCreationMonth : 1;
      const endMonth = year === currentYear ? currentMonth : 12;

      for (let month = startMonth; month <= endMonth; month++) {
        options.push({
          value: month,
          year: year,
          label: `${new Date(2000, month - 1).toLocaleString("default", {
            month: "long",
          })} ${year}`,
        });
      }
    }

    return options;
  };

  // Generate year options from account creation year to current year
  const generateYearOptions = () => {
    if (!accountCreatedDate) {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 10 }, (_, i) => ({
        value: currentYear - i,
        label: currentYear - i,
      }));
    }

    const accountCreationYear = accountCreatedDate.getFullYear();
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: currentYear - accountCreationYear + 1 },
      (_, i) => ({
        value: currentYear - i,
        label: currentYear - i,
      })
    ).reverse();
  };

  // Get available months for selected year
  const getMonthsForSelectedYear = () => {
    if (!accountCreatedDate) return generateMonthOptions();

    const accountCreationYear = accountCreatedDate.getFullYear();
    const accountCreationMonth = accountCreatedDate.getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let startMonth = 1;
    let endMonth = 12;

    if (filters.year === accountCreationYear) {
      startMonth = accountCreationMonth;
    }

    if (filters.year === currentYear) {
      endMonth = currentMonth;
    }

    const months = [];
    for (let month = startMonth; month <= endMonth; month++) {
      months.push({
        value: month,
        label: new Date(2000, month - 1).toLocaleString("default", {
          month: "long",
        }),
      });
    }

    return months;
  };

  // Render monthly calendar view
  const renderMonthlyCalendar = () => {
    if (!attendanceData?.monthlyCalendar) return null;

    return (
      <div className="calendar-section">
        <h3>
          Monthly Calendar View (
          {attendanceData.summary?.period || "Loading..."})
        </h3>
        <div className="calendar-header">
          <div className="calendar-info" style={{ margin: "1.5rem 0" }}>
            <p style={{ margin: "1rem 0" }}>
              <strong>Account Created:</strong>{" "}
              {formatDate(attendanceData.summary?.accountCreatedOn)}
            </p>
            <p>
              <strong>Valid Tracking Period:</strong>{" "}
              {attendanceData.summary?.totalValidDays || 0} days (
              {attendanceData.summary?.presentDays || 0} present +{" "}
              {attendanceData.summary?.totalAbsentDays || 0} absent)
            </p>
          </div>
        </div>
        <div className="calendar-grid">
          {attendanceData.monthlyCalendar.map((day) => (
            <div
              key={day.day}
              className={`calendar-day ${day.status}`}
              title={`${day.date} - ${formatStatusText(day.status)}`}
            >
              <div className="day-number">{day.day}</div>
              <div className="day-status-indicator"></div>
              {day.record && (
                <div className="day-activity">
                  {day.record.totalTime > 0 && "⏱️"}
                  {day.record.pageNo1 && "1️⃣"}
                  {day.record.pageNo2 && "2️⃣"}
                  {day.record.pageNo3 && "3️⃣"}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color present"></div>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <div className="legend-color absent"></div>
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <div className="legend-color no-record"></div>
            <span>No Record</span>
          </div>
          <div className="legend-item">
            <div className="legend-color future"></div>
            <span>Future</span>
          </div>
          <div className="legend-item">
            <div className="legend-color before-account"></div>
            <span>Before Account</span>
          </div>
        </div>
      </div>
    );
  };

  // Format status text for display
  const formatStatusText = (status) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "future":
        return "Future Date";
      case "before-account":
        return "Before Account Creation";
      case "no-record":
      default:
        return "No Record";
    }
  };

  // Get appropriate empty state message
  const getEmptyStateMessage = () => {
    if (!attendanceData?.summary) return null;

    const { totalValidDays, beforeAccountDays, futureDays, totalRecords } =
      attendanceData.summary;

    if (totalValidDays === 0) {
      if (beforeAccountDays > 0) {
        return {
          title: "Selected Month is Before Account Creation",
          message: `The selected month contains only dates before the account was created on ${formatDate(
            attendanceData.summary.accountCreatedOn
          )}. Please select a later month.`,
        };
      } else if (futureDays > 0) {
        return {
          title: "Selected Month is in Future",
          message:
            "The selected month hasn't started yet. Please select a current or past month.",
        };
      }
    }

    if (totalRecords === 0 && totalValidDays > 0) {
      return {
        title: "No Attendance Records Found",
        message: `No attendance data available for ${
          attendanceData.summary.period
        }. Attendance tracking started from account creation on ${formatDateShort(
          attendanceData.summary.accountCreatedOn
        )}.`,
      };
    }

    return null;
  };

  // Check if current month is account creation month
  const isAccountCreationMonth = () => {
    if (!attendanceData?.summary || !accountCreatedDate) return false;

    const accountCreationMonth = accountCreatedDate.getMonth() + 1;
    const accountCreationYear = accountCreatedDate.getFullYear();

    return (
      filters.month === accountCreationMonth &&
      filters.year === accountCreationYear
    );
  };

  useEffect(() => {
    fetchAccountCreationDate();
  }, []);

  useEffect(() => {
    if (accountCreatedDate || !accountCreatedDate) {
      // Fetch even if account date is not available
      fetchAttendance();
    }
  }, [filters.month, filters.year]);

  const emptyStateMessage = getEmptyStateMessage();
  const monthOptions = getMonthsForSelectedYear();
  const yearOptions = generateYearOptions();
  const isCreationMonth = isAccountCreationMonth();

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="attendance-report ">
        <div className="views-P">
          {/* Close button */}
          <img
            className="profile__close-button"
            src={cross}
            alt="close"
            onClick={handleCrossInAddress}
          />

          {/* Error and success message */}
          <div
            className="err"
            style={{
              opacity: error ? "1" : "",
              border: error ? "none" : "none",
              top: "-10rem",
            }}
          >
            {error}
          </div>

          <h1
            style={{
              gridColumnEnd: "4",
              gridColumnStart: "1",
              marginBottom: "2rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid rgba(105, 102, 102, 0.637)",
            }}
          >
            Attendance Report
          </h1>
        </div>

        {/* Account Creation Info */}
        {accountCreatedDate && (
          <div className="account-info-banner">
            <div className="account-info">
              <span className="info-icon">📅</span>
              <span className="info-text">
                Account created on{" "}
                <strong>{formatDate(accountCreatedDate.toISOString())}</strong>
                {isCreationMonth && (
                  <span className="creation-month-badge">
                    Account Creation Month
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="year">Year</label>
            <select
              id="year"
              value={filters.year}
              onChange={(e) =>
                handleFilterChange("year", parseInt(e.target.value))
              }
              className="year-select"
            >
              {yearOptions.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="month">Month</label>
            <select
              id="month"
              value={filters.month}
              onChange={(e) =>
                handleFilterChange("month", parseInt(e.target.value))
              }
              className="month-select"
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="fetch-btn"
          >
            {loading ? "Loading..." : "Refresh Data"}
          </button>
        </div>

        {/* Summary Section */}
        {attendanceData?.summary && (
          <div className="summary-section">
            <h2>Summary - {attendanceData.summary.period}</h2>

            {/* Period Information */}
            <div className="period-info">
              <div className="info-item">
                <span className="info-label">Account Created:</span>
                <span className="info-value">
                  {formatDate(attendanceData.summary.accountCreatedOn)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Valid Tracking Period:</span>
                <span className="info-value">
                  {attendanceData.summary.totalValidDays} days
                </span>
              </div>
              {isCreationMonth && (
                <div className="info-item highlight">
                  <span className="info-label">
                    ⭐ This is the account creation month
                  </span>
                </div>
              )}
            </div>

            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-value">
                  {attendanceData.summary.totalDaysInMonth}
                </div>
                <div className="card-label">Total Days in Month</div>
              </div>
              <div className="summary-card">
                <div className="card-value present">
                  {attendanceData.summary.presentDays}
                </div>
                <div className="card-label">Present Days</div>
              </div>
              <div className="summary-card">
                <div className="card-value absent">
                  {attendanceData.summary.totalAbsentDays}
                </div>
                <div className="card-label">Total Absent</div>
              </div>
              <div className="summary-card">
                <div className="card-value">
                  {attendanceData.summary.attendanceRate}%
                </div>
                <div className="card-label">Attendance Rate</div>
              </div>
              <div className="summary-card">
                <div className="card-value">
                  {formatTime(attendanceData.summary.totalTime)}
                </div>
                <div className="card-label">Total Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Calendar View */}
        {attendanceData?.monthlyCalendar && renderMonthlyCalendar()}

        <AdsterraBanner />

        {/* Attendance Records Table */}
        {attendanceData?.data &&
          attendanceData.data.length > 0 &&
          attendanceData.summary?.totalValidDays > 0 && (
            <div className="records-section">
              <h2>Attendance Records</h2>
              {isCreationMonth && (
                <div className="creation-month-notice">
                  <span className="notice-icon">⭐</span>
                  <span>
                    Showing data from account creation date:{" "}
                    {formatDateShort(attendanceData.summary.accountCreatedOn)}
                  </span>
                </div>
              )}
              <div className="table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Status</th>
                      <th>Total Time</th>
                      <th>Page 1</th>
                      <th>Page 2</th>
                      <th>Page 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.data.map((record, index) => (
                      <tr key={index}>
                        <td>{formatDate(record.presentDate)}</td>
                        <td>{record.day}</td>
                        <td>{getStatusBadge(record)}</td>
                        <td>{formatTime(record.totalTime)}</td>
                        <td>
                          <span
                            className={`page-indicator ${
                              record.pageNo1 ? "completed" : "pending"
                            }`}
                          >
                            {record.pageNo1 ? "✓" : "✗"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`page-indicator ${
                              record.pageNo2 ? "completed" : "pending"
                            }`}
                          >
                            {record.pageNo2 ? "✓" : "✗"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`page-indicator ${
                              record.pageNo3 ? "completed" : "pending"
                            }`}
                          >
                            {record.pageNo3 ? "✓" : "✗"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Empty State */}
        {emptyStateMessage && (
          <div className="empty-state">
            <div className="empty-icon">
              {emptyStateMessage.title.includes("Future")
                ? "🔮"
                : emptyStateMessage.title.includes("Before")
                ? "📅"
                : "📊"}
            </div>
            <h3>{emptyStateMessage.title}</h3>
            <p>{emptyStateMessage.message}</p>
            {accountCreatedDate && (
              <div className="suggestion">
                <p>
                  Try selecting the account creation month:{" "}
                  <strong>
                    {new Date(accountCreatedDate).toLocaleString("default", {
                      month: "long",
                    })}{" "}
                    {accountCreatedDate.getFullYear()}
                  </strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceReport;

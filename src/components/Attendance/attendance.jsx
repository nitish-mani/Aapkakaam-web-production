import { useState, useEffect, useRef } from "react";
import "./attendance.css";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { useDispatch, useSelector } from "react-redux";
import { addAttendanceDataVendor } from "../../utils/vendorslice";
import { addAttendanceDataUser } from "../../utils/userslice";

const Attendance = ({ pageNo }) => {
  const dispatch = useDispatch();

  // Configuration
  const CONFIG = {
    totalTime: 2 * 60, // 2 minutes in seconds
  };

  const category = localStorage.getItem("category");
  const attendanceData = JSON.parse(localStorage.getItem("attendanceData"));

  // Select user data based on category
  const vendorId = JSON.parse(localStorage.getItem(category))?.vendorId;
  const userId = JSON.parse(localStorage.getItem(category))?.userId;
  const token = `Bearer ${JSON.parse(localStorage.getItem(category))?.token}`;

  // State
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CONFIG.totalTime);
  const [time, setTime] = useState(CONFIG.totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiStatus, setApiStatus] = useState(""); // Track API call status
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false); // Track if already marked

  // Refs
  const timerIntervalRef = useRef(null);
  const hasSentApiRequestRef = JSON.parse(
    localStorage.getItem("hasSentApiRequestRef")
  ); // Prevent multiple API calls

  // Check if attendance is already marked for this page and date
  useEffect(() => {
    checkIfAlreadyMarked();
  }, [pageNo, attendanceData]);

  const checkIfAlreadyMarked = () => {
    if (!attendanceData) return;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Check if this page was already marked today
    const pageKey = `pageNo${pageNo}`;
    const timeKey = `time${pageNo}`;

    if (attendanceData[pageKey] && attendanceData.date === today) {
      setIsAlreadyMarked(true);
      setTimeLeft(0); // Set timer to 0 if already marked
    } else {
      setIsAlreadyMarked(false);
    }
  };

  // API call function
  const sendApiRequest = async () => {
    setLoading(true);
    try {
      setApiStatus("sending");

      // Replace this with your actual API endpoint and data
      const response = await axios.post(
        `${SERVER_URL}/${category}/postAttendance/${
          category === "user" ? userId : vendorId
        }`,
        {
          attendanceData, // <-- this is the body
        },
        {
          headers: {
            Authorization: token, // <-- headers go here
          },
        }
      );
      console.log(response);
      if (response.ok) {
        setApiStatus("success");
        localStorage.setItem(
          "hasSentApiRequestRef",
          JSON.stringify({ current: false })
        );
        setLoading(false);
      } else {
        setLoading(false);
        alert(response.data.message);
      }
    } catch (error) {
      setApiStatus("error");
      console.error("Error sending API request:", error);
      setLoading(false);

      // Optional: Retry logic or show error message to user
      // if (isExpanded) {
      //   alert("Failed to send attendance data. Please try again.");
      //   setLoading(false)
      // }
    }
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0 && !isAlreadyMarked) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, timeLeft, isAlreadyMarked]);

  const handleTimerEnd = () => {
    if (isAlreadyMarked) {
      alert("Attendance already marked for this page today!");
      return;
    }

    setIsRunning(false);
    const today = new Date().toISOString().split("T")[0]; // Get today's date

    let updatedAttendanceData;
    if (pageNo == 1) {
      updatedAttendanceData = {
        ...attendanceData,
        pageNo1: true,
        time1: time,
        date: today, // Add date to track when it was marked
      };

      localStorage.setItem(
        "attendanceData",
        JSON.stringify(updatedAttendanceData)
      );
    } else if (pageNo == 2) {
      updatedAttendanceData = {
        ...attendanceData,
        pageNo2: true,
        time2: time,
        date: today,
      };
      localStorage.setItem(
        "attendanceData",
        JSON.stringify(updatedAttendanceData)
      );
    } else if (pageNo == 3) {
      updatedAttendanceData = {
        ...attendanceData,
        pageNo3: true,
        time3: time,
        date: today,
      };
      localStorage.setItem(
        "attendanceData",
        JSON.stringify(updatedAttendanceData)
      );
    }

    // Mark as already marked for today
    setIsAlreadyMarked(true);

    if (category === "user") {
      dispatch(addAttendanceDataUser(updatedAttendanceData));
    } else if (category === "vendor") {
      dispatch(addAttendanceDataVendor(updatedAttendanceData));
    }

    // Send API request only if we haven't sent one already
    if (
      updatedAttendanceData?.pageNo1 &&
      updatedAttendanceData?.pageNo2 &&
      updatedAttendanceData?.pageNo3
    ) {
      localStorage.setItem(
        "hasSentApiRequestRef",
        JSON.stringify({ current: true })
      );
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const startTimer = () => {
    if (isAlreadyMarked) {
      alert("Attendance already marked for this page today!");
      return;
    }

    if (!isRunning) {
      // Reset the API request flag when starting a new timer session
      if (timeLeft === CONFIG.totalTime) {
        localStorage.setItem(
          "hasSentApiRequestRef",
          JSON.stringify({ current: false })
        );
        setApiStatus("");
      }
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    if (isAlreadyMarked) {
      alert("Cannot reset timer - attendance already marked for today!");
      return;
    }

    setIsRunning(false);
    setTimeLeft(CONFIG.totalTime);
    localStorage.setItem(
      "hasSentApiRequestRef",
      JSON.stringify({ current: false })
    ); // Reset API flag
    setApiStatus(""); // Reset API status
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage =
    ((CONFIG.totalTime - timeLeft) / CONFIG.totalTime) * 100;

  // Get API status display text
  const getApiStatusText = () => {
    switch (apiStatus) {
      case "sending":
        return "Sending attendance...";
      case "success":
        return "Attendance sent successfully!";
      case "error":
        return "Failed to send attendance";
      default:
        return "";
    }
  };

  // Get API status color
  const getApiStatusColor = () => {
    switch (apiStatus) {
      case "sending":
        return "#ffa500"; // Orange
      case "success":
        return "#4CAF50"; // Green
      case "error":
        return "#f44336"; // Red
      default:
        return "transparent";
    }
  };

  // Check if timer can be started (not already marked and has time left)
  const canStartTimer = !isAlreadyMarked && timeLeft > 0;
  // Check if timer can be reset (not already marked)
  const canResetTimer = !isAlreadyMarked;

  return (
    <>
      {/* Floating Button */}
      <div
        className={`floating-button ${isExpanded ? "hidden" : ""} ${
          isRunning ? "pulse" : ""
        } ${isAlreadyMarked ? "already-marked" : ""}`}
        onClick={toggleExpanded}
      >
        <div className="button-icon">{isAlreadyMarked ? "✅" : "⏱️"}</div>
        <div className="button-text">
          {isAlreadyMarked
            ? "Marked"
            : isRunning
            ? formatTime(timeLeft)
            : "Attendance"}
        </div>
        {/* API status indicator dot */}
        {apiStatus && (
          <div
            className="api-status-dot"
            style={{ backgroundColor: getApiStatusColor() }}
          />
        )}
        {/* Already marked indicator */}
        {isAlreadyMarked && <div className="already-marked-dot" />}
      </div>

      {/* Expanded Timer */}
      <div
        className={`floating-timer ${isExpanded ? "expanded" : "collapsed"} ${
          isAlreadyMarked ? "already-marked" : ""
        }`}
      >
        {/* Header with close button */}
        <div className="timer-header">
          <h3 style={{ color: "white" }}>
            Attendance {isAlreadyMarked && "(Already Marked)"}
          </h3>
          <button className="close-button" onClick={toggleExpanded}>
            ×
          </button>
        </div>

        {/* Timer Content */}
        <div className="timer-content">
          {isAlreadyMarked ? (
            <div className="already-marked-message">
              <div className="success-icon">✅</div>
              <h3>Attendance Already Marked</h3>
              <p>You have already marked attendance for Page {pageNo} today.</p>
              <p>Please come back tomorrow to mark attendance again.</p>
            </div>
          ) : (
            <>
              <div className="timer-display">{formatTime(timeLeft)}</div>

              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* API Status Display */}
              {apiStatus && (
                <div
                  className="api-status"
                  style={{ color: getApiStatusColor() }}
                >
                  {getApiStatusText()}
                </div>
              )}

              <div className="status">
                {isRunning ? (
                  <>
                    <span className="live-indicator">●</span>
                    Timer running
                  </>
                ) : timeLeft < CONFIG.totalTime ? (
                  "Timer paused"
                ) : (
                  "Timer ready"
                )}
              </div>

              <div className="controls">
                <button
                  className="control-btn start-btn"
                  onClick={startTimer}
                  disabled={!canStartTimer || isRunning}
                >
                  {isRunning
                    ? "Running"
                    : timeLeft < CONFIG.totalTime
                    ? "Resume"
                    : "Start"}
                </button>
                <button
                  className="control-btn pause-btn"
                  onClick={pauseTimer}
                  disabled={!isRunning}
                >
                  Pause
                </button>
                <button
                  className="control-btn reset-btn"
                  onClick={resetTimer}
                  disabled={!canResetTimer}
                >
                  Reset
                </button>
              </div>
              <div className="time-presets">
                <div className="preset-label">Quick Set:</div>
                <div className="preset-buttons">
                  <button
                    className="preset-btn"
                    onClick={() => {
                      if (isAlreadyMarked) {
                        alert(
                          "Cannot change time - attendance already marked!"
                        );
                        return;
                      }
                      setTimeLeft(2 * 60); // 2 minutes
                      setTime(2 * 60);
                      setIsRunning(false);
                      localStorage.setItem("hasSentApiRequestRef", {
                        current: false,
                      });
                      setApiStatus("");
                    }}
                    disabled={isAlreadyMarked}
                  >
                    2 min
                  </button>
                  <button
                    className="preset-btn"
                    onClick={() => {
                      if (isAlreadyMarked) {
                        alert(
                          "Cannot change time - attendance already marked!"
                        );
                        return;
                      }
                      setTimeLeft(5 * 60); // 5 minutes
                      setTime(5 * 60);
                      setIsRunning(false);
                      localStorage.setItem("hasSentApiRequestRef", {
                        current: false,
                      });
                      setApiStatus("");
                    }}
                    disabled={isAlreadyMarked}
                  >
                    5 min
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        {hasSentApiRequestRef?.current &&
        attendanceData?.pageNo1 &&
        attendanceData?.pageNo2 &&
        attendanceData?.pageNo3 ? (
          <button
            className="btn"
            onClick={() => {
              sendApiRequest();
            }}
          >
            {loading ? <div className="loading"></div> : "Submit"}
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Attendance;

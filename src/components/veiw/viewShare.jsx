// Modern View Share Page - AapkaKaam

import "./viewShare.css";

import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import Attendance from "../Attendance/attendance";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showError } from "../showAlert";

export default function ViewShare() {
  const category = localStorage.getItem("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const token = `Bearer ${userData[0]?.token || JSON.parse(localStorage.getItem(category))?.token}`;
  const userId =
    category === "user"
      ? userData[0]?.userId || JSON.parse(localStorage.getItem(category))?.userId
      : userData[0]?.vendorId || JSON.parse(localStorage.getItem(category))?.vendorId;

  const [share, setShare] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalShare, setTotalShare] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [err, setErr] = useState("");
  const [isFetched, setIsFetched] = useState(false);

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

  useEffect(() => {
    if (!navigator.onLine) {
      setIsLoading(false);
      setErr(lang === "hin" ? "आप ऑफलाइन हैं" : "You are offline");
      setTimeout(() => setErr(""), 3000);
      return;
    }
    if (isFetched) {
      if (category === "user") {
        axios
          .get(`${SERVER_URL}/${category}/getShare/${userId}/${pageNo}`, {
            headers: { Authorization: token },
          })
          .then((result) => {
            setTotalShare(result.data.total);
            const page = Math.floor(result.data.total / 12) + 1;
            setTotalPage(page);
            setShare(result.data.share);
            setIsLoading(false);
          })
          .catch((err) => {
            showError(
              err.response?.data?.message ||
                (lang === "hin" ? "शेयर डेटा लोड करने में विफल" : "Failed to load share data"),
            );
            setIsLoading(false);
            setTimeout(() => setErr(""), 3000);
          });
      } else if (category === "vendor") {
        axios
          .get(`${SERVER_URL}/${category}/getShare/${userId}/${pageNo}`, {
            headers: { Authorization: token },
          })
          .then((result) => {
            setTotalShare(result.data.total);
            const page = Math.floor(result.data.total / 12) + 1;
            setTotalPage(page);
            setShare(result.data.share);
            setIsLoading(false);
          })
          .catch((err) => {
            showError(
              err.response?.data?.message ||
                (lang === "hin" ? "शेयर डेटा लोड करने में विफल" : "Failed to load share data"),
            );
            setIsLoading(false);
            setTimeout(() => setErr(""), 3000);
          });
      }
    }
  }, [pageNo, isFetched, lang]);

  function handleCrossInShare() {
    navigate("/");
  }

  function handlePrev() {
    if (pageNo > 1) {
      setIsLoading(true);
      setIsFetched(true);
      setPageNo((page) => page - 1);
    }
  }

  function handleNext() {
    if (pageNo < totalPage) {
      setIsLoading(true);
      setIsFetched(true);
      setPageNo((page) => page + 1);
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString(lang === "hin" ? "hi-IN" : "en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="share-modern" ref={containerRef}>
        <div className="share-container-modern">
          {/* Close Button */}
          <button className="share-close-btn" onClick={handleCrossInShare}>
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
          <div className="share-header-modern">
            <div className="share-header-left">
              <div className="header-icon-wrapper">
                <span className="header-icon">📤</span>
              </div>
              <div>
                <h1>{lang === "hin" ? "मेरे शेयर" : "My Shares"}</h1>
                <p>
                  {lang === "hin"
                    ? "अपने सभी शेयर देखें और प्रबंधित करें"
                    : "View and manage all your shares"}
                </p>
              </div>
            </div>
            <span className="share-total">
              {lang === "hin" ? "कुल शेयर" : "Total Shares"}: {totalShare}
            </span>
          </div>

          {/* Content */}
          {!isFetched ? (
            <div className="share-fetch-container">
              <div className="share-fetch-icon">📊</div>
              <h3>{lang === "hin" ? "शेयर डेटा देखें" : "View Share Data"}</h3>
              <p>
                {lang === "hin"
                  ? "अपने शेयर डेटा देखने के लिए नीचे दिए गए बटन पर क्लिक करें"
                  : "Click the button below to view your share data"}
              </p>
              <button className="fetch-btn-modern" onClick={() => setIsFetched(true)}>
                <span className="fetch-icon">📤</span>
                {lang === "hin" ? "शेयर डेटा लोड करें" : "Load Share Data"}
              </button>
            </div>
          ) : isLoading ? (
            <div className="share-loading-modern">
              <div className="loading-spinner-modern"></div>
              <p>{lang === "hin" ? "शेयर डेटा लोड हो रहा है..." : "Loading share data..."}</p>
            </div>
          ) : share.length === 0 ? (
            <div className="share-empty-modern">
              <span className="empty-icon">📭</span>
              <h3>{lang === "hin" ? "कोई शेयर नहीं" : "No shares found"}</h3>
              <p>
                {lang === "hin"
                  ? "आपने अभी तक किसी को शेयर नहीं किया है"
                  : "You haven't shared with anyone yet"}
              </p>
            </div>
          ) : (
            <div className="share-list-modern">
              {share.map((element, index) => (
                <div className="share-card-modern" key={element.phoneNo || index}>
                  <div className="share-card-icon">📱</div>
                  <div className="share-card-content">
                    <div className="share-field">
                      <span className="share-label">
                        {lang === "hin" ? "फोन नंबर" : "Phone Number"}:
                      </span>
                      <span className="share-value">{element.phoneNo}</span>
                    </div>
                    <div className="share-field">
                      <span className="share-label">
                        {lang === "hin" ? "शेयर की तारीख" : "Share Date"}:
                      </span>
                      <span className="share-value">{formatDate(element.shareDate)}</span>
                    </div>
                  </div>
                  <div className="share-card-badge">✓</div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {isFetched && share.length > 0 && (
            <div className="share-pagination-modern">
              <button
                className={`pagination-btn ${pageNo <= 1 ? "disabled" : ""}`}
                onClick={handlePrev}
                disabled={pageNo <= 1}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                {lang === "hin" ? "पिछला" : "Prev"}
              </button>

              <span className="pagination-page">
                {pageNo} / {totalPage}
              </span>

              <button
                className={`pagination-btn ${pageNo >= totalPage ? "disabled" : ""}`}
                onClick={handleNext}
                disabled={pageNo >= totalPage}
              >
                {lang === "hin" ? "अगला" : "Next"}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
}

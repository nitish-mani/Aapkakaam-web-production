// Modern Available Vendor Page - AapkaKaam

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import "./availableVendor.css";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../utils/base";
import axios from "axios";
import CamleCase from "../camleCase/camleCase";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import VendorListItem from "../vendorListItem/vendorListItem";
import PropTypes from "prop-types";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showError } from "../showAlert";

const AvailableVendor = () => {
  // Constants and hooks
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const category = localStorage.getItem("category");

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );
  const pinLocation = useSelector((store) => store.category.location_pincode);

  // Extract route params
  const { jobType, date, month, year } = location.state || {};
  const token = `Bearer ${JSON.parse(localStorage.getItem(category)).token}`;

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

  // Derived values
  const pincode = useMemo(
    () => pinLocation || JSON.parse(localStorage.getItem(category)).address[0]?.pincode,
    [pinLocation, category],
  );

  const booked_date = useMemo(
    () => new Date(`${year}/${month + 1}/${date}`).toDateString(),
    [year, month, date],
  );

  // Format date for display
  const formattedDate = useMemo(() => {
    return new Date(booked_date).toLocaleDateString(lang === "hin" ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [booked_date, lang]);

  // State management
  const [vendorPresent, setVendorPresent] = useState([]);
  const [loading, setLoading] = useState({
    initial: true,
    filter: false,
    page: false,
  });
  const [bookingHappen, setBookingHappen] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [filters, setFilters] = useState({
    minRating: 0,
    minWageRate: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const balance = Math.round(userData[0]?.balance * 100) / 100 || 0;
  const [error, setError] = useState("");

  // API call to fetch vendors
  const fetchVendors = useCallback(async () => {
    if (!pincode) {
      setTimeout(() => {
        setLoading((prev) => ({ ...prev, initial: false }));
        navigate("/address");
      }, 5000);
      return;
    }

    try {
      const endpoint = category === "user" ? "getAll" : "getAllV";
      const url = `${SERVER_URL}/vendor/${endpoint}/${jobType}/${pincode}/${booked_date}/${pageNo}/${filters.minRating}/${filters.minWageRate}`;

      const response = await axios.get(url, {
        headers: { Authorization: token },
      });
      setVendorPresent(response.data.vendors);
      setTotalPage(Math.floor(response.data.total / 12) + 1);
      setLoading((prev) => ({ ...prev, filter: false, page: false }));

      setTimeout(() => {
        setLoading((prev) => ({ ...prev, initial: false }));
      }, 500);
    } catch (err) {
      setLoading((prev) => ({ ...prev, filter: false, page: false }));
      setError(
        err.response?.data?.message ||
          (lang === "hin" ? "विक्रेता लोड करने में विफल" : "Failed to fetch vendors"),
      );
      setTimeout(() => setError(""), 3000);
    }
  }, [pincode, jobType, booked_date, pageNo, filters, token, category, navigate, lang]);

  // Effects
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors, bookingHappen]);

  useEffect(() => {
    const timer = error ? setTimeout(() => setError(""), 3000) : null;
    return () => timer && clearTimeout(timer);
  }, [error]);

  // Handlers
  const handleFilter = useCallback(() => {
    setLoading((prev) => ({ ...prev, filter: true }));
    setBookingHappen((prev) => !prev);
  }, []);

  const handlePrev = useCallback(() => {
    if (pageNo > 1) {
      setLoading((prev) => ({ ...prev, page: true }));
      setPageNo((prev) => prev - 1);
    }
  }, [pageNo]);

  const handleNext = useCallback(() => {
    if (pageNo < totalPage) {
      setLoading((prev) => ({ ...prev, page: true }));
      setPageNo((prev) => prev + 1);
    }
  }, [pageNo, totalPage]);

  const handleCrossInOrders = useCallback(() => navigate("/"), [navigate]);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: Number(value) }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ minRating: 0, minWageRate: 0 });
    setLoading((prev) => ({ ...prev, filter: true }));
    setBookingHappen((prev) => !prev);
  }, []);

  // Render functions
  const renderHeader = () => (
    <div className="vendor-header-modern">
      <div className="vendor-header-left">
        <div className="header-icon-wrapper">
          <span className="header-icon">🔧</span>
        </div>
        <div>
          <h1>
            <CamleCase element={jobType} /> {lang === "hin" ? "सूची" : "List"}
          </h1>
          <p>
            {lang === "hin" ? "उपलब्ध विक्रेता" : "Available Vendors"} • {formattedDate}
          </p>
        </div>
      </div>
      <div className="vendor-balance">
        <span className="balance-label">
          {lang === "hin" ? "उपलब्ध बैलेंस" : "Available Balance"}
        </span>
        <span className="balance-amount">₹{balance}</span>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="vendor-filters-modern">
      <div className="filter-header">
        <span className="filter-icon">🔍</span>
        <h5>
          {lang === "hin" ? "फ़िल्टर करें" : "Filter"} <CamleCase element={jobType} />
        </h5>
        <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "▲" : "▼"}
        </button>
      </div>

      {showFilters && (
        <div className="filter-controls-modern">
          <div className="filter-group">
            <label>{lang === "hin" ? "न्यूनतम रेटिंग" : "Min Rating"}</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange("minRating", e.target.value)}
              className="filter-select-modern"
            >
              <option value="0">{lang === "hin" ? "सभी" : "All"}</option>
              {[1, 2, 3, 4].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} ⭐
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{lang === "hin" ? "न्यूनतम दर" : "Min Wage Rate"}</label>
            <select
              value={filters.minWageRate}
              onChange={(e) => handleFilterChange("minWageRate", e.target.value)}
              className="filter-select-modern"
            >
              <option value="0">{lang === "hin" ? "सभी" : "All"}</option>
              {[100, 200, 300, 400, 500, 1000].map((rate) => (
                <option key={rate} value={rate}>
                  ₹{rate}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button className="filter-reset-btn" onClick={resetFilters} disabled={loading.filter}>
              {lang === "hin" ? "रीसेट" : "Reset"}
            </button>
            <button className="filter-submit-btn" onClick={handleFilter} disabled={loading.filter}>
              {loading.filter ? (
                <span className="btn-spinner"></span>
              ) : lang === "hin" ? (
                "लागू करें"
              ) : (
                "Apply"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderVendors = () => {
    if (loading.initial) {
      return (
        <div className="vendor-loading-modern">
          <div className="loading-spinner-modern"></div>
          <p>{lang === "hin" ? "विक्रेता लोड हो रहे हैं..." : "Loading vendors..."}</p>
        </div>
      );
    }

    if (!pincode || vendorPresent.length === 0) {
      const locationText = pinLocation
        ? pinLocation
        : `${userData[0]?.address[0]?.post} (${userData[0]?.address[0]?.pincode})`;

      return (
        <div className="vendor-empty-modern">
          <span className="empty-icon">📍</span>
          <h3>{lang === "hin" ? "कोई विक्रेता नहीं मिला" : "No vendors found"}</h3>
          <p>
            <CamleCase element={jobType} />{" "}
            {lang === "hin" ? "आपके स्थान पर उपलब्ध नहीं है" : "not available at your location"}
          </p>
          <p className="location-text">{locationText}</p>
        </div>
      );
    }

    return (
      <div className="vendor-grid-modern">
        {vendorPresent.map((data, i) => (
          <VendorListItem
            key={`${data.vendorId}-${i}`}
            data={data}
            userData={userData}
            date={date}
            month={month}
            year={year}
            booked_date={booked_date}
            jobType={jobType}
            token={token}
            category={category}
            bookingHappen={bookingHappen}
            setBookingHappen={setBookingHappen}
            lang={lang}
          />
        ))}
      </div>
    );
  };

  const renderPagination = () => (
    <div className="vendor-pagination-modern">
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
  );

  return (
    <div className="vendor-modern" ref={containerRef}>
      <AdsterraBanner_320x50 />

      <div className="vendor-container-modern">
        {/* Close Button */}
        <button className="vendor-close-btn" onClick={handleCrossInOrders}>
          <svg viewBox="0 0 24 24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {error && (
          <div className="vendor-error-modern">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Header */}
        {renderHeader()}

        {/* Filters */}
        {renderFilters()}

        {/* Vendor List */}
        <div className="vendor-list-modern">{renderVendors()}</div>

        {/* Pagination */}
        {!loading.initial && vendorPresent.length > 0 && renderPagination()}
      </div>

      <AdsterraBanner />
    </div>
  );
};

AvailableVendor.propTypes = {};

export default AvailableVendor;

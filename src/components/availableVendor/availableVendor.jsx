// Modern Available Vendor Page - AapkaKaam

import { useEffect, useState, useCallback, useMemo, useRef } from "react";

import "./availableVendor.css";

import { useLocation, useNavigate } from "react-router";

import { useSelector } from "react-redux";

import { SERVER_URL } from "../../utils/base";

import axios from "axios";

import CamleCase from "../camleCase/camleCase";

import VendorListItem from "../vendorListItem/vendorListItem";

import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";

import AdsterraBanner from "../../ads/adsterraNativeBanner";

// ============================================================
// AVAILABLE VENDOR PAGE
// ============================================================

const AvailableVendor = () => {
  // ==========================================================
  // ROUTER
  // ==========================================================

  const navigate = useNavigate();
  const location = useLocation();

  const containerRef = useRef(null);

  // ==========================================================
  // CATEGORY
  // ==========================================================

  const category = localStorage.getItem("category") || "user";

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  // ==========================================================
  // USER / VENDOR DATA
  // ==========================================================

  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );

  const pinLocation = useSelector((store) => store.category.location_pincode);

  // ==========================================================
  // ROUTE DATA
  // ==========================================================

  const { jobType, date, month, year, serviceData } = location.state || {};

  // ==========================================================
  // LOCAL STORAGE DATA
  // ==========================================================

  const storedAccount = useMemo(() => {
    try {
      const raw = localStorage.getItem(category);

      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [category]);

  // ==========================================================
  // TOKEN
  // ==========================================================

  const token = useMemo(() => {
    return storedAccount?.token ? `Bearer ${storedAccount.token}` : "";
  }, [storedAccount]);

  // ==========================================================
  // PINCODE
  // ==========================================================

  const pincode = useMemo(() => {
    return (
      pinLocation ||
      storedAccount?.address?.[0]?.pincode ||
      userData?.[0]?.address?.[0]?.pincode ||
      ""
    );
  }, [pinLocation, storedAccount, userData]);

  // ==========================================================
  // BOOKING DATE
  // ==========================================================

  const booked_date = useMemo(() => {
    if (date === undefined || month === undefined || year === undefined) {
      return "";
    }

    const parsedDate = new Date(`${year}/${month + 1}/${date}`);

    return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toDateString();
  }, [year, month, date]);

  // ==========================================================
  // FORMATTED DATE
  // ==========================================================

  const formattedDate = useMemo(() => {
    if (!booked_date) {
      return "";
    }

    return new Date(booked_date).toLocaleDateString(lang === "hin" ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [booked_date, lang]);

  // ==========================================================
  // STATE
  // ==========================================================

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

  const [error, setError] = useState("");

  // ==========================================================
  // BALANCE
  // ==========================================================

  const balance = useMemo(() => {
    const value = Number(userData?.[0]?.balance || 0);

    return Math.round(value * 100) / 100;
  }, [userData]);

  // ==========================================================
  // FETCH VENDORS
  // ==========================================================

  const fetchVendors = useCallback(async () => {
    // --------------------------------------------------------
    // Required data check
    // --------------------------------------------------------

    if (!pincode || !jobType || !booked_date) {
      setLoading((prev) => ({
        ...prev,
        initial: false,
        filter: false,
        page: false,
      }));

      return;
    }

    // --------------------------------------------------------
    // Prevent request without token
    // --------------------------------------------------------

    if (!token) {
      setError(lang === "hin" ? "लॉगिन आवश्यक है" : "Login required");

      setLoading((prev) => ({
        ...prev,
        initial: false,
        filter: false,
        page: false,
      }));

      return;
    }

    try {
      // ======================================================
      // ENDPOINT
      // ======================================================

      const endpoint = category === "user" ? "getAll" : "getAllV";

      // ======================================================
      // URL
      //
      // Backend now handles:
      //
      // type[]
      // wageRate[]
      // wageRateType[]
      //
      // and returns the selected job's values.
      // ======================================================

      const url =
        `${SERVER_URL}/vendor/${endpoint}/` +
        `${encodeURIComponent(jobType)}/` +
        `${encodeURIComponent(pincode)}/` +
        `${encodeURIComponent(booked_date)}/` +
        `${pageNo}/` +
        `${filters.minRating}/` +
        `${filters.minWageRate}`;

      // ======================================================
      // REQUEST
      // ======================================================

      const response = await axios.get(url, {
        headers: {
          Authorization: token,
        },

        // Don't keep stale browser response around.
        params: {
          _t: Date.now(),
        },
      });

      const data = response?.data || {};

      // ======================================================
      // VENDORS
      // ======================================================

      const vendors = Array.isArray(data.vendors) ? data.vendors : [];

      // ======================================================
      // NORMALIZE NEW BACKEND RESPONSE
      //
      // New backend:
      //
      // type: "mason"
      // wageRate: 600
      // wageRateType: "Day"
      //
      // Old backend may still return arrays.
      // This normalization keeps the UI compatible.
      // ======================================================

      const normalizedVendors = vendors.map((vendor) => {
        const jobs = Array.isArray(vendor.type) ? vendor.type : vendor.type ? [vendor.type] : [];

        const rates = Array.isArray(vendor.wageRate)
          ? vendor.wageRate
          : vendor.wageRate !== undefined && vendor.wageRate !== null
            ? [vendor.wageRate]
            : [];

        const rateTypes = Array.isArray(vendor.wageRateType)
          ? vendor.wageRateType
          : vendor.wageRateType
            ? [vendor.wageRateType]
            : [];

        // --------------------------------------------------
        // Find requested job
        // --------------------------------------------------

        let jobIndex = jobs.indexOf(jobType);

        // Case-insensitive fallback
        if (jobIndex === -1) {
          jobIndex = jobs.findIndex(
            (job) => String(job).trim().toLowerCase() === String(jobType).trim().toLowerCase(),
          );
        }

        // --------------------------------------------------
        // New backend normally returns scalar values.
        // --------------------------------------------------

        const selectedWageRate = Array.isArray(vendor.wageRate)
          ? (rates[jobIndex] ?? 0)
          : Number(vendor.wageRate || 0);

        const selectedWageRateType = Array.isArray(vendor.wageRateType)
          ? (rateTypes[jobIndex] ?? "")
          : String(vendor.wageRateType || "");

        return {
          ...vendor,

          // ----------------------------------------------
          // Keep vendor ID compatibility
          // ----------------------------------------------

          vendorId: vendor.vendorId || vendor._id || "",

          // ----------------------------------------------
          // Selected job only
          // ----------------------------------------------

          type: vendor.type && !Array.isArray(vendor.type) ? vendor.type : jobType,

          // ----------------------------------------------
          // Selected job wage
          // ----------------------------------------------

          wageRate: selectedWageRate,

          wageRateType: selectedWageRateType,
        };
      });

      // ======================================================
      // UPDATE VENDOR LIST
      // ======================================================

      setVendorPresent(normalizedVendors);

      // ======================================================
      // PAGINATION
      //
      // Prefer backend totalPages.
      //
      // Backend response:
      //
      // totalPages: 3
      //
      // Fallback calculation is retained for compatibility.
      // ======================================================

      const backendTotalPages = Number(data.totalPages);

      const backendTotal = Number(data.total || 0);

      const calculatedTotalPages = backendTotal > 0 ? Math.ceil(backendTotal / 12) : 0;

      setTotalPage(
        Number.isFinite(backendTotalPages) && backendTotalPages >= 0
          ? backendTotalPages
          : calculatedTotalPages,
      );

      // ======================================================
      // LOADING
      // ======================================================

      setLoading((prev) => ({
        ...prev,
        filter: false,
        page: false,
      }));

      // Initial loading animation
      setTimeout(() => {
        setLoading((prev) => ({
          ...prev,
          initial: false,
        }));
      }, 250);
    } catch (err) {
      // ======================================================
      // ERROR
      // ======================================================

      setLoading((prev) => ({
        ...prev,
        initial: false,
        filter: false,
        page: false,
      }));

      setError(
        err?.response?.data?.message ||
          (lang === "hin" ? "विक्रेता लोड करने में विफल" : "Failed to fetch vendors"),
      );
    }
  }, [
    pincode,
    jobType,
    booked_date,
    pageNo,
    filters.minRating,
    filters.minWageRate,
    token,
    category,
    lang,
  ]);

  // ==========================================================
  // FETCH EFFECT
  // ==========================================================

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors, bookingHappen]);

  // ==========================================================
  // ERROR AUTO CLEAR
  // ==========================================================

  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // ==========================================================
  // FILTER
  // ==========================================================

  const handleFilter = useCallback(() => {
    setPageNo(1);

    setLoading((prev) => ({
      ...prev,
      filter: true,
    }));

    setBookingHappen((prev) => !prev);
  }, []);

  // ==========================================================
  // PREVIOUS PAGE
  // ==========================================================

  const handlePrev = useCallback(() => {
    if (pageNo <= 1 || loading.page) {
      return;
    }

    setLoading((prev) => ({
      ...prev,
      page: true,
    }));

    setPageNo((prev) => Math.max(prev - 1, 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pageNo, loading.page]);

  // ==========================================================
  // NEXT PAGE
  // ==========================================================

  const handleNext = useCallback(() => {
    if (pageNo >= totalPage || loading.page) {
      return;
    }

    setLoading((prev) => ({
      ...prev,
      page: true,
    }));

    setPageNo((prev) => Math.min(prev + 1, totalPage));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pageNo, totalPage, loading.page]);

  // ==========================================================
  // CLOSE
  // ==========================================================

  const handleCrossInOrders = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // ==========================================================
  // FILTER CHANGE
  // ==========================================================

  const handleFilterChange = useCallback((filterName, value) => {
    const numericValue = Number(value);

    setFilters((prev) => ({
      ...prev,
      [filterName]: Number.isFinite(numericValue) ? numericValue : 0,
    }));
  }, []);

  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const resetFilters = useCallback(() => {
    setFilters({
      minRating: 0,
      minWageRate: 0,
    });

    setPageNo(1);

    setLoading((prev) => ({
      ...prev,
      filter: true,
    }));

    setBookingHappen((prev) => !prev);
  }, []);

  // ==========================================================
  // HEADER
  // ==========================================================

  const renderHeader = () => {
    const hindiTitle = serviceData?.hindi || jobType || "";

    const englishTitle = jobType ? String(jobType).toUpperCase() : "VENDOR";

    return (
      <div className="vendor-header-modern">
        <div className="vendor-header-left">
          <div className="header-icon-wrapper">
            <span className="header-icon">🔧</span>
          </div>

          <div>
            <h1>{lang === "hin" ? `${hindiTitle} सूची` : `${englishTitle} List`}</h1>

            <p>
              {lang === "hin" ? "उपलब्ध विक्रेता" : "Available Vendors"}

              {formattedDate && (
                <>
                  {" • "}
                  {formattedDate}
                </>
              )}
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
  };

  // ==========================================================
  // FILTERS
  // ==========================================================

  const renderFilters = () => {
    const hindiTitle = serviceData?.hindi || jobType || "";

    const englishTitle = jobType ? String(jobType).toUpperCase() : "VENDOR";

    return (
      <div className="vendor-filters-modern">
        <div className="filter-header">
          <span className="filter-icon">🔍</span>

          <h5>{lang === "hin" ? `${hindiTitle} सूची` : `${englishTitle} List`}</h5>

          <button
            type="button"
            className="filter-toggle-btn"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? "▲" : "▼"}
          </button>
        </div>

        {showFilters && (
          <div className="filter-controls-modern">
            {/* =================================================
                RATING
            ================================================= */}

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

            {/* =================================================
                WAGE
            ================================================= */}

            <div className="filter-group">
              <label>{lang === "hin" ? "न्यूनतम दर" : "Min Service Charge"}</label>

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

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="filter-actions">
              <button
                type="button"
                className="filter-reset-btn"
                onClick={resetFilters}
                disabled={loading.filter}
              >
                {lang === "hin" ? "रीसेट" : "Reset"}
              </button>

              <button
                type="button"
                className="filter-submit-btn"
                onClick={handleFilter}
                disabled={loading.filter}
              >
                {loading.filter ? (
                  <span className="btn-spinner" />
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
  };

  // ==========================================================
  // VENDOR LIST
  // ==========================================================

  const renderVendors = () => {
    // --------------------------------------------------------
    // Initial loading
    // --------------------------------------------------------

    if (loading.initial) {
      return (
        <div className="vendor-loading-modern">
          <div className="loading-spinner-modern" />

          <p>{lang === "hin" ? "विक्रेता लोड हो रहे हैं..." : "Loading vendors..."}</p>
        </div>
      );
    }

    // --------------------------------------------------------
    // Empty
    // --------------------------------------------------------

    if (!pincode || vendorPresent.length === 0) {
      const locationText =
        pinLocation || userData?.[0]?.address?.[0]
          ? `${userData?.[0]?.address?.[0]?.post || ""} (${userData?.[0]?.address?.[0]?.pincode || ""})`
          : "";

      return (
        <div className="vendor-empty-modern">
          <span className="empty-icon">📍</span>

          <h3>{lang === "hin" ? "कोई विक्रेता नहीं मिला" : "No vendors found"}</h3>

          <p>
            <CamleCase element={jobType || ""} />{" "}
            {lang === "hin" ? "आपके स्थान पर उपलब्ध नहीं है" : "not available at your location"}
          </p>

          {locationText && <p className="location-text">{locationText}</p>}
        </div>
      );
    }

    // --------------------------------------------------------
    // Vendor cards
    // --------------------------------------------------------

    return (
      <div className="vendor-grid-modern">
        {vendorPresent.map((data, index) => (
          <VendorListItem
            key={data.vendorId || data._id || `vendor-${index}`}
            data={data}
            userData={userData}
            date={date}
            month={month}
            year={year}
            booked_date={booked_date}
            jobType={jobType}
            jobTypeHindi={serviceData?.hindi || ""}
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

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const renderPagination = () => {
    if (totalPage <= 1) {
      return null;
    }

    return (
      <div className="vendor-pagination-modern">
        {/* ====================================================
            PREVIOUS
        ==================================================== */}

        <button
          type="button"
          className={`pagination-btn ${pageNo <= 1 ? "disabled" : ""}`}
          onClick={handlePrev}
          disabled={pageNo <= 1 || loading.page}
        >
          {loading.page && pageNo > 1 ? (
            <span className="btn-spinner" />
          ) : (
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
          )}

          {lang === "hin" ? "पिछला" : "Prev"}
        </button>

        {/* ====================================================
            PAGE
        ==================================================== */}

        <span className="pagination-page">
          {pageNo} / {totalPage}
        </span>

        {/* ====================================================
            NEXT
        ==================================================== */}

        <button
          type="button"
          className={`pagination-btn ${pageNo >= totalPage ? "disabled" : ""}`}
          onClick={handleNext}
          disabled={pageNo >= totalPage || loading.page}
        >
          {lang === "hin" ? "अगला" : "Next"}

          {loading.page && pageNo < totalPage ? (
            <span className="btn-spinner" />
          ) : (
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
          )}
        </button>
      </div>
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="vendor-modern" ref={containerRef}>
      {/* ======================================================
          TOP AD
      ====================================================== */}

      <AdsterraBanner_320x50 />

      <div className="vendor-container-modern">
        {/* ====================================================
            CLOSE
        ==================================================== */}

        <button
          type="button"
          className="vendor-close-btn"
          onClick={handleCrossInOrders}
          aria-label={lang === "hin" ? "बंद करें" : "Close"}
        >
          <svg viewBox="0 0 24 24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="vendor-error-modern">
            <span className="error-icon">⚠️</span>

            <span>{error}</span>
          </div>
        )}

        {/* ====================================================
            HEADER
        ==================================================== */}

        {renderHeader()}

        {/* ====================================================
            FILTERS
        ==================================================== */}

        {renderFilters()}

        {/* ====================================================
            VENDORS
        ==================================================== */}

        <div className="vendor-list-modern">{renderVendors()}</div>

        {/* ====================================================
            PAGINATION
        ==================================================== */}

        {!loading.initial && vendorPresent.length > 0 && renderPagination()}
      </div>

      {/* ======================================================
          BOTTOM AD
      ====================================================== */}

      <AdsterraBanner />
    </div>
  );
};

export default AvailableVendor;

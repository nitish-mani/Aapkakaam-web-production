// optimized and production ready

import { useEffect, useState, useCallback, useMemo } from "react";
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

const AvailableVendor = () => {
  // Constants and hooks
  const navigate = useNavigate();
  const location = useLocation();
  const category = localStorage.getItem("category");
  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );
  const pinLocation = useSelector((store) => store.category.location_pincode);

  // Extract route params
  const { jobType, date, month, year } = location.state;
  const token = `Bearer ${JSON.parse(localStorage.getItem(category)).token}`;

  // Derived values
  const pincode = useMemo(
    () => pinLocation || JSON.parse(localStorage.getItem(category)).address[0]?.pincode,
    [pinLocation, category],
  );

  const booked_date = useMemo(
    () => new Date(`${year}/${month + 1}/${date}`).toDateString(),
    [year, month, date],
  );

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
      console.log(response);
      setVendorPresent(response.data.vendors);
      setTotalPage(Math.floor(response.data.total / 12) + 1);
      setLoading((prev) => ({ ...prev, filter: false, page: false }));

      // Small delay to ensure smooth loading animation
      setTimeout(() => {
        setLoading((prev) => ({ ...prev, initial: false }));
      }, 500);
    } catch (err) {
      setLoading((prev) => ({ ...prev, filter: false, page: false }));
      setError(err.response?.data?.message || "Failed to fetch vendors");
      setTimeout(() => setError(""), 3000);
    }
  }, [pincode, jobType, booked_date, pageNo, filters, token, category, navigate]);

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

  // Render functions
  const renderHeader = () => (
    <h1 className="available-vendor__header">
      <CamleCase element={jobType} /> List
      <span className="available-vendor__date">(for date - {booked_date})</span>
    </h1>
  );

  const renderFilters = () => (
    <div className="available-vendor__filters">
      <h5>
        Filter <CamleCase element={jobType} /> List
      </h5>
      <div className="available-vendor__filter-controls">
        <select
          value={filters.minRating}
          onChange={(e) => handleFilterChange("minRating", e.target.value)}
          className="available-vendor__select"
        >
          <option value="0">Rating</option>
          {[0, 1, 2, 3, 4].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
        <select
          value={filters.minWageRate}
          onChange={(e) => handleFilterChange("minWageRate", e.target.value)}
          className="available-vendor__select"
        >
          <option value="0">Wage Rate</option>
          {[0, 100, 200, 300, 400].map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </select>
        <button
          className="available-vendor__filter-button"
          onClick={handleFilter}
          disabled={loading.filter}
        >
          {loading.filter ? "Loading..." : "Submit"}
        </button>
      </div>
    </div>
  );

  const renderVendors = () => {
    if (loading.initial) {
      return <div className="loading" />;
    }

    if (!pincode || vendorPresent.length === 0) {
      const locationText = pinLocation
        ? pinLocation
        : `${userData[0]?.address[0]?.post} (${userData[0]?.address[0]?.pincode})`;

      return (
        <div className="available-vendor__empty">
          <CamleCase element={jobType} /> not found in your location: {locationText}
        </div>
      );
    }

    return vendorPresent.map((data, i) => {
      return (
        i % 3 == 0 ? <></> : <div style={{ display: "none" }}></div>,
        (
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
          />
        )
      );
    });
  };

  const renderPagination = () => (
    <div className="available-vendor__pagination">
      <button
        className={`available-vendor__page-button ${pageNo <= 1 ? "disabled" : ""}`}
        onClick={handlePrev}
        disabled={pageNo <= 1}
      >
        Prev
      </button>
      <span className="available-vendor__page-number">{pageNo}</span>
      <button
        className={`available-vendor__page-button ${pageNo >= totalPage ? "disabled" : ""}`}
        onClick={handleNext}
        disabled={pageNo >= totalPage}
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="available-vendor__container">
      <AdsterraBanner_320x50 />
      <img
        src={cross}
        alt="Close"
        className="available-vendor__close-button"
        onClick={handleCrossInOrders}
      />
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
        Available Balance : Rs <span style={{ color: "green" }}>{balance}</span>
      </div>
      {error && <div className="available-vendor__error">{error}</div>}

      {renderHeader()}
      {/* {renderFilters()} */}

      <div className="available-vendor__list">{renderVendors()}</div>
      <AdsterraBanner />
      {renderPagination()}
    </div>
  );
};

AvailableVendor.propTypes = {
  // Add prop types if this component receives any props
};

export default AvailableVendor;

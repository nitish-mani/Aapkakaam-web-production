// Modern View Orders Page - AapkaKaam

import "./view.css";

import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { useSelector } from "react-redux";
import OrderList from "../orderList/orderList";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showError } from "../showAlert";

export default function ViewOrders() {
  const category = localStorage.getItem("category");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const cancelOrder = useSelector((store) => store.category.cancelOrder);

  const token = `Bearer ${userData[0]?.token || JSON.parse(localStorage.getItem(category))?.token}`;
  const userId =
    category === "user"
      ? userData[0]?.userId || JSON.parse(localStorage.getItem(category))?.userId
      : userData[0]?.vendorId || JSON.parse(localStorage.getItem(category))?.vendorId;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("pending");

  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [err, setErr] = useState("");

  const pendingVendorData = [];
  const completeVendorData = [];
  const cancelVendorData = [];

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
      setTimeout(() => {
        setErr("");
      }, 3000);
      return;
    }
    if (category === "user") {
      axios
        .get(`${SERVER_URL}/bookings/getOrdersU/${userId}/${pageNo}`, {
          headers: { Authorization: token },
        })
        .then((result) => {
          setOrders(result.data.orders);
          const page = Math.floor(result.data.total / 12) + 1;
          setTotalPage(page);
          setIsLoading(false);
        })
        .catch((err) => {
          showError(
            err.response?.data?.message ||
              (lang === "hin" ? "ऑर्डर लोड करने में विफल" : "Failed to load orders"),
          );
          setIsLoading(false);
          setTimeout(() => {
            setErr("");
          }, 3000);
        });
    } else if (category === "vendor") {
      axios
        .get(`${SERVER_URL}/bookings/getOrdersV/${userId}/${pageNo}`, {
          headers: { Authorization: token },
        })
        .then((result) => {
          setOrders(result.data.orders);
          const page = Math.floor(result.data.total / 12) + 1;
          setTotalPage(page);
          setIsLoading(false);
        })
        .catch((err) => {
          showError(
            err.response?.data?.message ||
              (lang === "hin" ? "ऑर्डर लोड करने में विफल" : "Failed to load orders"),
          );
          setIsLoading(false);
          setTimeout(() => {
            setErr("");
          }, 3000);
        });
    }
  }, [cancelOrder, pageNo, lang]);

  function handleOrdersView() {
    orders.forEach((data) => {
      if (!data.cancelOrder && !data.orderCompleted) {
        pendingVendorData.push(data);
      } else if (!data.cancelOrder && data.orderCompleted) {
        completeVendorData.push(data);
      } else if (data.cancelOrder && !data.orderCompleted) {
        cancelVendorData.push(data);
      }
    });
  }
  handleOrdersView();

  function handleCrossInOrders() {
    navigate("/");
  }

  function handlePrev() {
    if (pageNo > 1) {
      setIsLoading(true);
      setPageNo((page) => page - 1);
    }
  }

  function handleNext() {
    if (pageNo < totalPage) {
      setIsLoading(true);
      setPageNo((page) => page + 1);
    }
  }

  // Get status label based on language
  const getStatusLabel = (status) => {
    const labels = {
      pending: lang === "hin" ? "लंबित" : "Pending",
      complete: lang === "hin" ? "पूर्ण" : "Completed",
      cancel: lang === "hin" ? "रद्द" : "Canceled",
    };
    return labels[status] || status;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: "#2563eb",
      complete: "#16a34a",
      cancel: "#dc2626",
    };
    return colors[status] || "#64748b";
  };

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="orders-modern" ref={containerRef}>
        <div className="orders-container-modern">
          {/* Close Button */}
          <button className="orders-close-btn" onClick={handleCrossInOrders}>
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
          <div className="orders-header-modern">
            <div className="orders-header-left">
              <div className="header-icon-wrapper">
                <span className="header-icon">📋</span>
              </div>
              <div>
                <h1>{lang === "hin" ? "मेरे ऑर्डर" : "My Orders"}</h1>
                <p>
                  {lang === "hin"
                    ? "अपने सभी ऑर्डर देखें और प्रबंधित करें"
                    : "View and manage all your orders"}
                </p>
              </div>
            </div>
            <span className="orders-total">
              {orders.length} {lang === "hin" ? "ऑर्डर" : "orders"}
            </span>
          </div>

          {/* Status Tabs */}
          <div className="orders-tabs-modern">
            <button
              className={`tab-btn ${orderStatus === "pending" ? "active" : ""}`}
              onClick={() => setOrderStatus("pending")}
              style={{ "--tab-color": "#2563eb" }}
            >
              <span className="tab-dot pending"></span>
              {lang === "hin" ? "लंबित" : "Pending"}
              <span className="tab-count">{pendingVendorData.length}</span>
            </button>

            <button
              className={`tab-btn ${orderStatus === "complete" ? "active" : ""}`}
              onClick={() => setOrderStatus("complete")}
              style={{ "--tab-color": "#16a34a" }}
            >
              <span className="tab-dot complete"></span>
              {lang === "hin" ? "पूर्ण" : "Completed"}
              <span className="tab-count">{completeVendorData.length}</span>
            </button>

            <button
              className={`tab-btn ${orderStatus === "cancel" ? "active" : ""}`}
              onClick={() => setOrderStatus("cancel")}
              style={{ "--tab-color": "#dc2626" }}
            >
              <span className="tab-dot cancel"></span>
              {lang === "hin" ? "रद्द" : "Canceled"}
              <span className="tab-count">{cancelVendorData.length}</span>
            </button>
          </div>

          {/* Orders List */}
          <div className="orders-list-modern">
            {isLoading ? (
              <div className="orders-loading-modern">
                <div className="loading-spinner-modern"></div>
                <p>{lang === "hin" ? "ऑर्डर लोड हो रहे हैं..." : "Loading orders..."}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="orders-empty-modern">
                <span className="empty-icon">📦</span>
                <h3>{lang === "hin" ? "अभी तक कोई ऑर्डर नहीं" : "No orders yet"}</h3>
                <p>
                  {lang === "hin"
                    ? "जब आप ऑर्डर करेंगे, यहाँ दिखाई देंगे"
                    : "When you place an order, it will appear here"}
                </p>
              </div>
            ) : pendingVendorData.length !== 0 ||
              completeVendorData.length !== 0 ||
              cancelVendorData.length !== 0 ? (
              <>
                {orderStatus === "pending" && pendingVendorData.length !== 0 ? (
                  pendingVendorData?.map((element, i) => {
                    return (
                      <OrderList element={element} key={i} orderStatus={orderStatus} lang={lang} />
                    );
                  })
                ) : orderStatus === "pending" ? (
                  <div className="orders-empty-modern small">
                    <span className="empty-icon">📭</span>
                    <p>{lang === "hin" ? "कोई लंबित ऑर्डर नहीं" : "No pending orders"}</p>
                  </div>
                ) : (
                  ""
                )}
                {orderStatus === "complete" && completeVendorData.length !== 0 ? (
                  completeVendorData?.map((element, i) => {
                    return (
                      <OrderList element={element} key={i} orderStatus={orderStatus} lang={lang} />
                    );
                  })
                ) : orderStatus === "complete" ? (
                  <div className="orders-empty-modern small">
                    <span className="empty-icon">✅</span>
                    <p>{lang === "hin" ? "कोई पूर्ण ऑर्डर नहीं" : "No completed orders"}</p>
                  </div>
                ) : (
                  ""
                )}
                {orderStatus === "cancel" && cancelVendorData.length !== 0 ? (
                  cancelVendorData?.map((element, i) => {
                    return (
                      <OrderList element={element} key={i} orderStatus={orderStatus} lang={lang} />
                    );
                  })
                ) : orderStatus === "cancel" ? (
                  <div className="orders-empty-modern small">
                    <span className="empty-icon">❌</span>
                    <p>{lang === "hin" ? "कोई रद्द ऑर्डर नहीं" : "No canceled orders"}</p>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="orders-pagination-modern">
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

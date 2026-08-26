// Modern Transaction Stats Page - AapkaKaam

import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../utils/base";
import cross from "../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import "./TransactionStats.css";

const TransactionStats = () => {
  const navigate = useNavigate();

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("all");

  const userData = JSON.parse(localStorage.getItem("user") || localStorage.getItem("vendor"));
  const token = userData?.token ? `Bearer ${userData.token}` : "";

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${SERVER_URL}/payment/transactions/stats`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        params: {
          range: timeRange,
        },
      });

      if (response.data.success) {
        setStats(response.data);
        console.log("Fetched stats:", response.data);
      } else {
        setError(response.data.message || "Failed to fetch stats");
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.response?.data?.message || "Error fetching transaction stats");
    } finally {
      setLoading(false);
    }
  };

  // ============ Helper function to get status label ============
  const getStatusLabel = (status) => {
    if (!status) return "UNKNOWN";

    const statusMap = {
      completed: lang === "hin" ? "पूरा हुआ" : "Completed",
      pending: lang === "hin" ? "लंबित" : "Pending",
      initiated: lang === "hin" ? "शुरू किया गया" : "Initiated",
      failed: lang === "hin" ? "विफल" : "Failed",
      abandoned: lang === "hin" ? "छोड़ दिया" : "Abandoned",
      refunded: lang === "hin" ? "वापस किया गया" : "Refunded",
    };

    return statusMap[status] || status.toUpperCase();
  };

  // ============ Helper function to get status color ============
  const getStatusColor = (status) => {
    if (!status) return "unknown";

    const colorMap = {
      completed: "completed",
      pending: "pending",
      initiated: "initiated",
      failed: "failed",
      abandoned: "abandoned",
      refunded: "refunded",
    };

    return colorMap[status] || "unknown";
  };

  // ============ Helper function to get status icon ============
  const getStatusIcon = (status) => {
    if (!status) return "❓";

    const iconMap = {
      completed: "✅",
      pending: "⏳",
      initiated: "🔄",
      failed: "❌",
      abandoned: "🚫",
      refunded: "↩️",
    };

    return iconMap[status] || "❓";
  };

  function handleCrossInOrders() {
    navigate("/");
  }

  if (loading) {
    return (
      <div className="stats-modern">
        <div className="stats-loading-modern">
          <div className="loader"></div>
          <p>{lang === "hin" ? "लोड हो रहा है..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-modern">
        <div className="stats-error-modern">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <div className="error-actions">
            <button className="retry-btn" onClick={fetchStats}>
              {lang === "hin" ? "पुनः प्रयास करें" : "Retry"}
            </button>
            <button className="back-btn" onClick={() => navigate("/addMoney")}>
              {lang === "hin" ? "वापस जाएं" : "Back"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-modern">
        <div className="stats-empty-modern">
          <span className="empty-icon">📊</span>
          <p>
            {lang === "hin" ? "कोई लेनदेन डेटा उपलब्ध नहीं है" : "No transaction data available"}
          </p>
        </div>
      </div>
    );
  }

  const { summary, stats: statusStats } = stats;
  const filteredStatusStats =
    statusStats?.filter((stat) => stat._id !== null && stat._id !== undefined) || [];
  const totalCount = summary?.total || 0;

  return (
    <div className="stats-modern">
      <div className="stats-modern-container">
        {/* Decorative Elements */}
        <div className="stats-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Close Button */}
        <button className="stats-close-btn" onClick={handleCrossInOrders}>
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
        <div className="stats-header-modern">
          <div className="stats-badge">{lang === "hin" ? "📊 लेनदेन" : "📊 TRANSACTIONS"}</div>
          <h1>{lang === "hin" ? "लेनदेन आँकड़े" : "Transaction Statistics"}</h1>
        </div>

        {/* Time Filter */}
        <div className="stats-filter">
          <button
            className={timeRange === "all" ? "active" : ""}
            onClick={() => setTimeRange("all")}
          >
            {lang === "hin" ? "सभी" : "All Time"}
          </button>
          <button
            className={timeRange === "week" ? "active" : ""}
            onClick={() => setTimeRange("week")}
          >
            {lang === "hin" ? "इस सप्ताह" : "This Week"}
          </button>
          <button
            className={timeRange === "month" ? "active" : ""}
            onClick={() => setTimeRange("month")}
          >
            {lang === "hin" ? "इस महीने" : "This Month"}
          </button>
          <button
            className={timeRange === "year" ? "active" : ""}
            onClick={() => setTimeRange("year")}
          >
            {lang === "hin" ? "इस साल" : "This Year"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="stats-grid-modern">
          <div className="stat-card-modern total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-label">
                {lang === "hin" ? "कुल लेनदेन" : "Total Transactions"}
              </span>
              <span className="stat-number">{summary?.total || 0}</span>
            </div>
          </div>

          <div className="stat-card-modern completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-label">{lang === "hin" ? "सफल" : "Successful"}</span>
              <span className="stat-number">{summary?.completed || 0}</span>
              <span className="stat-percentage">
                {summary?.conversionRate || 0}% {lang === "hin" ? "रूपांतरण" : "conversion"}
              </span>
            </div>
          </div>

          <div className="stat-card-modern revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-label">
                {lang === "hin" ? "कुल रिचार्ज" : "Total Recharge"}
              </span>
              <span className="stat-number">₹{summary?.totalRevenue || 0}</span>
            </div>
          </div>

          <div className="stat-card-modern discount">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <span className="stat-label">{lang === "hin" ? "कुल छूट" : "Total Discount"}</span>
              <span className="stat-number">₹{summary?.totalDiscountGiven || 0}</span>
            </div>
          </div>

          <div className="stat-card-modern abandoned">
            <div className="stat-icon">🚫</div>
            <div className="stat-content">
              <span className="stat-label">{lang === "hin" ? "छोड़ दिया" : "Abandoned"}</span>
              <span className="stat-number">{summary?.abandoned || 0}</span>
              <span className="stat-percentage">
                {totalCount > 0 ? (((summary?.abandoned || 0) / totalCount) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>

          <div className="stat-card-modern failed">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <span className="stat-label">{lang === "hin" ? "विफल" : "Failed"}</span>
              <span className="stat-number">{summary?.failed || 0}</span>
              <span className="stat-percentage">
                {totalCount > 0 ? (((summary?.failed || 0) / totalCount) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="status-breakdown-modern">
          <h3>{lang === "hin" ? "स्थिति विवरण" : "Status Breakdown"}</h3>
          {filteredStatusStats.length === 0 ? (
            <div className="no-status-data">
              <p>
                {lang === "hin"
                  ? "कोई लेनदेन स्थिति डेटा उपलब्ध नहीं है"
                  : "No transaction status data available"}
              </p>
            </div>
          ) : (
            <div className="status-bars-modern">
              {filteredStatusStats.map((stat) => {
                const status = stat._id || "unknown";
                const count = stat.count || 0;
                const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

                return (
                  <div key={status} className="status-bar-item-modern">
                    <div className="status-label-modern">
                      <span className="status-name">
                        <span className="status-icon">{getStatusIcon(status)}</span>
                        {getStatusLabel(status)}
                      </span>
                      <span className="status-count">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="status-bar-modern">
                      <div
                        className={`status-bar-fill ${getStatusColor(status)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="status-amounts-modern">
                      <span>
                        {lang === "hin" ? "राशि" : "Amount"}: ₹{stat.totalAmount || 0}
                      </span>
                      <span>
                        {lang === "hin" ? "छूट" : "Discount"}: ₹{stat.totalDiscount || 0}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-modern">
          <h3>{lang === "hin" ? "त्वरित आँकड़े" : "Quick Stats"}</h3>
          <div className="quick-stats-grid-modern">
            <div className="quick-stat-modern">
              <span className="label">{lang === "hin" ? "शुरू किया" : "Initiated"}</span>
              <span className="value">{summary?.initiated || 0}</span>
            </div>
            <div className="quick-stat-modern">
              <span className="label">{lang === "hin" ? "लंबित" : "Pending"}</span>
              <span className="value">{summary?.pending || 0}</span>
            </div>
            <div className="quick-stat-modern">
              <span className="label">{lang === "hin" ? "सफलता दर" : "Success Rate"}</span>
              <span className="value">{summary?.conversionRate || 0}%</span>
            </div>
            <div className="quick-stat-modern">
              <span className="label">{lang === "hin" ? "औसत लेनदेन" : "Avg. Transaction"}</span>
              <span className="value">
                ₹
                {totalCount > 0 && (summary?.completed || 0) > 0
                  ? ((summary?.totalRevenue || 0) / (summary?.completed || 1)).toFixed(0)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStats;

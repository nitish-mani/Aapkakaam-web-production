import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../utils/base";
import cross from "../resources/svg/multiply-svgrepo-com.svg";

import { useNavigate } from "react-router";
import "./TransactionStats.css";

const TransactionStats = () => {
  const navigate = useNavigate();
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
      completed: "Completed",
      pending: "Pending",
      initiated: "Initiated",
      failed: "Failed",
      abandoned: "Abandoned",
      refunded: "Refunded",
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

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="loader"></div>
        <p>Loading transaction stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="stats-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchStats}>Retry</button>
          <button onClick={navigate.bind(null, "/addMoney")}>Back</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-empty">
        <p>No transaction data available</p>
      </div>
    );
  }

  const { summary, stats: statusStats } = stats;

  // ============ Filter out null/undefined statuses ============
  const filteredStatusStats =
    statusStats?.filter((stat) => stat._id !== null && stat._id !== undefined) || [];

  // ============ Calculate total for percentage ============
  const totalCount = summary?.total || 0;
  function handleCrossInOrders() {
    navigate("/");
  }
  return (
    <div className="views-P">
      <img
        className="profile__close-button"
        src={cross}
        alt="cross"
        onClick={handleCrossInOrders}
        style={{ cursor: "pointer" }}
      />
      <div className="transaction-stats-container">
        <div className="stats-header">
          <h2>Transaction Statistics</h2>
          <div className="time-filter">
            <button
              className={timeRange === "all" ? "active" : ""}
              onClick={() => setTimeRange("all")}
            >
              All Time
            </button>
            <button
              className={timeRange === "week" ? "active" : ""}
              onClick={() => setTimeRange("week")}
            >
              This Week
            </button>
            <button
              className={timeRange === "month" ? "active" : ""}
              onClick={() => setTimeRange("month")}
            >
              This Month
            </button>
            <button
              className={timeRange === "year" ? "active" : ""}
              onClick={() => setTimeRange("year")}
            >
              This Year
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Transactions</h3>
              <p className="stat-number">{summary?.total || 0}</p>
            </div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Successful</h3>
              <p className="stat-number">{summary?.completed || 0}</p>
              <span className="stat-percentage">{summary?.conversionRate || 0}% conversion</span>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Recharge</h3>
              <p className="stat-number">₹{summary?.totalRevenue || 0}</p>
            </div>
          </div>

          <div className="stat-card discount">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <h3>Total Discount</h3>
              <p className="stat-number">₹{summary?.totalDiscountGiven || 0}</p>
            </div>
          </div>

          <div className="stat-card abandoned">
            <div className="stat-icon">🚫</div>
            <div className="stat-content">
              <h3>Abandoned</h3>
              <p className="stat-number">{summary?.abandoned || 0}</p>
              <span className="stat-percentage">
                {totalCount > 0 ? (((summary?.abandoned || 0) / totalCount) * 100).toFixed(1) : 0}%
                abandoned
              </span>
            </div>
          </div>

          <div className="stat-card failed">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>Failed</h3>
              <p className="stat-number">{summary?.failed || 0}</p>
              <span className="stat-percentage">
                {totalCount > 0 ? (((summary?.failed || 0) / totalCount) * 100).toFixed(1) : 0}%
                failed
              </span>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="status-breakdown">
          <h3>Status Breakdown</h3>
          {filteredStatusStats.length === 0 ? (
            <div className="no-status-data">
              <p>No transaction status data available</p>
            </div>
          ) : (
            <div className="status-bars">
              {filteredStatusStats.map((stat) => {
                const status = stat._id || "unknown";
                const count = stat.count || 0;
                const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

                return (
                  <div key={status} className="status-bar-item">
                    <div className="status-label">
                      <span className="status-name">
                        <span className="status-icon">{getStatusIcon(status)}</span>
                        {getStatusLabel(status)}
                      </span>
                      <span className="status-count">
                        {count} transactions ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="status-bar">
                      <div
                        className={`status-bar-fill ${getStatusColor(status)}`}
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="status-amounts">
                      <span>Amount: ₹{stat.totalAmount || 0}</span>
                      <span>Discount: ₹{stat.totalDiscount || 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <h3>Quick Stats</h3>
          <div className="quick-stats-grid">
            <div className="quick-stat">
              <span className="label">Initiated</span>
              <span className="value">{summary?.initiated || 0}</span>
            </div>
            <div className="quick-stat">
              <span className="label">Pending</span>
              <span className="value">{summary?.pending || 0}</span>
            </div>
            <div className="quick-stat">
              <span className="label">Success Rate</span>
              <span className="value">{summary?.conversionRate || 0}%</span>
            </div>
            <div className="quick-stat">
              <span className="label">Avg. Transaction</span>
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

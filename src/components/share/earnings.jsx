import "./earnings.css";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showInfo } from "../showAlert";

export default function Earnings() {
  const category = localStorage.getItem("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const token = `Bearer ${userData[0]?.token || JSON.parse(localStorage.getItem(category))?.token}`;

  const userId =
    category === "user"
      ? userData[0]?.userId || JSON.parse(localStorage.getItem(category))?.userId
      : userData[0]?.vendorId || JSON.parse(localStorage.getItem(category))?.vendorId;

  const [earnings, setEarnings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!navigator.onLine) {
      setIsLoading(false);
      setErr("You are offline");
      setTimeout(() => setErr(""), 3000);
      return;
    }

    axios
      .get(`${SERVER_URL}/${category}/getEarnings/${userId}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setEarnings(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setErr("Something went wrong");
        setTimeout(() => {
          setErr("");
          navigate("/");
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (err) {
      showInfo(err);
    }
  }, [err]);

  function handleClose() {
    navigate("/");
  }
  function handleWithdraw() {}

  return (
    <div className="earnings-container">
      <AdsterraBanner_320x50 />

      <img
        src={cross}
        alt="close"
        className="
          profile__close-button"
        onClick={handleClose}
      />

      <h1 className="page-title">Earnings Dashboard</h1>

      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="earnings-grid">
          <div className="earning-card new-orders">
            <p className="label">Total Share</p>
            <h2>{earnings?.shareCount || 0}</h2>
          </div>
          <div className="earning-card total-orders">
            <p className="label">Total Orders</p>
            <h2>
              {earnings?.pendingShareBy + earnings?.completedShareBy + earnings?.canceledShareBy ||
                0}
            </h2>
          </div>

          <div className="earning-card new-orders">
            <p className="label">New Orders</p>
            <h2>{earnings?.pendingShareBy || 0}</h2>
          </div>

          <div className="earning-card completed-orders">
            <p className="label">Completed Orders</p>
            <h2>{earnings?.completedShareBy || 0}</h2>
          </div>

          <div className="earning-card canceled-orders">
            <p className="label">Canceled Orders</p>
            <h2>{earnings?.canceledShareBy || 0}</h2>
          </div>

          <div className="earning-card average-earnings">
            <p className="label">Earning</p>
            <h2>₹{earnings?.earning || 0}</h2>
          </div>

          <button
            className="withdraw-btn"
            onClick={() => {
              if (earnings?.earning < 1000 || earnings?.shareCount < 100) {
                setErr(
                  "Withdraw will work after Your Earning is more than 1000 Rupees and Share is more than 100",
                );
                setTimeout(() => setErr(""), 100);
              } else handleWithdraw();
            }}
          >
            Withdraw
          </button>
        </div>
      )}

      <AdsterraBanner />
    </div>
  );
}

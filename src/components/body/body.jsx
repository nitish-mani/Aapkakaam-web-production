import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { addDataVendor } from "../../utils/vendorslice";
import { addDataUser } from "../../utils/userslice";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import Attendance from "../Attendance/attendance";
import CategoryComponent from "../categoryComponent";
import serviceData from "../../data/serviceData";

export default function Body() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const category = localStorage.getItem("category");
  const userData = useSelector((state) =>
    category === "user" ? state.user.data : state.vendor.data,
  );
  const token = `Bearer ${userData[0]?.token}`;
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!navigator.onLine) throw new Error("You are offline");
        const id = category === "vendor" ? userData[0]?.vendorId : userData[0]?.userId;
        if (category === "vendor" && id) {
          const { data } = await axios.get(`${SERVER_URL}/vendor/getVendorByVendor/${id}`, {
            headers: { Authorization: token },
          });
          const newData = {
            ...userData[0],
            balance: data.balance,
            rating: data.rating,
            ratingCount: data.ratingCount,
          };
          dispatch(addDataVendor(newData));
          localStorage.setItem(category, JSON.stringify(newData));
        } else if (category === "user" && id) {
          const { data } = await axios.get(`${SERVER_URL}/user/getUserByUser/${id}`, {
            headers: { Authorization: token },
          });
          const newData = {
            ...userData[0],
          };
          dispatch(addDataUser(newData));
          localStorage.setItem(category, JSON.stringify(newData));
        }
      } catch (error) {
        setErr("Something went wrong");
        setTimeout(() => setErr(""), 3000);
      }
    };
    fetchData();
  }, []);

  function handleAddAddress() {
    navigate("/address");
  }

  const renderError = (msg) => (
    <div
      className="err"
      style={{
        opacity: msg ? 1 : "",
        top: "-5rem",
        border: msg ? "none" : "none",
      }}
    >
      {msg}
    </div>
  );

  const renderProfileVisibilityMessage = () => {
    if (category === "vendor" && userData[0]?.address?.length === 0) {
      return (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          Your profile is not visible to User. Please Update Your Address to make your profile
          visible.
          <span
            className="verify-btn forgetPass"
            style={{ border: "none" }}
            onClick={handleAddAddress}
          >
            Add
          </span>
        </div>
      );
    }
    return null;
  };

  const renderWageRateMessage = () => {
    if (!userData[0]?.wageRate && category === "vendor" && userData[0]?.balance) {
      return (
        <div style={{ marginTop: "2rem", textAlign: "center", color: "red" }}>
          Your profile is not visible to User. Please Set Your{" "}
          <span style={{ color: "blue" }}>Wage Rate</span> from Your Profile.
        </div>
      );
    }
    return null;
  };

  const renderBalanceMessage = () => {
    const { balance, commission } = userData[0] || {};
    if (!balance) return null;
    let message = "";
    if (balance <= commission && category === "vendor") {
      message = (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          Your <span style={{ color: "blue" }}>Balance</span> is{" "}
          <span style={{ color: "red" }}>{balance}</span>. You can't do bookings . Please{" "}
          <span onClick={() => navigate("/addMoney")} style={{ color: "blue" }}>
            Recharge
          </span>{" "}
          to increase your Balance.
        </div>
      );
    } else if (balance <= 20 && category === "user") {
      message = (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          Your <span style={{ color: "blue" }}>Balance</span> is less than {balance}
          Rs. Please{" "}
          <span onClick={() => navigate("/addMoney")} style={{ color: "blue" }}>
            Recharge
          </span>{" "}
          to increase your Balance.
        </div>
      );
    }
    return message;
  };

  return (
    <div style={{ backgroundColor: "white", padding: "0 1rem" }}>
      {renderError(err)}
      {renderProfileVisibilityMessage()}
      {renderWageRateMessage()}
      {renderBalanceMessage()}

      <AdsterraBanner_320x50 />
      <>
        {serviceData.map((category) => (
          <CategoryComponent key={category.heading} category={category} />
        ))}
      </>

      <AdsterraBanner_320x50 />
    </div>
  );
}

import { Outlet } from "react-router";
import "../index.css";

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";

import { addDataUser, clearDataUser } from "../utils/userslice";
import { addDataVendor, clearDataVendor } from "../utils/vendorslice";
import { setCategory } from "../utils/categoryslice";

import { SERVER_URL } from "../utils/base";

export default function Homepage() {
  const dispatch = useDispatch();

  // Restore logged-in user/vendor session from localStorage
  useEffect(() => {
    const category = localStorage.getItem("category");

    if (!category) {
      return;
    }

    let storedData = {};

    try {
      storedData = JSON.parse(localStorage.getItem(category) || "{}");
    } catch (error) {
      console.error("Invalid stored authentication data:", error);
    }

    if (category === "user") {
      dispatch(clearDataUser());

      if (storedData?.token) {
        dispatch(addDataUser(storedData));
      }
    }

    if (category === "vendor") {
      dispatch(clearDataVendor());

      if (storedData?.token) {
        dispatch(addDataVendor(storedData));
      }
    }

    if (storedData?.token) {
      dispatch(setCategory(category));
    }
  }, [dispatch]);

  return (
    <div className="main-div">
      <NavBar />

      {/* Current route content */}
      <Outlet />

      <Footer />
    </div>
  );
}

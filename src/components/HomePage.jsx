import { Outlet } from "react-router";
import "../index.css";

import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";

import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { addDataUser, clearDataUser } from "../utils/userslice";

import { addDataVendor, clearDataVendor } from "../utils/vendorslice";

import { setCategory } from "../utils/categoryslice";

export default function Homepage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const category = localStorage.getItem("category");

    if (!category) {
      return;
    }

    const storedData = JSON.parse(localStorage.getItem(category) || "{}");

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

      <Outlet />

      <Footer />
    </div>
  );
}

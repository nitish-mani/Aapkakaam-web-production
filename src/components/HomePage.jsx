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
  const category = localStorage.getItem("category");

  useEffect(() => {
    if (category === "user") dispatch(clearDataUser());
    else if (category === "vendor") dispatch(clearDataVendor());
    const token = JSON.parse(localStorage.getItem(category))?.token;
    if (token) {
      if (category === "user")
        dispatch(addDataUser(JSON.parse(localStorage.getItem(category))));
      else if (category === "vendor")
        dispatch(addDataVendor(JSON.parse(localStorage.getItem(category))));
      dispatch(setCategory(localStorage.getItem("category")));
    }
  }, []);

  return (
    <div className="main-div">
      <NavBar />
      <div className="line"></div>
      <Outlet></Outlet>
      <Footer />
    </div>
  );
}

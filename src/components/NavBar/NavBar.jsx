import { useState } from "react";
import "./NavBar.css";

import aapkaKaam_logo from "../../resources/svg/AapkaKaam_full2.svg";
import user from "../../resources/svg/user-svgrepo-com.svg";
import locationPinn from "../../resources/svg/location-pin-svgrepo-com.svg";
import magnifingGlass from "../../resources/svg/magnifying-glass-svgrepo-com.svg";

import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import Profile from "../profile/profile";

import { setPrIsVisibleUser } from "../../utils/userslice";
import { setPrIsVisibleVendor } from "../../utils/vendorslice";
import { setSelectLanguage } from "../../utils/categoryslice";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchItem, setSearchItem] = useState("");

  const category = localStorage.getItem("category");

  const token = JSON.parse(localStorage.getItem(category) || "{}")?.token;

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const postLocation = useSelector((store) => store.category.location_post);
  const pinLocation = useSelector((store) => store.category.location_pincode);
  const lang = useSelector((store) => store.category.selectLanguage);

  const address = postLocation
    ? `${postLocation}${pinLocation ? ` (${pinLocation})` : ""}`
    : userData?.[0]?.address?.[0]
      ? `${userData[0].address[0].post} (${userData[0].address[0].pincode})`
      : "Select location";

  function handleLogin() {
    if (!userData?.length) {
      navigate("/category");
      return;
    }

    // Navigate to profile page when logged in
    navigate("/profile");
  }

  function handleLocation() {
    navigate("/address", {
      state: {
        viewOnLocation: true,
      },
    });
  }

  function handleSearch(e) {
    const value = e.target.value;
    setSearchItem(value);
  }

  function submitSearch(e) {
    e.preventDefault();

    if (!searchItem.trim()) return;

    if (token) {
      navigate("/checkBookingDate", {
        state: {
          jobType: searchItem.toLowerCase(),
        },
      });
    } else {
      navigate("/category");
    }

    setSearchItem("");
  }

  return (
    <header className="modern-navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={aapkaKaam_logo} alt="AapkaKaam" />
      </div>

      <button className="navbar-location" onClick={handleLocation}>
        <img src={locationPinn} alt="" />

        <div>
          <small>Location</small>

          <strong>{address || "Select location"}</strong>
        </div>
      </button>

      <div className="navbar-right">
        <div className="language-switch">
          <button
            className={lang === "en" ? "active" : ""}
            onClick={() => dispatch(setSelectLanguage("en"))}
          >
            EN
          </button>

          <button
            className={lang === "hin" ? "active" : ""}
            onClick={() => dispatch(setSelectLanguage("hin"))}
          >
            हिं
          </button>
        </div>

        <button className={`login-button ${token ? "logged-in" : ""}`} onClick={handleLogin}>
          {token ? (
            <>
              <img src={user} alt="profile" />
            </>
          ) : (
            <>
              <span>Login</span>
            </>
          )}
        </button>
      </div>

      {/* Remove Profile component - we'll navigate to profile page instead */}
      {/* {userData?.length > 0 && <Profile />} */}
    </header>
  );
}

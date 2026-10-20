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

  const [homeBanner, setHomeBanner] = useState(null);

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

  // Fetch public home banner from backend
  useEffect(() => {
    let isMounted = true;

    const fetchHomeBanner = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/home-banner`);

        if (!isMounted || !response.data?.success) {
          return;
        }

        const banner = response.data.banner;

        if (banner?.enabled === true && banner?.imageUrl) {
          setHomeBanner(banner);
        } else {
          setHomeBanner(null);
        }
      } catch (error) {
        console.error("Failed to fetch home banner:", error.response?.data || error.message);

        // Banner failure must not block the homepage
        if (isMounted) {
          setHomeBanner(null);
        }
      }
    };

    fetchHomeBanner();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="main-div">
      <NavBar />

      {/* Dynamic Home Banner */}
      {homeBanner?.enabled && homeBanner?.imageUrl && (
        <section className="home-banner" aria-label="Aapkakaam home banner">
          {homeBanner.clickUrl ? (
            <a
              href={homeBanner.clickUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="home-banner-link"
              aria-label="Open banner link"
            >
              <img
                src={homeBanner.imageUrl}
                alt="Aapkakaam promotional banner"
                className="home-banner-image"
                loading="eager"
                fetchPriority="high"
              />
            </a>
          ) : (
            <img
              src={homeBanner.imageUrl}
              alt="Aapkakaam promotional banner"
              className="home-banner-image"
              loading="eager"
              fetchPriority="high"
            />
          )}
        </section>
      )}

      {/* Current route content */}
      <Outlet />

      <Footer />
    </div>
  );
}

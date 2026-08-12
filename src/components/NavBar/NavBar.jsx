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
import CamleCase from "../camleCase/camleCase";

export default function NavBar() {
  const items = [
    "labour",
    "mason",
    "electrician",
    "plumber",
    "ac mechanic",
    "fridge mechanic",
    "driver",
    "home tutor",
    "milk man",
    "parlour",
    "menhandi maker",
    "pundits",
    "carpenter",
    "laptop repaire",
    "washer man",
    "cook",
    "painter",
    "bike repaire",
    "car repaire",
    "tiles fitter",
    "four wheeler",
    "lights",
    "bus",
    "tent house",
    "generator",
    "auto",
    "dj",
    "dhankutti",
    "aata chakki",
    "latrine tank cleaner",
    "marriage hall",
    "shuttering",
    "waiter",
    "marble fitter",
    "e-riksha",
    "pual cutter",
    "ro",
    "chaat",
    "dulha rath",
    "kirtan mandli",
    "mini truck",
    "मजदूर",
    "राजमिस्त्री",
    "बिजली मिस्त्री",
    "प्लंबर",
    "एसी मैकेनिक",
    "फ्रिज मैकेनिक",
    "चालक",
    "घरेलू शिक्षक",
    "दूधवाला",
    "पार्लर",
    "मेहँदी मेकर",
    "पंडित",
    "बढ़ई",
    "लैपटॉप की मरम्मत",
    "धोबी",
    "बाबर्ची",
    "पेंटर",
    "बाइक की मरम्मत",
    "कार की मरम्मत",
    "टाइल लगानेवाला",
    "चार पहिया वाहन बुकिंग",
    "लाइट बुकिंग",
    "बस बुकिंग",
    "टेंट हाउस की बुकिंग",
    "जनरेटर बुकिंग",
    "ऑटो बुकिंग",
    "डीजे बुकिंग",
    "धनकुट्टी बुकिंग",
    "आटाचक्की",
    "शौचालय टैंक क्लीनर",
    "विवाह हॉल बुकिंग",
    "शटरिंग बुकिंग",
    "वेटर",
    "संगमरमर लगनेवाला",
    "ई-रिक्शा बुकिंग",
    "पुआल काटनेवाला",
    "आरओ वाटर बुकिंग",
    "चाट बुकिंग",
    "दुल्हारथ बुकिंग",
    "कीर्तन मंडली बुकिंग",
    "छोटा ट्रक",
  ];

  const [btnClicked, setBtnClicked] = useState(false);
  const [searchItem, setSearchItem] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const category = localStorage.getItem("category");
  const token = JSON.parse(localStorage.getItem(category))?.token;

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const postLocation = useSelector((store) => store.category.location_post);
  const pinLocation = useSelector((store) => store.category.location_pincode);
  const lang = useSelector((store) => store.category.selectLanguage);

  const address = postLocation
    ? `${postLocation}(${pinLocation})`
    : userData[0]?.address[0]
      ? `${userData[0]?.address[0]?.post} (${userData[0]?.address[0]?.pincode})`
      : "";

  function handleLogin() {
    setBtnClicked(true);
    setTimeout(() => setBtnClicked(false), 100);
    if (userData.length === 0) navigate("/category");
    else {
      if (category === "user") dispatch(setPrIsVisibleUser(true));
      else if (category === "vendor") dispatch(setPrIsVisibleVendor(true));
    }
  }

  function handleLogoClick() {
    navigate("/");
  }

  function handleOtherLocation() {
    navigate("/address", { state: { viewOnLocation: true } });
  }
  function handleSearchItem(data) {
    setSearchItem("");
    if (token) navigate("/checkBookingDate", { state: { jobType: data } });
    else navigate("/category");
  }

  return (
    <div className="navbar">
      <div className="navbar__logo" onClick={handleLogoClick}>
        <img src={aapkaKaam_logo} alt="logo" />
      </div>

      <div className="navbar__location" onClick={handleOtherLocation}>
        <div className="div1">
          <img src={locationPinn} alt="" className="svg" />
        </div>

        <input
          type="text"
          placeholder="Location"
          className="input"
          value={address}
          readOnly
        />
      </div>
      <div className="navbar__search">
        <div className="div1">
          <img src={magnifingGlass} alt="" className="svg" />
        </div>
        <input
          type="text"
          placeholder="Search Services"
          className="input"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </div>
      {searchItem != "" ? (
        <div className="searchItem">
          {items.map((data, i) => {
            if (data.includes(searchItem.toLocaleLowerCase())) {
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (i < 41) handleSearchItem(data);
                    else {
                      const data = items[i - 41];
                      handleSearchItem(data);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CamleCase element={data} />
                </div>
              );
            }
          })}
        </div>
      ) : (
        ""
      )}

      <div className="navbar__action-container">
        <button
          className="navbar__login"
          onClick={handleLogin}
          style={{
            transform: btnClicked ? "translateY(5px)" : "",
            backgroundColor: userData?.length != 0 ? "transparent" : "",
            border: userData?.length != 0 ? "1px solid #1161e4" : "",
          }}
        >
          {token ? (
            <img src={user} alt="" style={{ width: "20px" }} />
          ) : (
            "Login"
          )}
        </button>
        <div>
          <div className="selectLang">
            <div
              style={{
                borderBottom:
                  lang == "en" ? "2px solid black" : "2px solid #fff",
                padding: lang == "en" ? ".2rem" : ".2rem",
                cursor: "pointer",
              }}
              onClick={() => dispatch(setSelectLanguage("en"))}
            >
              Eng
            </div>
            <div
              style={{
                borderBottom:
                  lang == "en" ? "2px solid #fff" : "2px solid black",
                padding: lang == "hin" ? ".3rem" : ".2rem",
                cursor: "pointer",
              }}
              onClick={() => dispatch(setSelectLanguage("hin"))}
            >
              हिंदी
            </div>
          </div>
        </div>
      </div>

      {userData?.length ? <Profile /> : ""}
    </div>
  );
}

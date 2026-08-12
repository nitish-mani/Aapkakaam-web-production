import "./share.css";
import React from "react";

import twitter from "../../resources/svg/twitter-svgrepo-com.svg";
import facebook from "../../resources/svg/facebook-svgrepo-com.svg";
import linkedin from "../../resources/svg/linkedin-svgrepo-com.svg";
import whatsapp from "../../resources/svg/whatsapp-svgrepo-com.svg";
import telegram from "../../resources/svg/telegram-svgrepo-com.svg";
import textMessage from "../../resources/svg/message-mid-text-svgrepo-com.svg";
import Attendance from "../Attendance/attendance";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import { SERVER_URL } from "../../utils/base";

const Share = () => {
  const category = localStorage.getItem("category");
  const userId =
    category === "user"
      ? JSON.parse(localStorage.getItem(category)).userId
      : JSON.parse(localStorage.getItem(category)).vendorId;

  const url = `${SERVER_URL}/category/${category}/${userId}`;
  const text = `Shared by ${JSON.parse(localStorage.getItem(category)).name}`;
  const phoneNumber = "";

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url,
    )}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
      url,
    )}&title=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, "_blank");
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text,
    )}%20${encodeURIComponent(url)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareOnTelegram = () => {
    const telegramUrl = `https://telegram.me/share/url?url=${encodeURIComponent(
      url,
    )}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank");
  };

  const handleShare = () => {
    const smsUri = `sms:${phoneNumber}?body=${encodeURIComponent(url)}`;
    window.open(smsUri);
  };

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="share">
        <button onClick={shareOnTwitter}>
          {" "}
          <img src={twitter} alt="" />
        </button>
        <button onClick={shareOnFacebook}>
          {" "}
          <img src={facebook} alt="" />
        </button>
        <button onClick={shareOnLinkedIn}>
          <img src={linkedin} alt="" />
        </button>
        <button onClick={shareOnWhatsApp}>
          <img src={whatsapp} alt="" />
        </button>
        <button onClick={shareOnTelegram}>
          <img src={telegram} alt="" />
        </button>
        <button onClick={handleShare}>
          <img src={textMessage} alt="" />
        </button>
      </div>
      {/* <Attendance pageNo={2} /> */}
      <AdsterraBanner />
    </>
  );
};

export default Share;

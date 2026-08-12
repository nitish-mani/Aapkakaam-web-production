import React, { useEffect } from "react";

const VideoSlider = () => {
  useEffect(() => {
    const d = document;
    const s = d.createElement("script");
    const l = d.scripts[d.scripts.length - 1];

    s.settings = {};
    s.src =
      "//probableregret.com/bVXNV.sIduGBlF0sYTWncM/Jekmu9/ubZQU/l/kqPFTyYx0jM/j-Ys4dNVT/k/tTN/j/QIyhNCjWgV2zMrAv";
    s.async = true;
    s.referrerPolicy = "no-referrer-when-downgrade";

    l.parentNode.insertBefore(s, l);

    // Optional: cleanup script if component unmounts
    return () => {
      if (s.parentNode) s.parentNode.removeChild(s);
    };
  }, []);

  return <div id="video-slider-container"></div>;
};

export default VideoSlider;

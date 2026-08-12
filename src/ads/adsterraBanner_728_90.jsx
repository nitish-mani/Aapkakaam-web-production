import { useEffect, useRef } from "react";

const AdsterraBanner_728x90 = () => {
  const adRef = useRef(null);

  useEffect(() => {
    // Set global ad options
    window.atOptions = {
      key: "f0f5d303ffb88c6da82c37c81cd90090",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    // Create and inject the ad script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//shorterwanderer.com/f0f5d303ffb88c6da82c37c81cd90090/invoke.js";
    script.async = true;

    if (adRef.current) {
      adRef.current.innerHTML = ""; // Clear previous ad if any
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1rem 0",
      }}
    >
      <div ref={adRef} style={{ width: "728px", height: "90px" }} />
    </div>
  );
};

export default AdsterraBanner_728x90;

// AdComponent.jsx
import { useEffect, useRef, useState } from "react";

const AdComponent = () => {
  const adRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setVisible(true); // Set visible only after push
    } catch (e) {
      console.error("AdSense load error", e);
    }
  }, []);

  return (
    <div
      style={{
        display: visible ? "block" : "none",
        textAlign: "center",
        margin: "1rem 0",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1204932742437478"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      ></ins>
    </div>
  );
};

export default AdComponent;

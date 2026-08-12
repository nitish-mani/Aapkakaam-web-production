import { useEffect, useState } from "react";
import "./timer.css";

export default function Timer({ setOtpTimer }) {
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    let interval;
    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setOtpTimer(false);
    }
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <div className="timer">
      <span>{seconds}</span> <span>{"s"}</span>
    </div>
  );
}

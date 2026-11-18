// Counts down to launch day. Updates once a second.
import { useEffect, useState } from "react";
import { nextLaunch } from "../data/offer.js";

const pad = (n) => String(n).padStart(2, "0");

export default function Countdown() {
  const [target] = useState(() => nextLaunch());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = Math.max(0, target.getTime() - now);
  const parts = [
    ["days", Math.floor(left / 86400000)],
    ["hrs", Math.floor(left / 3600000) % 24],
    ["min", Math.floor(left / 60000) % 60],
    ["sec", Math.floor(left / 1000) % 60],
  ];

  return (
    <div className="countdown" role="timer" aria-label="Time until launch">
      {parts.map(([label, value]) => (
        <div key={label} className="count">
          <span className="count-num">{pad(value)}</span>
          <span className="count-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

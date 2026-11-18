// Coral hero. The photo's background is the same coral (#FE6A4C), so the can floats on the page.
import { useState } from "react";
import { WAITLIST, FIRST_BATCH, launchLabel } from "../data/offer.js";
import Countdown from "./Countdown.jsx";

export default function Hero({ code, onCode }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function join(e) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "waitlist" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      onCode(WAITLIST.code);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="hero">
      <div className="topbar">
        <a className="logo" href="/">sola.</a>
        <a className="btn btn-ink btn-small" href="#order">Pre-order</a>
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">New. Launching {launchLabel()}</p>
          <h1 className="hero-title">
            Sunshine, <em>sparkling.</em>
          </h1>
          <p className="hero-sub">
            A sparkling fruit soda made with real fruit juice and only 5g of sugar. Four flavours. First batch limited to {FIRST_BATCH} cans.
          </p>

          <Countdown />

          {code ? (
            <div className="waitlist-done" role="status">
              <span className="code">{code}</span>
              <span>You're on the list. 20% off your first case is applied at checkout.</span>
            </div>
          ) : (
            <form className="waitlist" onSubmit={join} noValidate>
              <label className="sr-only" htmlFor="wl-email">Email</label>
              <input id="wl-email" type="email" autoComplete="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn btn-ink" type="submit" disabled={busy}>
                {busy ? "Joining..." : "Get 20% off"}
              </button>
            </form>
          )}
          {error && <p className="error" role="alert">{error}</p>}
          {!code && <p className="hero-fine">Join the waitlist for 20% off your launch case. No spam.</p>}
        </div>

        <figure className="hero-media">
          <img src="/img/hero.jpg" alt="A sola. can in yellow, coral and teal floating on a coral background" fetchPriority="high" />
        </figure>
      </div>
    </header>
  );
}

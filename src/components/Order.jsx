// "Never run dry." The order box: flavour, subscribe or one-time, then Stripe Checkout.
import { useEffect, useState } from "react";
import { FLAVOURS, MIXED, PLANS, WAITLIST, CANS_PER_CASE, findFlavour } from "../data/offer.js";

const money = (n) => `$${n.toFixed(2)}`;

export default function Order({ flavour, onFlavour, code }) {
  const [planId, setPlanId] = useState("subscribe");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cancelled] = useState(() => new URLSearchParams(location.search).get("checkout") === "cancelled");

  useEffect(() => {
    const reset = () => setBusy(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const plan = PLANS[planId];
  const current = findFlavour(flavour);
  const hasCode = code === WAITLIST.code;
  const today = hasCode ? plan.price * (1 - WAITLIST.percent / 100) : plan.price;

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flavour, plan: planId, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout couldn't start. Please try again.");
      location.href = data.url;
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <section id="order" className="section order" aria-labelledby="order-title" style={{ "--c": current.color, "--soft": current.soft }}>
      <figure className="order-media">
        <img src="/img/can-white.jpg" alt="A plain white can standing on a light grey surface" loading="lazy" />
      </figure>

      <div className="order-panel">
        <p className="eyebrow eyebrow-dark">Pre-order your case</p>
        <h2 id="order-title" className="section-title">Never run dry.</h2>
        {cancelled && <p className="notice">Your case is still waiting. Pick up where you left off.</p>}

        <p className="field-label">Flavour</p>
        <div className="chips" role="radiogroup" aria-label="Flavour">
          {[...FLAVOURS, MIXED].map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={f.id === flavour} className={`chip${f.id === flavour ? " is-on" : ""}`} style={{ "--c": f.color }} onClick={() => onFlavour(f.id)}>
              <span className="chip-dot" />
              {f.name}
            </button>
          ))}
        </div>

        <p className="field-label">How often</p>
        <div className="plans" role="radiogroup" aria-label="Plan">
          {Object.values(PLANS).map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={p.id === planId} className={`plan${p.id === planId ? " is-on" : ""}`} onClick={() => setPlanId(p.id)}>
              <span className="plan-radio" />
              <span className="plan-text">
                <span className="plan-label">{p.label}</span>
                <span className="plan-detail">{p.detail}</span>
              </span>
              <span className="plan-price">
                {money(p.price)}
                {p.was && <s>{money(p.was)}</s>}
              </span>
            </button>
          ))}
        </div>

        <div className="summary">
          <span>{CANS_PER_CASE} cans, {current.name}{plan.per && `, ${plan.per}`}</span>
          <span>
            {hasCode && <s>{money(plan.price)}</s>}
            <strong>{money(today)}</strong>
          </span>
        </div>
        {hasCode && <p className="code-line">Waitlist code {WAITLIST.code} applied: 20% off your first case.</p>}

        <button type="button" className="btn btn-ink btn-wide" onClick={checkout} disabled={busy}>
          {busy ? "Opening secure checkout..." : planId === "subscribe" ? "Subscribe and pre-order" : "Pre-order my case"}
        </button>
        {error && <p className="error" role="alert">{error}</p>}
        <p className="fine">Free US shipping. Ships on launch day. Secure payment by Stripe.</p>
      </div>
    </section>
  );
}

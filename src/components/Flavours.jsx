// Four flavours. Choosing one sets it in the order box below.
import { FLAVOURS } from "../data/offer.js";

export default function Flavours({ onPick }) {
  return (
    <section id="flavours" className="section flavours" aria-labelledby="flavours-title">
      <div className="section-head">
        <p className="eyebrow eyebrow-dark">Four flavours</p>
        <h2 id="flavours-title" className="section-title">Pick your sunshine.</h2>
      </div>
      <div className="flavour-grid">
        {FLAVOURS.map((f) => (
          <article key={f.id} className="flavour" style={{ "--c": f.color, "--soft": f.soft }}>
            <div className="flavour-img">
              <img src={f.img} alt={f.alt} loading="lazy" />
            </div>
            <div className="flavour-body">
              <h3>{f.name}</h3>
              <p>{f.notes}</p>
              <button type="button" className="flavour-btn" onClick={() => onPick(f.id)}>
                Choose {f.name}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

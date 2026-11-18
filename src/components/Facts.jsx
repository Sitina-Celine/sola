const FACTS = [
  ["5g", "sugar per can"],
  ["35", "calories"],
  ["0", "artificial sweeteners"],
  ["100%", "real fruit juice"],
];

export default function Facts() {
  return (
    <section className="facts" aria-label="What's in a can">
      {FACTS.map(([big, small]) => (
        <div key={small} className="fact">
          <span className="fact-big">{big}</span>
          <span className="fact-small">{small}</span>
        </div>
      ))}
    </section>
  );
}

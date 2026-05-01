// src/pages/MarketTimingPage.jsx
export default function MarketTimingPage() {
  return (
    <section className="timing-section">
      <h2>Know When to Buy or Sell</h2>

      <div className="timing-chart">
        <p>📈 Price trends in Tunisia</p>

        {/* Ici tu peux intégrer chart.js plus tard */}
      </div>

      <div className="signals-row">
        <div className="signal-chip sc-buy">📈 Good to Buy</div>
        <div className="signal-chip sc-sell">💰 Good to Sell</div>
        <div className="signal-chip sc-wait">⏳ Wait</div>
      </div>
    </section>
  );
}
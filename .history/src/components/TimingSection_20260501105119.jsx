import { useEffect, useState } from 'react';
import { getZoneSignals } from '../services/api';

const TimingSection = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getZoneSignals()
      .then(setSignals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const buyZones  = signals.filter(s => s.signal === "buy")
                           .map(s => s.gouvernorat).join(" · ") || "—";
  const sellZones = signals.filter(s => s.signal === "sell")
                           .map(s => s.gouvernorat).join(" · ") || "—";
  const waitZones = signals.filter(s => s.signal === "wait")
                           .map(s => s.gouvernorat).join(" · ") || "—";

  const avgGrowth = signals.filter(s => s.signal === "buy").length > 0
    ? (signals.filter(s => s.signal === "buy")
              .reduce((acc, s) => acc + s.growth_pct, 0) /
       signals.filter(s => s.signal === "buy").length).toFixed(1)
    : "...";

  return (
    <section className="timing-section" id="timing">
      <div className="timing-inner">
        <div className="timing-visual">
          <div className="timing-chart">
            <div className="chart-title">
              <span>Price trend · Tunisia</span>
              <span className="chart-now">Live signal</span>
            </div>
            <svg viewBox="0 0 360 120" width="100%" style={{ display: 'block' }}>
              <line x1="0" y1="20" x2="360" y2="20" stroke="#e8ddd0" strokeWidth="1" />
              <line x1="0" y1="60" x2="360" y2="60" stroke="#e8ddd0" strokeWidth="1" />
              <line x1="0" y1="100" x2="360" y2="100" stroke="#e8ddd0" strokeWidth="1" />
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C1602A" stopOpacity=".2" />
                  <stop offset="100%" stopColor="#C1602A" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M10,95 C40,90 70,82 100,75 C130,68 160,58 190,50 C220,42 250,35 280,28" fill="none" stroke="#C1602A" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M280,28 C300,22 320,17 350,12" fill="none" stroke="#C1602A" strokeWidth="2" strokeDasharray="5 3" />
              <path d="M10,95 C40,90 70,82 100,75 C130,68 160,58 190,50 C220,42 250,35 280,28 L280,105 L10,105 Z" fill="url(#lineGrad)" />
              <line x1="280" y1="5" x2="280" y2="105" stroke="#D4A853" strokeWidth="1" strokeDasharray="3 2" />
              <rect x="255" y="5" width="58" height="14" rx="4" fill="#D4A853" opacity=".15" />
              <text x="284" y="15" fill="#B8911F" fontSize="8" textAnchor="middle" fontFamily="DM Sans,sans-serif">Today</text>
              <text x="8" y="18" fill="#9C8E82" fontSize="8" fontFamily="DM Sans,sans-serif">High</text>
              <text x="8" y="98" fill="#9C8E82" fontSize="8" fontFamily="DM Sans,sans-serif">Low</text>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--light)', marginTop: '6px' }}>
              <span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025 →</span>
            </div>

            <div className="signals-row">
              {loading ? (
                <div style={{ color: 'var(--light)', fontSize: '12px', padding: '12px' }}>
                  Loading signals...
                </div>
              ) : (
                <>
                  <div className="signal-chip sc-buy">
                    <div className="sc-emoji">📈</div>
                    <div className="sc-label">Good to Buy</div>
                    <div className="sc-zones">{buyZones}</div>
                  </div>
                  <div className="signal-chip sc-sell">
                    <div className="sc-emoji">💰</div>
                    <div className="sc-label">Good to Sell</div>
                    <div className="sc-zones">{sellZones}</div>
                  </div>
                  <div className="signal-chip sc-wait">
                    <div className="sc-emoji">⏳</div>
                    <div className="sc-label">Wait a bit</div>
                    <div className="sc-zones">{waitZones}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="timing-floating">
            <div className="tf-big">+{avgGrowth}%</div>
            <div className="tf-sub">Predicted growth<br />next 6 months</div>
          </div>
        </div>

        <div className="timing-text">
          <div className="s-eyebrow"><span>Market Timing</span></div>
          <h2>Know <em>When</em> to<br />Buy or Sell</h2>
          <p className="s-desc" style={{ marginBottom: '32px' }}>
            Our system analyzes years of Tunisian real estate data to predict
            the best time to act — so you never miss a good deal or sell at the wrong moment.
          </p>
          <div className="benefit-list">
            {[
              { icon: 'M9 2v10M4 7l5 5 5-5', title: 'Buy at the right price', desc: 'We show you when property values are about to rise, so you buy before the market peaks.' },
              { icon: 'M3 9h12M9 4l5 5-5 5', title: 'Sell at the best moment', desc: 'Maximize your return by selling when our model identifies peak demand in your area.' },
              { icon: 'M9 6v3l2 2', title: 'Updated daily', desc: 'Signals refresh every 24 hours based on new listings, transactions, and economic data.', isCircle: true }
            ].map((item, idx) => (
              <div key={idx} className="benefit-item">
                <div className="b-icon">
                  <svg viewBox="0 0 18 18" fill="none">
                    {item.isCircle ? (
                      <>
                        <circle cx="9" cy="9" r="6" stroke="#fff" strokeWidth="2" />
                        <path d={item.icon} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                      </>
                    ) : (
                      <path d={item.icon} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </svg>
                </div>
                <div className="b-text"><h4>{item.title}</h4><p>{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimingSection;
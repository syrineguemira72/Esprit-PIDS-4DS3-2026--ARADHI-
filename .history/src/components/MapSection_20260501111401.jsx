import { useEffect, useState } from "react";

/* -------------------- DATA REALISTE -------------------- */

const REAL_ZONES = [
  { city: "Tunis", price: 4200, change: 3.2 },
  { city: "Ariana", price: 2600, change: 1.5 },
  { city: "Ben Arous", price: 1800, change: -1.2 },
  { city: "Manouba", price: 1700, change: -2.5 },
  { city: "Nabeul", price: 2300, change: 8.5 },
  { city: "Sousse", price: 2100, change: 6.1 },
  { city: "Monastir", price: 1750, change: -1.8 },
  { city: "Sfax", price: 1600, change: -3.5 },
  { city: "Bizerte", price: 1200, change: 5.2 },
  { city: "Zaghouan", price: 1100, change: 4.3 }
];

/* -------------------- LOGIQUE METIER -------------------- */

const getTag = (change) => {
  if (change > 5) {
    return { tag: "Buy now", class: "t-buy", fill: "fill-buy" };
  }
  if (change < -3) {
    return { tag: "Sell now", class: "t-sell", fill: "fill-sell" };
  }
  return { tag: "Watch", class: "t-wait", fill: "fill-wait" };
};

const formatZone = (zone) => {
  const tagData = getTag(zone.change);

  return {
    city: zone.city,
    price: zone.price.toLocaleString(),
    sub:
      zone.change > 0
        ? `Prices rising · +${zone.change}% expected`
        : `Slight decline · ${zone.change}% expected`,
    width: `${Math.min(Math.abs(zone.change) * 10, 100)}%`,
    tag: tagData.tag,
    tagClass: tagData.class,
    fillClass: tagData.fill
  };
};

/* -------------------- PINS -------------------- */

const PINS = [
  { top: "25%", left: "48%", type: "pin-wait", label: "Tunis" },
  { top: "30%", left: "52%", type: "pin-wait", label: "Ariana" },
  { top: "40%", left: "50%", type: "pin-buy", label: "Nabeul" },
  { top: "50%", left: "52%", type: "pin-buy", label: "Sousse" },
  { top: "60%", left: "48%", type: "pin-sell", label: "Sfax" },
  { top: "20%", left: "42%", type: "pin-buy", label: "Bizerte" }
];

/* -------------------- COMPONENTS -------------------- */

const Pin = ({ top, left, type, label }) => (
  <div className="pin" style={{ top, left }}>
    <div className={`pin-circle ${type}`} />
    <div className="pin-label">{label}</div>
  </div>
);

const ZoneCard = ({ zone }) => (
  <div className="map-zone-card">
    <div className="mzc-header">
      <div className="mzc-city">{zone.city}</div>
      <span className={`mzc-tag ${zone.tagClass}`}>{zone.tag}</span>
    </div>

    <div className="mzc-price">
      {zone.price} TND <span className="mzc-unit">/m²</span>
    </div>

    <div className="mzc-sub">{zone.sub}</div>

    <div className="mzc-bar">
      <div
        className={`mzc-fill ${zone.fillClass}`}
        style={{ width: zone.width }}
      />
    </div>
  </div>
);

/* -------------------- MAIN -------------------- */

export default function MapSection() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    // simulation API réaliste
    const formatted = REAL_ZONES.map(formatZone);
    setZones(formatted);
  }, []);

  return (
    <section className="map-section">
      <h2>
        Best Zones to <em>Buy & Sell</em>
      </h2>

      <div className="map-layout">

        {/* MAP */}
        <div className="map-container">
          <div className="map-tunisia">

            <svg viewBox="0 0 220 340" className="map-shape">
              <path
                d="M110 15 C125 17 138 22 148 35 C162 52 159 65 165 82 C172 100 178 110 176 127 C174 144 164 152 160 168 C156 184 160 200 152 210 C142 222 130 220 120 230 C110 240 106 252 96 250 C86 248 80 238 73 228 C66 218 59 210 55 198 C50 183 52 168 49 154 C46 140 38 130 40 116 C42 102 52 94 60 80 C68 66 66 50 78 40 C90 30 96 12 110 15Z"
                fill="#C1602A"
              />
            </svg>

            <div className="map-pins">
              {PINS.map((p, i) => (
                <Pin key={i} {...p} />
              ))}
            </div>

            <div className="map-credit">Demo realistic data</div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="map-sidebar">
          <div className="sidebar-title">Top regions right now</div>

          {zones.map((z, i) => (
            <ZoneCard key={i} zone={z} />
          ))}
        </div>
      </div>
    </section>
  );
}
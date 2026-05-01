import { useEffect, useState } from "react";
import { getZonesMap } from "../services/api";

/* -------------------- Fallback Data -------------------- */

const FALLBACK_ZONES = [
  {
    city: "Tunis Nord",
    tag: "Buy now",
    tagClass: "t-buy",
    price: "2 450",
    sub: "Strong demand · prices rising",
    width: "92%",
    fillClass: "fill-buy",
  },
  {
    city: "Sousse",
    tag: "Buy now",
    tagClass: "t-buy",
    price: "1 760",
    sub: "Steady growth · tourist demand",
    width: "75%",
    fillClass: "fill-buy",
  },
  {
    city: "Sfax",
    tag: "Sell now",
    tagClass: "t-sell",
    price: "1 470",
    sub: "Peak reached · ideal to exit",
    width: "62%",
    fillClass: "fill-sell",
  },
  {
    city: "Monastir",
    tag: "Watch",
    tagClass: "t-wait",
    price: "1 280",
    sub: "Flat trend · wait for signal",
    width: "48%",
    fillClass: "fill-wait",
  },
];

const FALLBACK_PINS = [
  { top: "22%", left: "45%", type: "pin-buy", label: "Tunis Nord" },
  { top: "30%", left: "52%", type: "pin-buy", label: "Les Berges" },
  { top: "42%", left: "55%", type: "pin-wait", label: "Monastir" },
  { top: "48%", left: "50%", type: "pin-buy", label: "Sousse" },
  { top: "62%", left: "44%", type: "pin-sell", label: "Sfax" },
  { top: "18%", left: "40%", type: "pin-sell", label: "Bizerte" },
  { top: "72%", left: "38%", type: "pin-wait", label: "Gabès" },
];

/* -------------------- Sub Components -------------------- */

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
      {zone.price} TND
      <span className="mzc-unit">/m²</span>
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

/* -------------------- Main Component -------------------- */

const MapSection = () => {
  const [zones, setZones] = useState([]);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const data = await getZonesMap();
        setZones(data.zones || []);
        setPins(data.pins || []);
      } catch (err) {
        console.error("Error loading zones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const displayZones = zones.length ? zones : FALLBACK_ZONES;
  const displayPins = pins.length ? pins : FALLBACK_PINS;

  return (
    <section className="map-section" id="map">
      <div className="s-eyebrow">
        <span>Zone Map</span>
      </div>

      <h2>
        Best Zones to <em>Buy & Sell</em>
      </h2>

      <p className="s-desc">
        Explore Tunisia region by region. Click any zone to see price trends,
        average costs, and our current recommendation.
      </p>

      <div className="map-layout">
        {/* -------------------- MAP -------------------- */}
        <div className="map-container">
          <div className="map-tunisia">
            <svg
              viewBox="0 0 220 340"
              width="180"
              height="270"
              className="map-shape"
            >
              <path
                d="M110 15 C125 17 138 22 148 35 C162 52 159 65 165 82 C172 100 178 110 176 127 C174 144 164 152 160 168 C156 184 160 200 152 210 C142 222 130 220 120 230 C110 240 106 252 96 250 C86 248 80 238 73 228 C66 218 59 210 55 198 C50 183 52 168 49 154 C46 140 38 130 40 116 C42 102 52 94 60 80 C68 66 66 50 78 40 C90 30 96 12 110 15Z"
                fill="#C1602A"
                stroke="#A0481C"
                strokeWidth="2"
              />
            </svg>

            <div className="map-pins">
              {displayPins.map((pin, i) => (
                <Pin key={i} {...pin} />
              ))}
            </div>

            <div className="map-credit">Powered by Leaflet.js</div>
          </div>
        </div>

        {/* -------------------- SIDEBAR -------------------- */}
        <div className="map-sidebar">
          <div className="map-sidebar-title">
            {loading ? "Loading zones..." : "Top regions right now"}
          </div>

          {displayZones.map((zone, i) => (
            <ZoneCard key={i} zone={zone} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MapSection;
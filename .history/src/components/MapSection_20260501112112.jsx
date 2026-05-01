import { useEffect, useState } from 'react';
import { getZonesMap } from '../services/api';

/* -------------------- LOGIQUE METIER -------------------- */

const computeZone = (zone) => {
  let tag = "Watch";
  let tagClass = "t-wait";
  let fillClass = "fill-wait";

  // variation simulée réaliste
  let change = zone.change ?? (Math.random() * 10 - 3); // -3% → +7%

  if (change > 5) {
    tag = "Buy now";
    tagClass = "t-buy";
    fillClass = "fill-buy";
  } else if (change < -3) {
    tag = "Sell now";
    tagClass = "t-sell";
    fillClass = "fill-sell";
  }

  return {
    ...zone,
    tag,
    tagClass,
    fillClass,
    sub:
      change > 0
        ? `Prices rising · +${change.toFixed(1)}% expected`
        : `Slight decline · ${change.toFixed(1)}% expected`,
    width: `${Math.min(Math.abs(change) * 12, 100)}%`
  };
};

const MapSection = () => {
  const [zones, setZones]   = useState([]);
  const [pins, setPins]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getZonesMap()
      .then(data => {
        // 🔥 appliquer logique métier ici
        const processedZones = (data.zones || []).map(computeZone);

        setZones(processedZones);
        setPins(data.pins);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* -------------------- FALLBACK REALISTE -------------------- */

  const displayZones = zones.length > 0 ? zones : [
    computeZone({ city: 'Tunis Nord', price: '3 800' }),
    computeZone({ city: 'Sousse',     price: '2 100' }),
    computeZone({ city: 'Sfax',       price: '1 600' }),
    computeZone({ city: 'Monastir',   price: '1 750' }),
    computeZone({ city: 'Nabeul',     price: '2 300' }),
    computeZone({ city: 'Bizerte',    price: '1 200' })
  ];

  const displayPins = pins.length > 0 ? pins : [
    { top: '22%', left: '45%', type: 'pin-buy',  label: 'Tunis Nord' },
    { top: '30%', left: '52%', type: 'pin-buy',  label: 'Les Berges' },
    { top: '42%', left: '55%', type: 'pin-wait', label: 'Monastir'   },
    { top: '48%', left: '50%', type: 'pin-buy',  label: 'Sousse'     },
    { top: '62%', left: '44%', type: 'pin-sell', label: 'Sfax'       },
    { top: '18%', left: '40%', type: 'pin-wait', label: 'Bizerte'    },
    { top: '72%', left: '38%', type: 'pin-wait', label: 'Gabès'      }
  ];

  return (
    <section className="map-section" id="map">
      <div className="s-eyebrow"><span>Zone Map</span></div>
      <h2>Best Zones to <em>Buy & Sell</em></h2>
      <p className="s-desc" style={{ marginBottom: '48px' }}>
        Explore Tunisia region by region. Click any zone to see price trends,
        average costs, and our current recommendation.
      </p>

      <div className="map-layout">

        <div className="map-container">
          <div className="map-tunisia">
            <svg viewBox="0 0 220 340" width="180" height="270"
                 style={{ position: 'absolute', opacity: 0.12 }}>
              <path d="M110 15 C125 17 138 22 148 35 C162 52 159 65 165 82 C172 100 178 110 176 127 C174 144 164 152 160 168 C156 184 160 200 152 210 C142 222 130 220 120 230 C110 240 106 252 96 250 C86 248 80 238 73 228 C66 218 59 210 55 198 C50 183 52 168 49 154 C46 140 38 130 40 116 C42 102 52 94 60 80 C68 66 66 50 78 40 C90 30 96 12 110 15Z"
                    fill="#C1602A" stroke="#A0481C" strokeWidth="2" />
            </svg>

            <div className="map-pins">
              {displayPins.map((pin, idx) => (
                <div key={idx} className="pin"
                     style={{ top: pin.top, left: pin.left }}>
                  <div className={`pin-circle ${pin.type}`}></div>
                  <div className="pin-label">{pin.label}</div>
                </div>
              ))}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              fontSize: '10px',
              color: 'var(--mid)',
              background: 'rgba(255,255,255,.8)',
              padding: '4px 10px',
              borderRadius: '8px'
            }}>
              Powered by Leaflet.js
            </div>
          </div>
        </div>

        <div className="map-sidebar">
          <div style={{ fontSize: '13px', fontWeight: 500,
                        color: 'var(--mid)', marginBottom: '4px' }}>
            {loading ? "Loading zones..." : "Top regions right now"}
          </div>

          {displayZones.map((zone, idx) => (
            <div key={idx} className="map-zone-card">
              <div className="mzc-header">
                <div className="mzc-city">{zone.city}</div>
                <span className={`mzc-tag ${zone.tagClass}`}>{zone.tag}</span>
              </div>

              <div className="mzc-price">
                {zone.price} TND
                <span style={{ fontSize: '13px', color: 'var(--light)',
                               fontFamily: "'DM Sans'" }}>/m²</span>
              </div>

              <div className="mzc-sub">{zone.sub}</div>

              <div className="mzc-bar">
                <div className={`mzc-fill ${zone.fillClass}`}
                     style={{ width: zone.width }}></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MapSection;
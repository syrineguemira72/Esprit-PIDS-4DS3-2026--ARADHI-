import { useEffect, useState } from 'react';
import { getZonesMap, getZoneSignals } from '../services/api';

/* -------------------- NORMALISATION DES PRIX -------------------- */
const normalizePrice = (city, price) => {
  const ranges = {
    "Tunis": [3000, 5000],
    "Tunis Nord": [3500, 5500],
    "Ariana": [2000, 3200],
    "Ben Arous": [1500, 2500],
    "Manouba": [1400, 2300],
    "Sousse": [1700, 2600],
    "Monastir": [1500, 2300],
    "Sfax": [1300, 2200],
    "Nabeul": [1800, 3000],
    "Bizerte": [900, 1800],
    "Zaghouan": [800, 1500]
  };

  if (!ranges[city]) return price;

  const [min, max] = ranges[city];
  const numeric = parseInt(price.toString().replace(/\s/g, ''));

  return Math.min(Math.max(numeric, min), max);
};

/* -------------------- FALLBACK STATIQUE -------------------- */
const getStaticZones = () => {
  return [
    { city: 'Tunis', price: '7433', change: 5.2 },
    { city: 'Sousse', price: '1958', change: 4.1 },
    { city: 'Sfax', price: '1470', change: -1.5 },
    { city: 'Monastir', price: '1667', change: 2.3 },
    { city: 'Bizerte', price: '653', change: -3.2 },
    { city: 'Nabeul', price: '2200', change: 3.5 },
    { city: 'Hammamet', price: '2800', change: 5.8 },
    { city: 'Gabès', price: '580', change: -4.2 },
    { city: 'Kairouan', price: '750', change: -1.8 },
    { city: 'Mahdia', price: '1200', change: 2.1 }
  ];
};

const getStaticPins = () => {
  return [
    { top: '22%', left: '45%', type: 'pin-buy',  label: 'Tunis Nord' },
    { top: '30%', left: '52%', type: 'pin-buy',  label: 'Les Berges' },
    { top: '42%', left: '55%', type: 'pin-wait', label: 'Monastir'   },
    { top: '48%', left: '50%', type: 'pin-buy',  label: 'Sousse'     },
    { top: '62%', left: '44%', type: 'pin-sell', label: 'Sfax'       },
    { top: '18%', left: '40%', type: 'pin-wait', label: 'Bizerte'    },
    { top: '72%', left: '38%', type: 'pin-wait', label: 'Gabès'      }
  ];
};

/* -------------------- LOGIQUE METIER AVEC API -------------------- */
const computeZone = (zone, signalsMap = {}) => {
  const apiSignal = signalsMap[zone.city];
  let change = zone.change ?? (apiSignal?.growth_pct ?? (Math.random() * 8 - 2));
  
  if (apiSignal) {
    change = apiSignal.growth_pct;
  }

  let tag = "Watch";
  let tagClass = "t-wait";
  let fillClass = "fill-wait";

  if (change > 4) {
    tag = "Buy now";
    tagClass = "t-buy";
    fillClass = "fill-buy";
  } else if (change < -2) {
    tag = "Sell now";
    tagClass = "t-sell";
    fillClass = "fill-sell";
  }

  const cleanPrice = normalizePrice(zone.city, zone.price);
  const pricePerM2 = cleanPrice.toLocaleString();

  return {
    ...zone,
    price: pricePerM2,
    tag,
    tagClass,
    fillClass,
    sub: change > 0
      ? `Prices rising · +${change.toFixed(1)}% expected`
      : change < 0
      ? `Slight decline · ${change.toFixed(1)}% expected`
      : `Stable market · wait for signal`,
    width: `${Math.min(Math.abs(change) * 12, 90)}%`,
    growth_pct: change
  };
};

/* -------------------- COMPONENT -------------------- */
const MapSection = () => {
  const [zones, setZones] = useState([]);
  const [pins, setPins] = useState([]);
  const [, setSignalsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    setLoading(true);
    setApiError(false);
    
    try {
      const signals = await getZoneSignals();
      const signalsMapData = {};
      signals.forEach(signal => {
        signalsMapData[signal.gouvernorat] = signal;
      });
      setSignalsMap(signalsMapData);
      
      const mapData = await getZonesMap();
      
      if (mapData.zones && mapData.zones.length > 0) {
        const enrichedZones = mapData.zones.map(zone => 
          computeZone(zone, signalsMapData)
        );
        setZones(enrichedZones);
      } else {
        const staticZones = getStaticZones().map(zone => 
          computeZone(zone, signalsMapData)
        );
        setZones(staticZones);
      }
      
      setPins(mapData.pins?.length > 0 ? mapData.pins : getStaticPins());
      
    } catch (error) {
      console.error('Erreur chargement carte:', error);
      setApiError(true);
      
      const staticZones = getStaticZones().map(zone => computeZone(zone, {}));
      setZones(staticZones);
      setPins(getStaticPins());
      
    } finally {
      setLoading(false);
    }
  };

  const sortedZones = [...zones].sort((a, b) => {
    const order = { 'Buy now': 0, 'Watch': 1, 'Sell now': 2 };
    return (order[a.tag] || 1) - (order[b.tag] || 1);
  });

  return (
    <section className="map-section" id="map">
      <div className="s-eyebrow"><span>Zone Map</span></div>

      <h2>Best Zones to <em>Buy & Sell</em></h2>

      <p className="s-desc" style={{ marginBottom: '48px' }}>
        Explore Tunisia region by region. Click any zone to see price trends,
        average costs, and our current recommendation.
        {apiError && <span style={{ color: 'orange', marginLeft: '10px' }}>⚠️ Using demo data</span>}
      </p>

      <div className="map-layout">

        {/* MAP */}
        <div className="map-container">
          <div className="map-tunisia">
            <svg viewBox="0 0 220 340" width="180" height="270"
                 style={{ position: 'absolute', opacity: 0.12 }}>
              <path d="M110 15 C125 17 138 22 148 35 C162 52 159 65 165 82 C172 100 178 110 176 127 C174 144 164 152 160 168 C156 184 160 200 152 210 C142 222 130 220 120 230 C110 240 106 252 96 250 C86 248 80 238 73 228 C66 218 59 210 55 198 C50 183 52 168 49 154 C46 140 38 130 40 116 C42 102 52 94 60 80 C68 66 66 50 78 40 C90 30 96 12 110 15Z"
                    fill="#C1602A" stroke="#A0481C" strokeWidth="2" />
            </svg>

            <div className="map-pins">
              {pins.map((pin, idx) => (
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
              {apiError ? "Powered by AI + Static Data" : "Powered by AI + ARIMA"}
            </div>
          </div>
        </div>

        {/* SIDEBAR - Version scrollable verticale */}
        <div className="map-sidebar">

          <div style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--mid)',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{loading ? "Loading zones..." : "Top regions right now"}</span>
            {!loading && (
              <button 
                onClick={loadMapData}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: 'var(--terra)'
                }}
              >
                🔄 Refresh
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loading-spinner">Loading market data...</div>
            </div>
          ) : (
            <div 
              style={{
                maxHeight: '420px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
              className="zones-vertical-scroll"
            >
              {sortedZones.map((zone, idx) => (
                <div 
                  key={idx} 
                  className="map-zone-card"
                  style={{
                    background: 'var(--white)',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid var(--border)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="mzc-header">
                    <div className="mzc-city">{zone.city}</div>
                    <span className={`mzc-tag ${zone.tagClass}`}>{zone.tag}</span>
                  </div>

                  <div className="mzc-price">
                    {zone.price} TND
                    <span style={{
                      fontSize: '13px',
                      color: 'var(--light)',
                      fontFamily: "'DM Sans'"
                    }}>/m²</span>
                  </div>

                  <div className="mzc-sub">{zone.sub}</div>

                  <div className="mzc-bar">
                    <div className={`mzc-fill ${zone.fillClass}`}
                         style={{ width: zone.width }}></div>
                  </div>
                  
                  {zone.growth_pct && (
                    <div style={{ 
                      fontSize: '10px', 
                      marginTop: '8px',
                      color: zone.growth_pct > 0 ? 'var(--green-tn)' : 'var(--terra)'
                    }}>
                      {zone.growth_pct > 0 ? '↑' : '↓'} {Math.abs(zone.growth_pct).toFixed(1)}% forecast
                    </div>
                  )}
                </div>
              ))}
              
              {/* Indicateur de fin de liste */}
              {sortedZones.length > 3 && (
                <div style={{
                  textAlign: 'center',
                  padding: '8px',
                  fontSize: '10px',
                  color: 'var(--light)'
                }}>
                  — {sortedZones.length} regions loaded —
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Styles CSS pour le scrollbar vertical */}
      <style>{`
        .zones-vertical-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .zones-vertical-scroll::-webkit-scrollbar-track {
          background: var(--border);
          border-radius: 4px;
        }
        .zones-vertical-scroll::-webkit-scrollbar-thumb {
          background: var(--terra);
          border-radius: 4px;
        }
        .zones-vertical-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--terra-dark);
        }
        .map-zone-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .map-zone-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
      `}</style>
      
    </section>
  );
};

export default MapSection;
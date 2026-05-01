import { useState } from 'react';
import { estimatePrice } from '../services/api';

const TYPE_MAP = {
  'Apartment':       'Appartement',
  'House / Villa':   'Maison / Villa',
  'Land':            'Terrain',
  'Commercial space':'Local commercial',
};

const EstimatorSection = () => {
  const [formData, setFormData] = useState({
    region: 'Tunis', type: 'Apartment',
    surface: '', rooms: '', salle_de_bain: '1',
    parking: false, climatisation: false,
    cuisine: true, terrasse: false,
    piscine: false, ascenseur: false,
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!formData.surface || !formData.rooms) {
      setError("Surface et nombre de pièces sont requis.");
      return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await estimatePrice({
        gouvernorat:   formData.region,
        type_bien:     TYPE_MAP[formData.type] || 'Appartement',
        surface:       parseFloat(formData.surface),
        rooms:         parseInt(formData.rooms),
        salle_de_bain: parseInt(formData.salle_de_bain),
        parking:       formData.parking       ? 1 : 0,
        climatisation: formData.climatisation ? 1 : 0,
        cuisine:       formData.cuisine       ? 1 : 0,
        terrasse:      formData.terrasse      ? 1 : 0,
        piscine:       formData.piscine       ? 1 : 0,
        ascenseur:     formData.ascenseur     ? 1 : 0,
      });
      setResult(data);
    } catch (e) {
      setError("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => n?.toLocaleString('fr-TN') ?? '—';

  return (
    <section className="est-section" id="estimator">
      <div className="s-eyebrow"><span>Price Estimator</span></div>
      <h2>What Is Your<br />Property <em>Worth?</em></h2>
      <p className="s-desc">Enter your property details and get an instant AI-powered price estimate — no agent, no waiting.</p>
      <div className="est-inner">

        {/* ── FORM ── */}
        <div className="est-form">
          <h3>Tell us about your property</h3>

          <div className="form-group">
            <label className="form-label">Region</label>
            <select name="region" className="form-select" value={formData.region} onChange={handleChange}>
              {['Tunis','Ariana','Ben Arous','Manouba','Nabeul','Bizerte',
                'Sousse','Monastir','Sfax','Zaghouan','Mahdia','Kairouan',
                'Gabes','Gafsa','Medenine'].map(g =>
                <option key={g}>{g}</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Property type</label>
            <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
              <option>Apartment</option>
              <option>House / Villa</option>
              <option>Land</option>
              <option>Commercial space</option>
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Surface (m²)</label>
              <input type="number" name="surface" className="form-input"
                     placeholder="e.g. 120" value={formData.surface} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Rooms</label>
              <input type="number" name="rooms" className="form-input"
                     placeholder="e.g. 4" value={formData.rooms} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Bathrooms</label>
              <input type="number" name="salle_de_bain" className="form-input"
                     placeholder="e.g. 2" value={formData.salle_de_bain} onChange={handleChange} />
            </div>
          </div>

          {/* Équipements */}
          <div className="form-group">
            <label className="form-label">Amenities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
              {[
                { name: 'parking',       label: '🅿️ Parking'   },
                { name: 'climatisation', label: '❄️ A/C'        },
                { name: 'cuisine',       label: '🍳 Kitchen'    },
                { name: 'terrasse',      label: '🏖️ Terrace'    },
                { name: 'piscine',       label: '🏊 Pool'       },
                { name: 'ascenseur',     label: '🛗 Elevator'   },
              ].map(item => (
                <label key={item.name} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', cursor: 'pointer',
                  padding: '6px 12px', borderRadius: '8px',
                  border: `1px solid ${formData[item.name] ? 'var(--accent)' : 'rgba(0,0,0,.1)'}`,
                  background: formData[item.name] ? 'rgba(193,96,42,.08)' : 'transparent',
                  transition: 'all .2s'
                }}>
                  <input type="checkbox" name={item.name}
                         checked={formData[item.name]} onChange={handleChange}
                         style={{ accentColor: 'var(--accent)' }} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ color: '#E63946', fontSize: '13px', marginBottom: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          <button className="est-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Calculating…' : 'Get Estimate →'}
          </button>
        </div>

        {/* ── RESULT ── */}
        <div className="est-result">
          {loading && (
            <div className="result-card" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '14px', color: 'rgba(250,247,242,.5)' }}>
                🤖 XGBoost is calculating…
              </div>
            </div>
          )}

          {result && !loading && (
            <>
              <div className="result-card">
                <h4>Estimated market value</h4>
                <div className="result-price">{fmt(result.price)} TND</div>
                <div className="result-range">
                  Range: {fmt(result.price_low)} – {fmt(result.price_high)} TND
                </div>
                <div className="confidence-row">
                  <div className="conf-bar">
                    <div className="conf-fill" style={{ width: `${result.confidence}%` }} />
                  </div>
                  <div className="conf-pct">{result.confidence}% confident</div>
                </div>
              </div>

              {result.signal && (
                <div className="result-signal">
                  <div className="rs-icon">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v8M4 6l4 6 4-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="rs-text">{result.signal}</div>
                </div>
              )}

              <div className="result-card">
                <h4>Price per m²</h4>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--gold2)' }}>
                  {fmt(result.price_m2)} TND
                </div>
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="result-card" style={{ opacity: 0.4, textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏠</div>
              <div style={{ fontSize: '14px' }}>Fill the form to get your estimate</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EstimatorSection;
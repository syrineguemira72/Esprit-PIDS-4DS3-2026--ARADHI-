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
      console.error(e);
      setError("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => n?.toLocaleString('fr-TN') ?? '—';

  // Styles inline pour éviter les problèmes de CSS manquant
  const styles = {
    section: {
      padding: '80px 24px',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      color: '#faf7f2',
    },
    eyebrow: {
      textAlign: 'center',
      marginBottom: '16px',
    },
    eyebrowSpan: {
      background: 'rgba(193, 96, 42, 0.15)',
      padding: '6px 14px',
      borderRadius: '40px',
      fontSize: '12px',
      letterSpacing: '2px',
      fontWeight: '500',
      color: '#c1602a',
    },
    h2: {
      textAlign: 'center',
      fontSize: '48px',
      fontFamily: "'Cormorant Garamond', serif",
      marginBottom: '16px',
    },
    em: {
      color: '#c1602a',
      fontStyle: 'normal',
    },
    desc: {
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto 48px',
      color: 'rgba(250, 247, 242, 0.7)',
      fontSize: '16px',
    },
    inner: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '48px',
    },
    form: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    formH3: {
      fontSize: '24px',
      marginBottom: '24px',
      fontFamily: "'Cormorant Garamond', serif",
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '13px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: 'rgba(250, 247, 242, 0.6)',
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#faf7f2',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#faf7f2',
      fontSize: '14px',
    },
    row2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: '#c1602a',
      border: 'none',
      borderRadius: '12px',
      color: '#faf7f2',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '8px',
    },
    result: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    resultCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '24px',
      padding: '28px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    resultCardCentered: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '24px',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
    },
    resultH4: {
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: 'rgba(250, 247, 242, 0.5)',
      marginBottom: '12px',
    },
    resultPrice: {
      fontSize: '48px',
      fontWeight: '700',
      fontFamily: "'Cormorant Garamond', serif",
      color: '#c1602a',
      marginBottom: '8px',
    },
    resultRange: {
      fontSize: '14px',
      color: 'rgba(250, 247, 242, 0.6)',
    },
    confidenceRow: {
      marginTop: '20px',
    },
    confBar: {
      height: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    confFill: {
      height: '100%',
      background: '#c1602a',
      borderRadius: '4px',
      transition: 'width 0.3s',
    },
    confPct: {
      fontSize: '12px',
      color: 'rgba(250, 247, 242, 0.5)',
    },
    signal: {
      background: 'rgba(193, 96, 42, 0.1)',
      border: '1px solid rgba(193, 96, 42, 0.3)',
      borderRadius: '16px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    signalText: {
      fontSize: '14px',
      color: '#c1602a',
    },
    errorText: {
      color: '#E63946',
      fontSize: '13px',
      marginBottom: '8px',
    },
    amenitiesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '8px',
    },
    amenityLabel: (isChecked) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      cursor: 'pointer',
      padding: '6px 12px',
      borderRadius: '8px',
      border: `1px solid ${isChecked ? '#c1602a' : 'rgba(255,255,255,0.2)'}`,
      background: isChecked ? 'rgba(193,96,42,.08)' : 'transparent',
      transition: 'all .2s'
    }),
  };

  return (
    <section style={styles.section} id="estimator">
      <div style={styles.eyebrow}>
        <span style={styles.eyebrowSpan}>Price Estimator</span>
      </div>
      <h2 style={styles.h2}>
        What Is Your<br />Property <em style={styles.em}>Worth?</em>
      </h2>
      <p style={styles.desc}>
        Enter your property details and get an instant AI-powered price estimate — no agent, no waiting.
      </p>
      <div style={styles.inner}>

        {/* FORM */}
        <div style={styles.form}>
          <h3 style={styles.formH3}>Tell us about your property</h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Region</label>
            <select name="region" style={styles.select} value={formData.region} onChange={handleChange}>
              {['Tunis','Ariana','Ben Arous','Manouba','Nabeul','Bizerte',
                'Sousse','Monastir','Sfax','Zaghouan','Mahdia','Kairouan',
                'Gabes','Gafsa','Medenine'].map(g =>
                <option key={g}>{g}</option>
              )}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Property type</label>
            <select name="type" style={styles.select} value={formData.type} onChange={handleChange}>
              <option>Apartment</option>
              <option>House / Villa</option>
              <option>Land</option>
              <option>Commercial space</option>
            </select>
          </div>

          <div style={styles.row2}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Surface (m²)</label>
              <input
                type="number"
                name="surface"
                style={styles.input}
                placeholder="e.g. 120"
                value={formData.surface}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Rooms</label>
              <input
                type="number"
                name="rooms"
                style={styles.input}
                placeholder="e.g. 4"
                value={formData.rooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.row2}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Bathrooms</label>
              <input
                type="number"
                name="salle_de_bain"
                style={styles.input}
                placeholder="e.g. 2"
                value={formData.salle_de_bain}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Amenities */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Amenities</label>
            <div style={styles.amenitiesContainer}>
              {[
                { name: 'parking', label: '🅿️ Parking' },
                { name: 'climatisation', label: '❄️ A/C' },
                { name: 'cuisine', label: '🍳 Kitchen' },
                { name: 'terrasse', label: '🏖️ Terrace' },
                { name: 'piscine', label: '🏊 Pool' },
                { name: 'ascenseur', label: '🛗 Elevator' },
              ].map(item => (
                <label key={item.name} style={styles.amenityLabel(formData[item.name])}>
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={formData[item.name]}
                    onChange={handleChange}
                    style={{ accentColor: '#c1602a' }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div style={styles.errorText}>
              ⚠️ {error}
            </div>
          )}

          <button style={styles.button} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Calculating…' : 'Get Estimate →'}
          </button>
        </div>

        {/* RESULT */}
        <div style={styles.result}>
          {loading && (
            <div style={styles.resultCardCentered}>
              <div style={{ fontSize: '14px', color: 'rgba(250,247,242,.5)' }}>
                🤖 XGBoost is calculating…
              </div>
            </div>
          )}

          {result && !loading && (
            <>
              <div style={styles.resultCard}>
                <h4 style={styles.resultH4}>Estimated market value</h4>
                <div style={styles.resultPrice}>{fmt(result.price)} TND</div>
                <div style={styles.resultRange}>
                  Range: {fmt(result.price_low)} – {fmt(result.price_high)} TND
                </div>
                <div style={styles.confidenceRow}>
                  <div style={styles.confBar}>
                    <div style={{ ...styles.confFill, width: `${result.confidence}%` }} />
                  </div>
                  <div style={styles.confPct}>{result.confidence}% confident</div>
                </div>
              </div>

              {result.signal && (
                <div style={styles.signal}>
                  <div className="rs-icon">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v8M4 6l4 6 4-6" stroke="#c1602a" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={styles.signalText}>{result.signal}</div>
                </div>
              )}

              <div style={styles.resultCard}>
                <h4 style={styles.resultH4}>Price per m²</h4>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#c1602a' }}>
                  {fmt(result.price_m2)} TND
                </div>
              </div>
            </>
          )}

          {!result && !loading && (
            <div style={styles.resultCardCentered}>
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
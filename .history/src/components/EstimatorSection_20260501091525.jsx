import { useState } from 'react';

const EstimatorSection = () => {
  const [formData, setFormData] = useState({
    region: 'Tunis',
    type: 'Apartment',
    surface: '',
    rooms: '',
    floor: '',
    year: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="est-section" id="estimator">
      <div className="s-eyebrow"><span>Price Estimator</span></div>
      <h2>What Is Your<br />Property <em>Worth?</em></h2>
      <p className="s-desc">Enter your property details and get an instant AI-powered price estimate — no agent, no waiting.</p>
      <div className="est-inner">
        <div className="est-form">
          <h3>Tell us about your property</h3>
          <div className="form-group">
            <label className="form-label">Region</label>
            <select name="region" className="form-select" value={formData.region} onChange={handleChange}>
              <option>Tunis</option><option>Sfax</option><option>Sousse</option><option>Monastir</option><option>Bizerte</option><option>Gabès</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Property type</label>
            <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
              <option>Apartment</option><option>House / Villa</option><option>Land</option><option>Commercial space</option>
            </select>
          </div>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">Surface (m²)</label><input type="number" name="surface" className="form-input" placeholder="e.g. 120" value={formData.surface} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Rooms</label><input type="number" name="rooms" className="form-input" placeholder="e.g. 4" value={formData.rooms} onChange={handleChange} /></div>
          </div>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">Floor</label><input type="number" name="floor" className="form-input" placeholder="e.g. 2" value={formData.floor} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Year built</label><input type="number" name="year" className="form-input" placeholder="e.g. 2010" value={formData.year} onChange={handleChange} /></div>
          </div>
          <button className="est-btn">Get Estimate →</button>
        </div>
        <div className="est-result">
          <div className="result-card">
            <h4>Estimated market value</h4>
            <div className="result-price">320 000 TND</div>
            <div className="result-range">Range: 295 000 – 345 000 TND</div>
            <div className="confidence-row"><div className="conf-bar"><div className="conf-fill" style={{ width: '82%' }}></div></div><div className="conf-pct">82% confident</div></div>
          </div>
          <div className="result-signal">
            <div className="rs-icon"><svg viewBox="0 0 16 16" fill="none"><path d="M8 2v8M4 6l4 6 4-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg></div>
            <div className="rs-text"><strong>Great time to sell in this area</strong>Prices in Tunis are trending up — listing now could maximize your return.</div>
          </div>
          <div className="result-card">
            <h4>Price per m²</h4>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: 'var(--gold2)' }}>2 666 TND</div>
            <div style={{ fontSize: '12px', color: 'rgba(250,247,242,.4)', marginTop: '4px' }}>vs. area avg: 2 450 TND/m²  (+8.8%)</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstimatorSection;
import { useState, useEffect } from 'react';
import { estimatePrice, getGouvernorats } from '../services/api';

const EstimatorSection = () => {
  const [formData, setFormData] = useState({
    gouvernorat: 'Tunis',
    type_bien: 'Appartement',
    surface: 100,
    rooms: 3,
    salle_de_bain: 2,
    parking: false,
    climatisation: false,
    cuisine: false,
    terrasse: false,
    piscine: false,
    ascenseur: false,
    prix_demande: '',
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gouvernorats, setGouvernorats] = useState([]);

  useEffect(() => {
    loadGouvernorats();
  }, []);

  const loadGouvernorats = async () => {
    try {
      const list = await getGouvernorats();
      setGouvernorats(list);
    } catch (error) {
      console.error('Erreur chargement gouvernorats:', error);
      setGouvernorats(['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte']);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const estimation = await estimatePrice(formData);
      setResult(estimation);
    } catch (error) {
      console.error('Erreur estimation:', error);
      alert('Erreur lors de l\'estimation. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      gouvernorat: 'Tunis',
      type_bien: 'Appartement',
      surface: 100,
      rooms: 3,
      salle_de_bain: 2,
      parking: false,
      climatisation: false,
      cuisine: false,
      terrasse: false,
      piscine: false,
      ascenseur: false,
      prix_demande: '',
    });
    setResult(null);
  };

  // Déterminer la classe CSS pour le résultat
  const getResultClass = () => {
    if (!result) return '';
    if (result.ratio_class === 'good') return 're-good';
    if (result.ratio_class === 'high') return 're-high';
    return 're-fair';
  };

  return (
    <section className="est-section" id="estimator">
      <div className="s-eyebrow">
        <span>Price Estimator</span>
      </div>
      <h2>What Is Your<br />Property <em>Worth?</em></h2>
      <p className="s-desc">
        Enter your property details and get an instant AI-powered price estimate — no agent, no waiting.
      </p>
      
      <div className="est-inner">
        {/* Formulaire */}
        <div className="est-form">
          <h3>Tell us about your property</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Region</label>
              <select 
                name="gouvernorat" 
                className="form-select"
                value={formData.gouvernorat}
                onChange={handleChange}
                required
              >
                {gouvernorats.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Property type</label>
              <select 
                name="type_bien" 
                className="form-select"
                value={formData.type_bien}
                onChange={handleChange}
                required
              >
                <option value="Appartement">Apartment</option>
                <option value="Maison">House</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Surface (m²)</label>
                <input
                  type="number"
                  name="surface"
                  className="form-input"
                  value={formData.surface}
                  onChange={handleChange}
                  min="20"
                  max="1000"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rooms</label>
                <input
                  type="number"
                  name="rooms"
                  className="form-input"
                  value={formData.rooms}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bathrooms</label>
              <input
                type="number"
                name="salle_de_bain"
                className="form-input"
                value={formData.salle_de_bain}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.5"
                required
              />
            </div>

            <div className="equipements">
              <label className="checkbox-label">
                <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} />
                🅿️ Parking
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="climatisation" checked={formData.climatisation} onChange={handleChange} />
                ❄️ Air conditioning
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="cuisine" checked={formData.cuisine} onChange={handleChange} />
                🍳 Equipped kitchen
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="terrasse" checked={formData.terrasse} onChange={handleChange} />
                🏖️ Terrace
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="piscine" checked={formData.piscine} onChange={handleChange} />
                🏊 Pool
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="ascenseur" checked={formData.ascenseur} onChange={handleChange} />
                🛗 Elevator
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Asking price (optional)</label>
              <input
                type="number"
                name="prix_demande"
                className="form-input"
                value={formData.prix_demande}
                onChange={handleChange}
                placeholder="e.g., 250000"
                min="0"
              />
            </div>

            <button type="submit" className="est-btn" disabled={loading}>
              {loading ? 'Estimating...' : 'Get Estimate →'}
            </button>
            
            {result && (
              <button type="button" className="reset-btn" onClick={resetForm}>
                New Estimate
              </button>
            )}
          </form>
        </div>

        {/* Résultats */}
        <div className="est-result">
          {result && (
            <>
              <div className="result-card">
                <h4>Estimated market value</h4>
                <div className="result-price">
                  {result.price.toLocaleString()} <span>TND</span>
                </div>
                <div className="result-range">
                  Range: {result.price_low.toLocaleString()} – {result.price_high.toLocaleString()} TND
                </div>
                <div className="price-m2">
                  {result.price_m2.toLocaleString()} TND/m²
                </div>
                <div className="confidence-row">
                  <div className="conf-bar">
                    <div className="conf-fill" style={{ width: `${result.confidence}%` }}></div>
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

              {result.interpretation && (
                <div className={`result-card ${getResultClass()}`}>
                  <h4>Price Analysis</h4>
                  <div className="interpretation-badge">{result.interpretation}</div>
                  <p className="recommendation">{result.recommandation}</p>
                  {result.prix_demande && (
                    <div className="ratio-info">
                      Ratio: {(result.prix_demande / result.price).toFixed(2)}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .equipements {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin: 20px 0;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--cream);
          cursor: pointer;
        }
        
        .reset-btn {
          margin-top: 12px;
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          color: var(--cream);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .reset-btn:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .price-m2 {
          font-size: 13px;
          color: rgba(250,247,242,0.5);
          margin-top: 8px;
        }
        
        .interpretation-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .recommendation {
          font-size: 14px;
          line-height: 1.5;
          margin: 10px 0;
        }
        
        .ratio-info {
          font-size: 12px;
          color: rgba(250,247,242,0.5);
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .re-good {
          background: rgba(34,139,92,0.1);
          border-color: rgba(34,139,92,0.3);
        }
        
        .re-good .interpretation-badge {
          background: rgba(34,139,92,0.2);
          color: #4CAF50;
        }
        
        .re-high {
          background: rgba(193,96,42,0.1);
          border-color: rgba(193,96,42,0.3);
        }
        
        .re-high .interpretation-badge {
          background: rgba(193,96,42,0.2);
          color: var(--terra);
        }
        
        .re-fair {
          background: rgba(212,168,83,0.1);
          border-color: rgba(212,168,83,0.3);
        }
        
        .re-fair .interpretation-badge {
          background: rgba(212,168,83,0.2);
          color: var(--gold);
        }
      `}</style>
    </section>
  );
};

export default EstimatorSection;
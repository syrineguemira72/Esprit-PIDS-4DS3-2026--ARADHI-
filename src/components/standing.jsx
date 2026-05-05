import { useState } from 'react';

const Standing = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const analyzeStanding = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', image);
      const response = await fetch('http://localhost:8000/standing', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const defaultChips = [
    { label: 'Luxury', color: 'var(--gold2)' },
    { label: 'Normal', color: 'var(--green-tn)' },
    { label: 'Old', color: '#6c757d' },
  ];

  const defaultFeatures = [
    { icon: '✨', label: 'Standing', value: '—' },
    { icon: '🎯', label: 'Confidence', value: '—' },
  ];

  const chips    = result?.chips    ?? defaultChips;
  const features = result?.features ?? defaultFeatures;

  return (
    <section className="img-section" id="standing">
      <div className="img-inner">

        {/* LEFT SIDE */}
        <div>
          <div className="s-eyebrow"><span>Standing Detection</span></div>
          <h2>Analyze the <em>Standing</em><br />of your Property</h2>
          <p className="s-desc" style={{ marginBottom: '32px' }}>
            Our AI model "standing.keras" evaluates the interior and exterior quality of your property automatically to determine its standing level.
          </p>
          <div className="benefit-list">
            <div className="benefit-item">
              <div className="b-icon" style={{ background: 'var(--gold2)' }}>
                <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="11" rx="2" stroke="#fff" strokeWidth="1.5" /><circle cx="9" cy="9.5" r="2.5" stroke="#fff" strokeWidth="1.5" /><path d="M6 4l1.5-2h3L12 4" stroke="#fff" strokeWidth="1.5" /></svg>
              </div>
              <div className="b-text">
                <h4>Instant Standing Detection</h4>
                <p>Upload a photo and instantly know if your property is  High Standing, Standard.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="b-icon" style={{ background: 'var(--gold2)' }}>
                <svg viewBox="0 0 18 18" fill="none"><path d="M4 9l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <div className="b-text">
                <h4>High Precision Model</h4>
                <p>Powered by our advanced standing.keras model for maximum precision.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="img-demo">

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <label style={{
              padding: '10px 16px', background: 'var(--gold2)', borderRadius: '10px',
              fontSize: '13px', cursor: 'pointer', color: '#fff', fontWeight: '600',
              position: 'relative', zIndex: 999
            }}>
              📁 Choose Photo
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
            <button
              onClick={analyzeStanding}
              disabled={!image || loading}
              style={{
                padding: '10px 16px',
                background: image ? 'var(--gold2)' : 'rgba(255,255,255,0.1)',
                borderRadius: '10px', fontSize: '13px',
                cursor: image ? 'pointer' : 'not-allowed',
                color: '#fff', fontWeight: '600', border: 'none',
                position: 'relative', zIndex: 999
              }}
            >
              {loading ? '🔍 Analyzing...' : '🚀 Detect Standing'}
            </button>
          </div>

          <div className="img-preview">
            {preview ? (
              <img
                src={preview}
                alt="property"
                style={{ width: '100%', borderRadius: '12px', maxHeight: '200px', objectFit: 'cover' }}
              />
            ) : (
              <svg className="img-preview-icon" viewBox="0 0 120 120" fill="none" width="80" height="80">
                <rect x="10" y="30" width="100" height="75" rx="6" fill="rgba(255,255,255,.5)" />
                <path d="M60 15 L100 35 L20 35 Z" fill="rgba(255,255,255,.4)" />
                <rect x="25" y="55" width="30" height="50" fill="rgba(255,255,255,.6)" />
                <rect x="65" y="55" width="30" height="50" fill="rgba(255,255,255,.6)" />
                <rect x="35" y="65" width="12" height="18" fill="rgba(255,255,255,.8)" />
              </svg>
            )}

            <div className="img-analyzed">
              {chips.map((chip, i) => (
                <div className="img-chip" key={i}>
                  <div className="ic-dot" style={chip.color ? { background: chip.color } : {}}></div>
                  {chip.label}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ color: '#E63946', fontSize: '13px', marginTop: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
              🤖 Model is detecting standing…
            </div>
          )}

          <div className="img-feats-grid">
            {features.map((feat, i) => (
              <div className="img-feat-item" key={i}>
                <div className="if-icon">{feat.icon}</div>
                <div className="if-label">{feat.label}</div>
                <div className="if-value">{feat.value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Standing;
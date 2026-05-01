const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-bg"></div>
      <div className="hero-pattern"></div>
      <div className="hero-content">
        <div className="hero-eyebrow">
          <div className="eyebrow-line"></div>
          <div className="eyebrow-text">Tunisia's Smart Property Platform</div>
        </div>
        <h1>Find Your<br />Perfect Home<br />in <em>Tunisia</em></h1>
        <p className="hero-desc">We use AI to tell you when to buy, where to buy, and whether a price is fair — so you can move with confidence.</p>
        <div className="hero-actions">
          <a href="#listings" className="btn-primary">Explore Listings</a>
          <a href="#estimator" className="btn-ghost">Estimate My Property</a>
        </div>
        <div className="hero-trust">
          <div><div className="trust-n">4 200+</div><div className="trust-l">Properties listed</div></div>
          <div><div className="trust-n">24</div><div className="trust-l">Regions covered</div></div>
          <div><div className="trust-n">98%</div><div className="trust-l">Happy users</div></div>
        </div>
      </div>
      <div className="hero-img-block">
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} viewBox="0 0 400 480" fill="none">
          <rect x="60" y="80" width="280" height="240" rx="8" fill="#C1602A" />
          <rect x="40" y="60" width="320" height="20" rx="4" fill="#A0481C" />
          <rect x="100" y="140" width="80" height="100" rx="4" fill="#FAF7F2" />
          <rect x="220" y="140" width="80" height="100" rx="4" fill="#FAF7F2" />
          <rect x="150" y="260" width="100" height="60" rx="4" fill="#FAF7F2" />
          <path d="M200 30 L360 80 L40 80 Z" fill="#8b6542" />
        </svg>
        <div className="hero-img-overlay">
          <div className="hero-img-price">285 000 TND</div>
          <div className="hero-img-loc">📍 Les Berges du Lac, Tunis</div>
          <div className="hero-img-tag">✓ Great price for this area</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
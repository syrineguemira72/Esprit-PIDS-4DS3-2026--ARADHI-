import heroImg from '../assets/111.jpg';

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
        <p className="hero-desc">
          We use AI to tell you when to buy, where to buy, and whether a price is fair — so you can move with confidence.
        </p>
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
        <img
          src={heroImg}
          alt="Propriété en Tunisie"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '16px',
          }}
        />
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

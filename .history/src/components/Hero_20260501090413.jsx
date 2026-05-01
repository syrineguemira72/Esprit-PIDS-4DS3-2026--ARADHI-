// src/components/Hero.jsx
export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>
          Find Your Perfect Home in <em>Tunisia</em>
        </h1>

        <p className="hero-desc">
          We use AI to tell you when to buy and where.
        </p>

        <div className="hero-actions">
          <a href="#listings" className="btn-primary">Explore</a>
          <a href="#estimator" className="btn-ghost">Estimate</a>
        </div>
      </div>
    </div>
  );
}
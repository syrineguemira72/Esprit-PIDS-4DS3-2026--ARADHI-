// src/components/Navbar.jsx
export default function Navbar() {
  return (
    <nav>
      <a href="#" className="nav-logo">
        <div className="flag-strip">
          <div className="f1"></div>
          <div className="f2"></div>
          <div className="f3"></div>
        </div>
        <div className="logo-word">Immo<span>TN</span></div>
      </a>

      <div className="nav-links">
        <a href="#listings" className="nav-a">Listings</a>
        <a href="#timing" className="nav-a">Best Time</a>
        <a href="#map" className="nav-a">Zone Map</a>
      </div>

      <button className="nav-cta">Get Started</button>
    </nav>
  );
}
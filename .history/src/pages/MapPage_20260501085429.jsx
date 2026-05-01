// src/pages/MapPage.jsx
import { useEffect } from "react";

export default function MapPage() {
  useEffect(() => {
    // futur: init leaflet map
  }, []);

  return (
    <section className="map-section">
      <h2>Zone Map</h2>

      <div className="map-container">
        <p>🗺 Carte interactive (Leaflet ici)</p>
      </div>

      <div className="map-sidebar">
        <div>Tunis Nord — Buy</div>
        <div>Sfax — Sell</div>
        <div>Monastir — Wait</div>
      </div>
    </section>
  );
}
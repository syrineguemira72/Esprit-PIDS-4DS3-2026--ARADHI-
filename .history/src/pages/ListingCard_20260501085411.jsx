// src/pages/ListingsPage.jsx
import { useState, useEffect } from "react";
import { getListings } from "../services/api";

export default function ListingsPage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getListings().then(setListings);
  }, []);

  return (
    <section className="listings-section">
      <h2>Latest Listings</h2>

      <div className="listings-grid">
        {listings.map((item) => (
          <div className="listing-card" key={item.id}>
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.location}</p>
              <div className="card-price">{item.price} TND</div>

              <div className={`ratio-badge ratio-${item.price_ratio}`}>
                {item.price_ratio === "good"
                  ? "✓ Fair"
                  : item.price_ratio === "fair"
                  ? "~ OK"
                  : "↑ High"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
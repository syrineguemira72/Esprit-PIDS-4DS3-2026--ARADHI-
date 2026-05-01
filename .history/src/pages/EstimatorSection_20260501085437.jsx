// src/pages/EstimatorPage.jsx
import { useState } from "react";
import { estimatePrice } from "../services/api";

export default function EstimatorPage() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const res = await estimatePrice(form);
    setResult(res);
  };

  return (
    <section className="est-section">
      <h2>Estimate your property</h2>

      <input
        placeholder="Surface"
        onChange={(e) => setForm({ ...form, surface: e.target.value })}
      />

      <input
        placeholder="Rooms"
        onChange={(e) => setForm({ ...form, rooms: e.target.value })}
      />

      <button onClick={handleSubmit}>Estimate</button>

      {result && (
        <div className="result-card">
          <h3>{result.price} TND</h3>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </section>
  );
}
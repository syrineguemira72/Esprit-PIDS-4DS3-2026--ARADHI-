import { useState } from "react";

export default function PricePrediction() {
  const [price, setPrice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrice("120,000 TND"); // remplacer par API ML
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">Price Prediction</h1>

      <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-xl">
        <input placeholder="Surface (m²)" className="p-2 w-full mb-3 bg-white/20 rounded" />
        <input placeholder="Rooms" className="p-2 w-full mb-3 bg-white/20 rounded" />

        <button className="bg-indigo-500 px-4 py-2 rounded">
          Predict
        </button>
      </form>

      {price && (
        <div className="mt-4 text-xl text-green-400">
          Estimated Price: {price}
        </div>
      )}
    </div>
  );
}
// src/pages/PhotoAnalysisPage.jsx
import { useState } from "react";
import { analyzePhoto } from "../services/api";

export default function PhotoAnalysisPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const res = await analyzePhoto(file);
    setResult(res);
  };

  return (
    <section className="img-section">
      <h2>Photo Analysis</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Analyze</button>

      {result && (
        <div>
          <p>Bedrooms: {result.rooms}</p>
          <p>Garden: {result.garden ? "Yes" : "No"}</p>
        </div>
      )}
    </section>
  );
}
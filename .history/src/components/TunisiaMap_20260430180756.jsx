import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { useState } from "react";

const geoUrl = "/tunisia.json";

// simulation backend
const marketData = {
  Tunis: 0.8,
  Ariana: -0.6,
  Sousse: 0.2,
  Sfax: 0.7,
  Gabes: -0.3,
};

const getColor = (value) => {
  if (value > 0.5) return "#16a34a";     // strong buy
  if (value > 0) return "#4ade80";       // buy
  if (value === 0) return "#facc15";     // neutral
  if (value > -0.5) return "#f97316";    // sell
  return "#dc2626";                      // strong sell
};

export default function TunisiaMap() {
  const [tooltip, setTooltip] = useState("");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-lg font-semibold mb-4">
        Tunisia Market Overview
      </h2>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2500,
          center: [9.5, 34],
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name =
                geo.properties.name ||
                geo.properties.nom;

              const value = marketData[name] ?? 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(value)}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  onMouseEnter={() => {
                    setTooltip(`${name} (${value})`);
                  }}
                  onMouseLeave={() => setTooltip("")}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: "#2563eb",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          {tooltip}
        </div>
      )}

    </div>
  );
}
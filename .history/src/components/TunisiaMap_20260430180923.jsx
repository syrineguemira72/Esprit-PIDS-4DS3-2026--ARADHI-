import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { useState } from "react";

const geoUrl = "/tunisia.json";

const marketData = {
  Tunis: 0.8,
  Ariana: -0.6,
  Sousse: 0.2,
  Sfax: 0.7,
  Gabes: -0.3,
};

const getColor = (value) => {
  if (value > 0.5) return "#16a34a";
  if (value > 0) return "#4ade80";
  if (value === 0) return "#facc15";
  if (value > -0.5) return "#f97316";
  return "#dc2626";
};

export default function TunisiaMap() {
  const [tooltip, setTooltip] = useState("");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h3 className="text-sm font-semibold mb-4 text-gray-600">
        Tunisia Market Map
      </h3>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2500,
          center: [9.5, 34],
        }}
        className="w-full h-[400px]"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name;
              const value = marketData[name] ?? 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(value)}
                  stroke="#fff"
                  strokeWidth={0.5}
                  onMouseEnter={() =>
                    setTooltip(`${name}`)
                  }
                  onMouseLeave={() =>
                    setTooltip("")
                  }
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
        <div className="text-center mt-3 text-sm text-gray-600">
          {tooltip}
        </div>
      )}

    </div>
  );
}
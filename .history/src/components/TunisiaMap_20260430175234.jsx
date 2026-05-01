import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const geoUrl = "/tunisia.json";

// 🎯 Données simples (issues de ton modèle)
const marketData = {
  Tunis: "buy",
  Ariana: "sell",
  Sousse: "stable",
  Sfax: "buy",
  Nabeul: "sell",
};

// 🎨 Couleurs UX
const getColor = (status) => {
  switch (status) {
    case "buy":
      return "#22c55e"; // green
    case "sell":
      return "#ef4444"; // red
    case "stable":
      return "#facc15"; // yellow
    default:
      return "#e5e7eb"; // gray
  }
};

export default function TunisiaMap() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">

      <h3 className="text-sm font-semibold text-gray-600 mb-4">
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
              const status = marketData[name];

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(status)}
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: "#3b82f6",
                      outline: "none",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* LEGEND */}
      <div className="flex gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          Buy Opportunity
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          Sell Opportunity
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          Stable Market
        </div>
      </div>

    </div>
  );
}
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useState } from "react";

// 🔥 GeoJSON SIMPLIFIÉ (extrait réel + extensible)
const tunisiaGeo = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Tunis" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[10.1,36.7],[10.3,36.7],[10.3,36.9],[10.1,36.9],[10.1,36.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Sfax" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[10.6,34.6],[11.1,34.6],[11.1,35.0],[10.6,35.0],[10.6,34.6]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Sousse" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[10.5,35.8],[10.9,35.8],[10.9,36.1],[10.5,36.1],[10.5,35.8]]]
      }
    }
  ]
};

// 📊 Simulation backend
const marketData = {
  Tunis: 0.8,
  Sfax: -0.4,
  Sousse: 0.2
};

// 🎨 Couleurs PRO
const getColor = (value) => {
  if (value > 0.5) return "#16a34a";
  if (value > 0) return "#4ade80";
  if (value === 0) return "#facc15";
  if (value > -0.5) return "#f97316";
  return "#dc2626";
};

export default function TunisiaMap() {
  const [hovered, setHovered] = useState(null);

  const onEachRegion = (feature, layer) => {
    const name = feature.properties.name;
    const value = marketData[name] ?? 0;

    layer.setStyle({
      fillColor: getColor(value),
      fillOpacity: 0.7,
      color: "#fff",
      weight: 1
    });

    layer.on({
      mouseover: () => {
        setHovered({ name, value });
        layer.setStyle({ weight: 2, color: "#000" });
      },
      mouseout: () => {
        setHovered(null);
        layer.setStyle({ weight: 1, color: "#fff" });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <MapContainer
        center={[34, 9]}
        zoom={6}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON data={tunisiaGeo} onEachFeature={onEachRegion} />
      </MapContainer>

      {hovered && (
        <div className="p-4 text-sm text-center">
          <strong>{hovered.name}</strong><br />
          {hovered.value > 0 && "Good time to buy 🟢"}
          {hovered.value < 0 && "Good time to sell 🔴"}
          {hovered.value === 0 && "Stable 🟡"}
        </div>
      )}
    </div>
  );
}
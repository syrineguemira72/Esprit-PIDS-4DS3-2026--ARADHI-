import { useState } from "react";

const regions = [
  { name: "Tunis", top: "18%", left: "48%" },
  { name: "Ariana", top: "15%", left: "46%" },
  { name: "Sousse", top: "45%", left: "50%" },
  { name: "Sfax", top: "65%", left: "52%" },
  { name: "Gabes", top: "75%", left: "50%" },
];

const marketData = {
  Tunis: "buy",
  Ariana: "sell",
  Sousse: "stable",
  Sfax: "buy",
  Gabes: "sell",
};

const getColor = (status) => {
  switch (status) {
    case "buy":
      return "bg-green-500";
    case "sell":
      return "bg-red-500";
    case "stable":
      return "bg-yellow-400";
    default:
      return "bg-gray-400";
  }
};

export default function TunisiaMap() {
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">

      <h3 className="text-sm font-semibold mb-4 text-gray-600">
        Tunisia Market Map
      </h3>

      <div className="relative w-full h-[500px]">

        {/* IMAGE */}
        <img
          src="/tunisia-map.png"
          className="w-full h-full object-contain"
        />

        {/* POINTS */}
        {regions.map((region, i) => {
          const status = marketData[region.name];

          return (
            <div
              key={i}
              className={`absolute w-4 h-4 rounded-full cursor-pointer ${getColor(status)}`}
              style={{
                top: region.top,
                left: region.left,
                transform: "translate(-50%, -50%)"
              }}
              onMouseEnter={() =>
                setTooltip({
                  name: region.name,
                  status
                })
              }
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

        {/* TOOLTIP */}
        {tooltip && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg px-4 py-2 rounded-lg text-sm">
            <strong>{tooltip.name}</strong> —{" "}
            {tooltip.status === "buy" && "Good time to buy 🟢"}
            {tooltip.status === "sell" && "Good time to sell 🔴"}
            {tooltip.status === "stable" && "Stable market 🟡"}
          </div>
        )}
      </div>

      {/* LEGEND */}
      <div className="flex gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          Buy
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          Sell
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          Stable
        </div>
      </div>

    </div>
  );
}
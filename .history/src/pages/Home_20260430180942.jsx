import { useState } from "react";
import Card from "../components/Card";
import PropertyCard from "../components/PropertyCard";
import TunisiaMap from "../components/TunisiaMap";

export default function Home() {

  const [tooltip, setTooltip] = useState(null);

  // 📍 Positions (à ajuster selon ton image)
  const regions = [
    { name: "Tunis", top: "18%", left: "48%" },
    { name: "Ariana", top: "15%", left: "46%" },
    { name: "Sousse", top: "45%", left: "50%" },
    { name: "Sfax", top: "65%", left: "52%" },
    { name: "Gabes", top: "75%", left: "50%" },
  ];

  // 📊 Données marché
  const marketData = {
    Tunis: "buy",
    Ariana: "sell",
    Sousse: "stable",
    Sfax: "buy",
    Gabes: "sell",
  };

  // 🎨 couleurs
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

  return (
    <div className="px-10 py-12 bg-gray-50 min-h-screen">

      {/* HERO */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-blue-600">
          ARADHI
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Make smarter real estate decisions in Tunisia 🇹🇳
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <Card title="Market Timing" description="Know when to buy or sell" />
        <Card title="Price Prediction" description="Smart price estimation" />
        <Card title="AI Assistant" description="Ask real estate questions" />
        <Card title="Image Insights" description="Analyze property features" />
      </div>

      {/* PROPERTIES */}
      <h2 className="text-2xl font-semibold mb-6">
        Featured Properties
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <PropertyCard
          image="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          title="Villa Modern"
          price="450,000 TND"
          location="Sousse"
        />

        <PropertyCard
          image="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
          title="Luxury Apartment"
          price="320,000 TND"
          location="Tunis"
        />

        <PropertyCard
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          title="Family House"
          price="280,000 TND"
          location="Ariana"
        />
      </div>

      {/* MARKET MAP */}
      <div className="bg-white rounded-2xl shadow-sm p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📍 Market Insights
        </h2>

        <p className="text-gray-500 mb-8">
          Explore where it's the right time to buy or sell
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* MAP */}
          <div className="relative w-full h-[500px]">

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
                  className={`absolute w-4 h-4 rounded-full animate-pulse cursor-pointer ${getColor(status)}`}
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

          {/* INSIGHTS */}
          <div className="space-y-5">

            <div className="bg-blue-50 border p-4 rounded-xl">
              <h3 className="font-semibold text-blue-700">
                📊 Market Insights
              </h3>
              <p className="text-sm text-gray-600">
                We analyze price trends to guide your decisions.
              </p>
            </div>

            <div className="bg-green-50 border p-4 rounded-xl">
              <h3 className="font-semibold text-green-700">
                📈 Best Time to Buy
              </h3>
              <p className="text-sm text-gray-600">
                Mid 2026 looks favorable for buyers.
              </p>
            </div>

            <div className="bg-orange-50 border p-4 rounded-xl">
              <h3 className="font-semibold text-orange-700">
                💰 Best Time to Sell
              </h3>
              <p className="text-sm text-gray-600">
                Late 2025 shows strong opportunities.
              </p>
            </div>

          </div>

        </div>

        {/* LEGEND */}
        <div className="flex gap-6 mt-8 text-sm">
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

    </div>
  );
}
import Card from "../components/Card";
import PropertyCard from "../components/PropertyCard";

export default function Home() {
  return (
    <div className="px-10 py-12">

      {/* HERO */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-blue-600">
          ARADHI
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          Smart Real Estate Intelligence for Tunisia 🇹🇳
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <Card title="Market Timing" description="Best time to invest" />
        <Card title="Price Prediction" description="AI valuation model" />
        <Card title="Chatbot AI" description="Ask real estate questions" />
        <Card title="Image Analysis" description="Extract house features" />
      </div>

      {/* PROPERTIES */}
      <h2 className="text-2xl font-semibold mb-6">
        Featured Properties
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
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
      {/* MARKET INTELLIGENCE SECTION */}
<div className="bg-white rounded-2xl shadow-sm p-8 mb-16">

  <h2 className="text-2xl font-bold text-gray-800 mb-2">
    📊 Tunisia Real Estate Market Intelligence
  </h2>

  <p className="text-gray-500 mb-6">
    AI-powered analysis using ARIMA time series forecasting
  </p>

  <div className="grid md:grid-cols-2 gap-8 items-center">

    {/* MAP VISUAL */}
    <div className="relative">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/3/38/Tunisia_location_map.svg"
        className="w-full h-[300px] object-contain opacity-90"
      />

      {/* overlay zones */}
      <div className="absolute top-10 left-10 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
        📈 High demand (Tunis)
      </div>

      <div className="absolute bottom-10 right-10 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
        ⚖️ Stable market (Sousse)
      </div>
    </div>

    {/* ARIMA INSIGHT PANEL */}
    <div className="space-y-4">

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <h3 className="font-semibold text-blue-700">
          🧠 ARIMA Forecast Model
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Time series model trained on Tunisian real estate prices (2010–2025)
        </p>
      </div>

      <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
        <h3 className="font-semibold text-green-700">
          📈 Best Time to Buy
        </h3>
        <p className="text-sm text-gray-600">
          Predicted: Q2 2026 (market correction phase)
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
        <h3 className="font-semibold text-orange-700">
          💰 Best Time to Sell
        </h3>
        <p className="text-sm text-gray-600">
          Predicted: Q4 2025 (price peak phase)
        </p>
      </div>

    </div>

  </div>
</div>

    </div>
  );
}
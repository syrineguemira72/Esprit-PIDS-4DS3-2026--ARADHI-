import Card from "../components/Card";
import PropertyCard from "../components/PropertyCard";

export default function Home() {
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

      {/* MARKET INTELLIGENCE */}
      <div className="bg-white rounded-2xl shadow-sm p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📍 Market Insights
        </h2>

        <p className="text-gray-500 mb-8">
          Explore where it's the right time to buy or sell
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* INTERACTIVE MAP */}
          <div className="relative w-full h-[350px] bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-inner">

            <h3 className="text-sm font-semibold text-gray-600 mb-4">
              Tunisia Market Map
            </h3>

            {/* Tunis */}
            <div className="absolute top-16 left-24 group cursor-pointer">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-bold text-gray-800 mt-1">
                Tunis
              </p>

              <div className="hidden group-hover:block absolute bg-white shadow-lg rounded-lg p-3 text-xs mt-2 w-40">
                🟢 Good time to buy
              </div>
            </div>

            {/* Ariana */}
            <div className="absolute top-20 left-28 group cursor-pointer">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <p className="text-sm font-bold text-gray-800 mt-1">
                Ariana
              </p>

              <div className="hidden group-hover:block absolute bg-white shadow-lg rounded-lg p-3 text-xs mt-2 w-40">
                🔴 Good time to sell
              </div>
            </div>

            {/* Sousse */}
            <div className="absolute bottom-20 left-32 group cursor-pointer">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <p className="text-sm font-bold text-gray-800 mt-1">
                Sousse
              </p>

              <div className="hidden group-hover:block absolute bg-white shadow-lg rounded-lg p-3 text-xs mt-2 w-40">
                ⚖️ Stable market
              </div>
            </div>

          </div>

          {/* INSIGHTS PANEL */}
          <div className="space-y-5">

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <h3 className="font-semibold text-blue-700">
                📊 Smart Insights
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                We analyze price trends to help you decide when to act.
              </p>
            </div>

            <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
              <h3 className="font-semibold text-green-700">
                📈 Best Time to Buy
              </h3>
              <p className="text-sm text-gray-600">
                Mid 2026 looks favorable for buyers in major cities.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
              <h3 className="font-semibold text-orange-700">
                💰 Best Time to Sell
              </h3>
              <p className="text-sm text-gray-600">
                Late 2025 shows strong price opportunities.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
import Card from "../components/Card";
import PropertyCard from "../components/PropertyCard";
import TunisiaMap from "../components/TunisiaMap";

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

      <div className="grid md:grid-cols-2 gap-10 items-center">

  <TunisiaMap />

  <div className="space-y-5">

    <div className="bg-blue-50 border p-4 rounded-xl">
      <h3 className="font-semibold text-blue-700">
        📊 Market Insights
      </h3>
      <p className="text-sm text-gray-600">
        We analyze trends to guide your decisions.
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

    </div>
  );
}
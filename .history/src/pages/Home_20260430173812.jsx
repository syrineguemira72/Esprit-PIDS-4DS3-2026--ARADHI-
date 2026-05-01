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

    </div>
  );
}
import Card from "../components/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10">

      {/* HERO */}
      <div className="text-center mb-14">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
          ARADHI
        </h1>

        <p className="mt-4 text-xl text-gray-600">
          Smart Real Estate Intelligence for Tunisia 🇹🇳
        </p>

        <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
          AI-powered platform to predict prices, analyze properties, and help you invest smarter in the Tunisian real estate market.
        </p>
      </div>

      {/* FEATURE GRID */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <Card
          title="📊 Market Timing"
          description="Find the best time to buy or sell"
        />
        <Card
          title="🏠 Price Prediction"
          description="AI valuation of real estate"
        />
        <Card
          title="🤖 AI Assistant"
          description="Chat with real estate AI"
        />
        <Card
          title="📸 Image Analysis"
          description="Extract features from property images"
        />
      </div>

      {/* PROPERTY LISTINGS */}
      <h2 className="text-2xl font-bold mb-6">
        🏡 Featured Properties in Tunisia
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <PropertyCard
          image="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          title="Modern Villa - Sousse"
          price="450,000 TND"
          location="Sousse, Tunisia"
        />

        <PropertyCard
          image="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
          title="Luxury Apartment - Tunis"
          price="320,000 TND"
          location="Tunis, Tunisia"
        />

        <PropertyCard
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          title="Family House - Ariana"
          price="280,000 TND"
          location="Ariana, Tunisia"
        />

      </div>

      {/* ABOUT SECTION */}
      <div className="mt-20 bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">
          Why ARADHI?
        </h2>

        <p className="text-gray-600 text-center max-w-3xl mx-auto">
          The Tunisian real estate market is evolving rapidly.
          ARADHI combines AI, data science, and local expertise to help users
          make smarter investment decisions.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8 text-center text-gray-600">
          <div>🇹🇳 Built for Tunisia</div>
          <div>🧠 AI-driven insights</div>
          <div>📈 Real-time market analysis</div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <h2 className="text-xl font-semibold">
          Meet the ARADHI Team
        </h2>

        <p className="text-gray-500 mt-2">
          Engineers • AI specialists • Real estate analysts
        </p>

        <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
          About Us
        </button>
      </div>

    </div>
  );
}

/* PROPERTY CARD */
function PropertyCard({ image, title, price, location }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">

      <img
        src={image}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-blue-600 font-semibold">{price}</p>
        <p className="text-gray-500 text-sm">{location}</p>
      </div>

    </div>
  );
}
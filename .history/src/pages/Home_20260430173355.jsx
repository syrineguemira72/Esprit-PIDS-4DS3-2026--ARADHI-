import Card from "../components/Card";

export default function Home() {
  return (
    <div className="text-center mt-12 px-4">

      {/* HERO */}
      <div className="mb-16">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          ARADHI
        </h1>

        <p className="mt-4 text-xl text-gray-300">
          Smart Real Estate Intelligence for Tunisia 🇹🇳
        </p>

        <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
          ARADHI helps you analyze property prices, predict market trends,
          and find the best time to buy or sell real estate in Tunisia using AI.
        </p>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mt-10">
        <Card
          title="📊 Market Timing"
          description="Find the perfect moment to invest using AI forecasting"
        />
        <Card
          title="🏠 Price Prediction"
          description="Estimate real estate prices with machine learning"
        />
        <Card
          title="🤖 AI Chat Assistant"
          description="Ask questions about properties in Tunisia"
        />
        <Card
          title="📸 Image Analysis"
          description="Extract property features from images"
        />
      </div>

      {/* ABOUT SECTION */}
      <div className="mt-20 bg-white/5 backdrop-blur-lg p-10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">
          Why ARADHI?
        </h2>

        <p className="text-gray-300 max-w-3xl mx-auto">
          The Tunisian real estate market is complex and dynamic.
          ARADHI combines artificial intelligence, data science, and local insights
          to help users make smarter investment decisions.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8 text-sm text-gray-300">
          <div>🇹🇳 Built for Tunisia</div>
          <div>🧠 AI-powered predictions</div>
          <div>📈 Real market insights</div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <Stat number="10K+" label="Properties Analyzed" />
        <Stat number="95%" label="Prediction Accuracy" />
        <Stat number="6" label="Team Members" />
      </div>

      {/* ABOUT US CTA */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-white">
          Meet the Team Behind ARADHI
        </h2>

        <p className="text-gray-400 mt-2">
          Data scientists, AI engineers, and real estate experts
        </p>

        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-semibold hover:scale-105 transition">
          About Us
        </button>
      </div>

    </div>
  );
}

/* STAT COMPONENT */
function Stat({ number, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
      <h3 className="text-3xl font-bold text-orange-400">{number}</h3>
      <p className="text-gray-300 mt-2">{label}</p>
    </div>
  );
}
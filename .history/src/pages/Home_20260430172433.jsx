import Card from "../components/Card";

export default function Home() {
  return (
    <div className="text-center mt-16">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        EstateAI Tunisia
      </h1>

      <p className="mt-6 text-gray-300 text-lg">
        Smart AI platform for real estate investment decisions
      </p>

      <div className="grid md:grid-cols-4 gap-6 mt-16">
        <Card title="Market Timing" description="Best time to buy/sell" />
        <Card title="Price Prediction" description="AI house valuation" />
        <Card title="Chatbot" description="Ask AI anything" />
        <Card title="Image AI" description="Analyze house images" />
      </div>
    </div>
  );
}
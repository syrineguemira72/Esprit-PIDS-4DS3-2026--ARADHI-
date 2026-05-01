import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
  { month: "Jan", price: 120 },
  { month: "Feb", price: 150 },
  { month: "Mar", price: 180 },
  { month: "Apr", price: 160 },
];

export default function MarketTiming() {
  return (
    <div>
      <h1 className="text-3xl mb-6">Market Timing</h1>

      <div className="bg-white/10 p-6 rounded-xl">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#6366f1" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
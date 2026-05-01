export default function Card({ title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:scale-105 transition">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}
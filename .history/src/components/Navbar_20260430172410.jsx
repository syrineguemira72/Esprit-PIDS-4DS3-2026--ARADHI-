import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="backdrop-blur-lg bg-white/10 border-b border-white/20 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-indigo-400">EstateAI</h1>

      <div className="flex gap-6 text-sm">
        <Link to="/">Home</Link>
        <Link to="/market">Market</Link>
        <Link to="/prediction">Prediction</Link>
        <Link to="/chatbot">Chatbot</Link>
        <Link to="/image">Image AI</Link>
        <Link to="/about">Team</Link>
      </div>
    </nav>
  );
}
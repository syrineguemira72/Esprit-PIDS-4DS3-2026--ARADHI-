import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white shadow-sm sticky top-0 z-50">

      <h1 className="text-xl font-bold text-blue-600">
        ARADHI
      </h1>

      <div className="flex gap-6 text-gray-600 font-medium">
        <Link className="hover:text-blue-600" to="/">Home</Link>
        <Link className="hover:text-blue-600" to="/market">Market</Link>
        <Link className="hover:text-blue-600" to="/prediction">Prediction</Link>
        <Link className="hover:text-blue-600" to="/chatbot">Chatbot</Link>
        <Link className="hover:text-blue-600" to="/image">Image AI</Link>
        <Link className="hover:text-blue-600" to="/team">Team</Link>
      </div>

    </div>
  );
}
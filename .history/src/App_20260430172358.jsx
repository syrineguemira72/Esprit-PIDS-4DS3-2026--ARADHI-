import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MarketTiming from "./pages/MarketTiming";
import PricePrediction from "./pages/PricePrediction";
import Chatbot from "./pages/Chatbot";
import ImageAnalysis from "./pages/ImageAnalysis";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<MarketTiming />} />
            <Route path="/prediction" element={<PricePrediction />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/image" element={<ImageAnalysis />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
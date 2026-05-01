import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import MarketTimingPage from "./pages/MarketTimingPage";
import MapPage from "./pages/MapPage";
import EstimatorPage from "./pages/EstimatorPage";
import ChatbotPage from "./pages/ChatbotPage";
import PhotoAnalysisPage from "./pages/PhotoAnalysisPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/timing" element={<MarketTimingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/estimate" element={<EstimatorPage />} />
        <Route path="/chat" element={<ChatbotPage />} />
        <Route path="/photo" element={<PhotoAnalysisPage />} />
      </Routes>
    </BrowserRouter>
  );
}
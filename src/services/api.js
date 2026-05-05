// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// ========== LISTINGS ==========
export const getListings = async () => {
  const res = await API.get("/listings");
  return res.data;
};

// ========== ESTIMATION XGBoost ==========
export const estimatePrice = async (data) => {
  // Transformer les données pour correspondre à l'API FastAPI
  const requestData = {
    gouvernorat: data.gouvernorat,
    type_bien: data.type_bien || data.typeImm_regroupe || "Appartement",
    surface: data.superficie_habitale || data.surface,
    rooms: data.nbpiece || data.rooms,
    salle_de_bain: data.salle_de_bain || 1,
    parking: data.parking ? 1 : 0,
    climatisation: data.climatisation ? 1 : 0,
    cuisine: data.cuisine ? 1 : 0,
    terrasse: data.terrasse ? 1 : 0,
    piscine: data.piscine ? 1 : 0,
    ascenseur: data.ascenseur ? 1 : 0,
  };

  // Ajouter le prix demandé si fourni (optionnel)
  if (data.prix_demande) {
    requestData.prix_demande = data.prix_demande;
  }

  const res = await API.post("/estimate", requestData);

  // Enrichir la réponse avec l'analyse du ratio
  if (data.prix_demande && data.prix_demande > 0) {
    const ratio = data.prix_demande / res.data.price;
    res.data.ratio = ratio;

    if (ratio < 0.85) {
      res.data.interpretation = "Bonne affaire";
      res.data.recommandation = "✅ Excellent prix ! Ce bien est sous-évalué par rapport au marché.";
      res.data.ratio_class = "good";
    } else if (ratio > 1.15) {
      res.data.interpretation = "Surévalué";
      res.data.recommandation = "⚠️ Prix élevé. Négociez ou cherchez d'autres options.";
      res.data.ratio_class = "high";
    } else {
      res.data.interpretation = "Prix correct";
      res.data.recommandation = "👍 Prix aligné avec le marché. Bonne opportunité.";
      res.data.ratio_class = "fair";
    }
    res.data.prix_demande = data.prix_demande;
  }

  return res.data;
};

// ========== CHATBOT ==========
export const askAI = async (message) => {
  const res = await API.post("/chat", { message });
  return res.data.reply;
};

// ========== PHOTO ANALYSIS ==========
export const analyzePhoto = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await API.post("/photo", formData);
  return res.data;
};

// ========== ZONE SIGNALS (ARIMA) ==========
export const getZoneSignals = async () => {
  const res = await API.get("/zones/signals");
  return res.data;
};

// ========== TREND PREDICTION (ARIMA) ==========
export const getTrend = async (gouvernorat, horizon = 6) => {
  const res = await API.get("/predict/trend", {
    params: { gouvernorat, horizon },
  });
  return res.data;
};

// ========== ZONES MAP ==========
export const getZonesMap = async () => {
  const res = await API.get("/zones/map");
  return res.data;
};

// ========== GOUVERNORATS LIST ==========
export const getGouvernorats = async () => {
  const res = await API.get("/");
  return res.data.gouvernorats || [];
};

export default {
  getListings,
  estimatePrice,
  askAI,
  analyzePhoto,
  getZoneSignals,
  getTrend,
  getZonesMap,
  getGouvernorats,
};

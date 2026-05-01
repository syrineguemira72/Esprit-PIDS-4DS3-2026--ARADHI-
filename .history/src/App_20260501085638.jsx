// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:8000
});

export const getListings     = ()       => api.get("/listings").then(r => r.data);
export const getMarketTiming = ()       => api.get("/market-timing").then(r => r.data);
export const getZones        = ()       => api.get("/zones").then(r => r.data);
export const predictPrice    = (data)   => api.post("/predict-price", data).then(r => r.data);
export const sendChat        = (msg)    => api.post("/chat", { message: msg }).then(r => r.data);
export const analyzePhoto    = (file)   => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/analyze-photo", form).then(r => r.data);
};
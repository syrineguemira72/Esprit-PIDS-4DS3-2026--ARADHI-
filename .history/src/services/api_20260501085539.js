// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getListings = async () => {
  const res = await API.get("/listings");
  return res.data;
};

export const estimatePrice = async (data) => {
  const res = await API.post("/estimate", data);
  return res.data;
};

export const askAI = async (message) => {
  const res = await API.post("/chat", { message });
  return res.data.reply;
};

export const analyzePhoto = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await API.post("/photo", formData);
  return res.data;
};
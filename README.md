# ARADHI – AI-Powered Real Estate Platform

## Overview
This project was developed as part of the *PIDEV – 4th Year Engineering Program* at *Esprit School of Engineering* (Academic Year 2025–2026).

ARADHI is an intelligent real estate platform that uses AI to predict property prices, classify image quality, enable semantic search, and provide investment insights for the Tunisian market.

## Features
- Property price prediction (XGBoost, Random Forest, ANN)
- Image-based classification (Luxury / Normal / Old) using MobileNetV2
- Semantic search engine (FAISS + Sentence-BERT)
- GPT-2 chatbot for natural language queries
- B2B premium evaluator
- Time series analysis for buy/sell recommendations

## Tech Stack
### Frontend / Interface
- React.js
- FastAPI (REST API backend)
- Streamlit (Dashboard agents)
- HTML/JS (RAG search interface)

### Backend / AI
- Python
- TensorFlow / Keras
- PyTorch (GPT-2 fine-tuning)
- Scikit-learn
- XGBoost
- FAISS
- Sentence-Transformers

### APIs & Deployment
- Flask (API GPT-2 & RAG)
- FastAPI (API principale)
- Groq (LLM API)
- Cloudflare Tunnel

## Architecture
The project follows the TDSP (Team Data Science Process) methodology with modular DSOS:
- DSO1: Image segmentation (SegFormer) + feature extraction
- DSO2: Price prediction (XGBoost best model)
- DSO3: RAG + FAISS search engine
- DSO4: Image classification (MobileNetV2)

## Contributors
- Guemira Syrine (https://github.com/syrineguemira72)
- Ryhab Ben Hadj Slimen (https://github.com/rihab-belhadj)
- Ghofrane jmai (https://github.com/ghofranjmai)
- Neirouz Hannachi (https://github.com/Hanachineiouz)
- Badisse Chabanne (https://github.com/Badisse02)
- Khaled ElAbed (https://github.com/Khaledabed19)

## Academic Context
Developed at *Esprit School of Engineering – Tunisia*  
Program: Engineering Degree – 4th Year  
Course: PIDEV – Projet Innovant en Data Science  
Academic Year: 2025–2026

## Getting Started
```bash
# Clone The project
git clone https://github.com/syrineguemira72/Esprit-PIDS-4DS3-2026--ARADHI-.git

# Create and activate a virtual Env
cd Esprit-PIDS-4DS3-2026--ARADHI-
virtualenv venv
venv\Scripts\activate

# Install Project Requirements
pip install -r requirements.txt

# Run the frontend
npm run dev
```
### In another terminal

```bash
# Run the frontend
cd backend
uvicorn app:app --reload --port 8000
```

⚠️ Make sure to create the ***"models"*** folder under the ***"immotn-backend"*** directory and upload the neccessary models.
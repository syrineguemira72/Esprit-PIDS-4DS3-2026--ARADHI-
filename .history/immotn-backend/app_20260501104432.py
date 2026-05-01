from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import arima  # ← juste ça, sans importer la classe

app = FastAPI(title="EstateAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("models/arima_models.pkl", "rb") as f:
    arima_models = pickle.load(f)

GOUVERNORATS = list(arima_models.keys())
print(f"✅ ARIMA chargé pour: {GOUVERNORATS}")


@app.get("/api/")
def index():
    return {"status": "ok", "gouvernorats": GOUVERNORATS}


@app.get("/api/predict/trend")
def predict_trend(gouvernorat: str = "Tunis", horizon: int = 6):
    if gouvernorat not in arima_models:
        raise HTTPException(status_code=404, detail=f"Gouvernorat '{gouvernorat}' inconnu")
    forecast = arima_models[gouvernorat].forecast(horizon).tolist()
    return {"gouvernorat": gouvernorat, "horizon": horizon, "forecast": forecast}


@app.get("/api/zones/signals")
def zone_signals():
    signals = []
    for gov, model in arima_models.items():
        forecast = model.forecast(6)
        last_price = float(model.orig[-1])
        growth = (forecast[-1] - last_price) / last_price * 100
        signal = "buy" if growth > 4 else "sell" if growth < -2 else "wait"
        signals.append({
            "gouvernorat": gov,
            "signal": signal,
            "growth_pct": round(growth, 1),
            "last_price": round(last_price),
            "forecast_6m": round(float(forecast[-1]))
        })
    return signals
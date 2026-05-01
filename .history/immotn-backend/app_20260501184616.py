from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
from arima import SimpleARIMA
from pydantic import BaseModel
import pandas as pd

class EstimateRequest(BaseModel):
    gouvernorat: str
    type_bien: str
    surface: float
    rooms: int
    salle_de_bain: int
    parking: int
    climatisation: int
    cuisine: int
    terrasse: int
    piscine: int
    ascenseur: int
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

@app.get("/api/zones/map")
def zones_map():
    # Position fixe de chaque gouvernorat sur la carte
    GOV_POSITIONS = {
        "Tunis":     {"top": "22%", "left": "45%"},
        "Ariana":    {"top": "20%", "left": "47%"},
        "Ben Arous": {"top": "26%", "left": "48%"},
        "Manouba":   {"top": "24%", "left": "43%"},
        "Bizerte":   {"top": "18%", "left": "40%"},
        "Nabeul":    {"top": "32%", "left": "54%"},
        "Zaghouan":  {"top": "30%", "left": "48%"},
        "Monastir":  {"top": "42%", "left": "55%"},
        "Sousse":    {"top": "38%", "left": "52%"},
        "Sfax":      {"top": "58%", "left": "46%"},
    }

    zones  = []
    pins   = []

    # Trier par last_price pour calculer le width% relatif
    all_prices = [float(m.orig[-1]) for m in arima_models.values()]
    max_price  = max(all_prices)

    for gov, model in arima_models.items():
        forecast   = model.forecast(6)
        last_price = float(model.orig[-1])
        growth     = (forecast[-1] - last_price) / last_price * 100

        # Signal
        if growth > 4:
            signal    = "buy"
            tag       = "Buy now"
            tag_class = "t-buy"
            fill      = "fill-buy"
            pin_type  = "pin-buy"
            sub       = f"Prices rising · +{round(growth,1)}% expected"
        elif growth < -2:
            signal    = "sell"
            tag       = "Sell now"
            tag_class = "t-sell"
            fill      = "fill-sell"
            pin_type  = "pin-sell"
            sub       = f"Peak reached · {round(growth,1)}% drop expected"
        else:
            signal    = "wait"
            tag       = "Watch"
            tag_class = "t-wait"
            fill      = "fill-wait"
            pin_type  = "pin-wait"
            sub       = f"Flat trend · wait for signal"

        # Prix/m² estimé (approximation : last_price / 120m² moyen)
        price_m2 = round(last_price / 120)

        # Barre de largeur relative
        width_pct = f"{round((last_price / max_price) * 100)}%"

        zones.append({
            "city":      gov,
            "tag":       tag,
            "tagClass":  tag_class,
            "price":     f"{price_m2:,}".replace(",", " "),
            "sub":       sub,
            "width":     width_pct,
            "fillClass": fill,
            "signal":    signal,
            "growth_pct": round(growth, 1),
        })

        if gov in GOV_POSITIONS:
            pins.append({
                "top":   GOV_POSITIONS[gov]["top"],
                "left":  GOV_POSITIONS[gov]["left"],
                "type":  pin_type,
                "label": gov,
            })

    # Trier zones : buy en premier, puis wait, puis sell
    order = {"buy": 0, "wait": 1, "sell": 2}
    zones.sort(key=lambda z: order[z["signal"]])

    return {"zones": zones, "pins": pins}

# ══════════════════════════════════════════════════════════════════════════
# NOUVELLE ROUTE — XGBoost estimation
# ══════════════════════════════════════════════════════════════════════════
@app.post("/api/estimate")
def estimate_price(req: EstimateRequest):
    # Encoder gouvernorat et type
    gov_encoded  = GOV_ENCODE.get(req.gouvernorat, GOV_ENCODE["Tunis"])
    type_encoded = TYPE_ENCODE.get(req.type_bien,  TYPE_ENCODE["Appartement"])

    row = pd.DataFrame([{
        'climatisation':       req.climatisation,
        'cuisine':             req.cuisine,
        'nbpiece':             req.rooms,
        'salle_de_bain':       req.salle_de_bain,
        'superficie_terrain':  req.surface * 1.5,   # approximation
        'superficie_habitale': req.surface,
        'parking':             req.parking,
        'piscine':             req.piscine,
        'terrasse':            req.terrasse,
        'ascenseur':           req.ascenseur,
        'gouvernorat':         gov_encoded,
        'typeImm_regroupe':    type_encoded,
    }])

    row = row[XGB_FEATURES]
    price = float(xgb_model.predict(row)[0])
    price = max(price, 10_000)   # plancher

    price_m2   = round(price / req.surface) if req.surface > 0 else 0
    price_low  = round(price * 0.92)
    price_high = round(price * 1.08)

    # Signal ARIMA pour ce gouvernorat si disponible
    signal_text = ""
    if req.gouvernorat in arima_models:
        model    = arima_models[req.gouvernorat]
        forecast = model.forecast(6)
        last     = float(model.orig[-1])
        growth   = (forecast[-1] - last) / last * 100
        if growth > 4:
            signal_text = f"📈 Great time to sell — prices rising +{round(growth,1)}% expected"
        elif growth < -2:
            signal_text = f"📉 Consider waiting — prices may drop {round(growth,1)}%"
        else:
            signal_text = f"➡️ Market is stable in {req.gouvernorat}"

    return {
        "price":       round(price),
        "price_low":   price_low,
        "price_high":  price_high,
        "price_m2":    price_m2,
        "currency":    "TND",
        "signal":      signal_text,
        "confidence":  82,
    }
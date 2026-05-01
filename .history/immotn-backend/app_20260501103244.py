# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Charger ARIMA
with open("models/arima_models.pkl", "rb") as f:
    arima_models = pickle.load(f)

GOUVERNORATS = list(arima_models.keys())
print(f"✅ ARIMA chargé pour: {GOUVERNORATS}")


@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "ok", "gouvernorats": GOUVERNORATS})


@app.route("/predict/trend", methods=["GET"])
def predict_trend():
    gov = request.args.get("gouvernorat", "Tunis")
    horizon = int(request.args.get("horizon", 6))

    if gov not in arima_models:
        return jsonify({
            "error": f"Gouvernorat '{gov}' inconnu",
            "disponibles": GOUVERNORATS
        }), 404

    forecast = arima_models[gov].forecast(horizon).tolist()

    return jsonify({
        "gouvernorat": gov,
        "horizon": horizon,
        "forecast": forecast
    })


@app.route("/zones/signals", methods=["GET"])
def zone_signals():
    signals = []

    for gov, model in arima_models.items():
        forecast = model.forecast(6)
        last_price = float(model.orig[-1])
        growth = (forecast[-1] - last_price) / last_price * 100

        if growth > 4:
            signal = "buy"
        elif growth < -2:
            signal = "sell"
        else:
            signal = "wait"

        signals.append({
            "gouvernorat": gov,
            "signal": signal,
            "growth_pct": round(growth, 1),
            "last_price": round(last_price),
            "forecast_6m": round(float(forecast[-1]))
        })

    return jsonify(signals)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
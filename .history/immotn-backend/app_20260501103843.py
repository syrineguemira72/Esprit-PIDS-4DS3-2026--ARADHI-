from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

class SimpleARIMA:
    def __init__(self, p=2, d=1, q=1):
        self.p, self.d, self.q = p, d, q

    def difference(self, y, d):
        for _ in range(d): y = np.diff(y)
        return y

    def fit(self, y):
        self.orig = np.array(y, dtype=float)
        diff_y = self.difference(self.orig, self.d)
        self.mean_diff = diff_y.mean()
        diff_y = diff_y - self.mean_diff
        N = len(diff_y)
        self.residuals = np.zeros(N)
        if self.p > 0 and N > self.p:
            X = np.column_stack([diff_y[i:N-self.p+i] for i in range(self.p)])
            Y = diff_y[self.p:]
            self.ar_coefs = np.linalg.lstsq(X, Y, rcond=None)[0]
            pred_ar = X @ self.ar_coefs
            self.residuals[self.p:] = Y - pred_ar
        else:
            self.ar_coefs = np.zeros(self.p)
        return self

    def forecast(self, steps):
        diff_y = self.difference(self.orig, self.d) - self.mean_diff
        history  = list(diff_y)
        res_hist = list(self.residuals)
        forecasts_diff = []
        for _ in range(steps):
            ar_term = sum(self.ar_coefs[i] * history[-(i+1)]
                         for i in range(self.p)) if self.p > 0 else 0
            ma_term = res_hist[-1] * 0.3 if self.q > 0 else 0
            pred = ar_term + ma_term + self.mean_diff
            forecasts_diff.append(pred)
            history.append(pred)
            res_hist.append(0)
        result = []
        last = self.orig[-1]
        for v in forecasts_diff:
            last = last + v
            result.append(last)
        return np.array(result)


app = Flask(__name__)
CORS(app)

with open("models/arima_models.pkl", "rb") as f:
    arima_models = pickle.load(f)

GOUVERNORATS = list(arima_models.keys())
print(f"✅ ARIMA chargé pour: {GOUVERNORATS}")


# ── Routes avec préfixe /api ───────────────────────────────────────────────

@app.route("/api/", methods=["GET"])
def index():
    return jsonify({"status": "ok", "gouvernorats": GOUVERNORATS})


@app.route("/api/predict/trend", methods=["GET"])
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


@app.route("/api/zones/signals", methods=["GET"])
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
    return jsonify(signals)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
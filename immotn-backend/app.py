from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
from arima import SimpleARIMA
from pydantic import BaseModel
import pandas as pd
import io
import re
import unicodedata
import threading
import os
import glob
import torch
from PIL import Image
from transformers import (
    SegformerImageProcessor,
    SegformerForSemanticSegmentation,
    AutoTokenizer,
    AutoModelForCausalLM,
)
import tensorflow as tf
import os

# ── XGBoost ───────────────────────────────────────────────────────────────────
with open("models/xgb_model.pkl", "rb") as f:
    xgb_model = pickle.load(f)

GOV_ENCODE = {"Tunis": 0}
TYPE_ENCODE = {"Appartement": 0}
XGB_FEATURES = [
    'climatisation', 'cuisine', 'nbpiece', 'salle_de_bain',
    'superficie_terrain', 'superficie_habitale',
    'parking', 'piscine', 'terrasse', 'ascenseur',
    'gouvernorat', 'typeImm_regroupe'
]


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

class RecommandRequest(BaseModel):
    message: str
    n: int = 0

class EvalRequest(BaseModel):
    description: str

app = FastAPI(title="EstateAI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ARIMA ─────────────────────────────────────────────────────────────────────
with open("models/arima_models.pkl", "rb") as f:
    arima_models = pickle.load(f)
GOUVERNORATS = list(arima_models.keys())
print(f"✅ ARIMA chargé pour: {GOUVERNORATS}")

# ── STANDING MODEL ────────────────────────────────────────────────────────────
print("📥 Chargement Standing Model...")
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    standing_model = tf.keras.models.load_model(
        "models/standing.keras",
        custom_objects=None,
        compile=False,
        safe_mode=False
    )
    print("✅ Standing model chargé")
except Exception as e:
    standing_model = None
    print(f"⚠️ Impossible de charger standing.keras: {e}")

# ── GPT-2 ─────────────────────────────────────────────────────────────────────
model_path = "./models_aqaria_gpt2_finetuned/best_model"
if os.path.exists(model_path):
    tokenizer  = AutoTokenizer.from_pretrained(model_path)
    gpt2_model = AutoModelForCausalLM.from_pretrained(model_path)
    print(f"✅ GPT-2 chargé depuis {model_path}")
else:
    tokenizer  = AutoTokenizer.from_pretrained("gpt2")
    gpt2_model = AutoModelForCausalLM.from_pretrained("gpt2")
    print("✅ GPT-2 par défaut")
tokenizer.pad_token    = tokenizer.eos_token
tokenizer.padding_side = "right"
gpt2_model.eval()
_inference_lock = threading.Lock()

# ── Dataset ───────────────────────────────────────────────────────────────────
csv_path = "/kaggle/input/datasets/jmaighofran/data-immobiler-finale-prete-csv/daaataaa.csv"
if not os.path.exists(csv_path):
    csvs     = glob.glob("/kaggle/input/**/*.csv", recursive=True)
    csv_path = csvs[0] if csvs else os.path.join(BASE_DIR, "data_Immobiler_finale_prete.csv")
try:
    df = pd.read_csv(csv_path)
    df["price_numeric"]   = pd.to_numeric(df.get("price_numeric",   pd.Series(dtype=float)), errors="coerce")
    df["area_m2_numeric"] = pd.to_numeric(df.get("area_m2_numeric", pd.Series(dtype=float)), errors="coerce")
    df = df.dropna(subset=["price_numeric", "area_m2_numeric"])
    df["ville_lower"]         = df["ville"].astype(str).str.lower().str.strip()
    df["ville_norm"]          = df["ville_lower"].str.replace("é","e").str.replace("è","e")
    df["property_type_lower"] = df["property_type"].astype(str).str.lower().str.strip()
    for col in ["piscine","jardin","garage","meuble","climatisation","ascenseur"]:
        df[col] = pd.to_numeric(df.get(col, 0), errors="coerce").fillna(0).astype(int)
    DATASET_VILLES = df["ville"].dropna().unique().tolist()
    print(f"✅ Dataset: {len(df)} biens | {len(DATASET_VILLES)} villes")
except Exception as e:
    print(f"⚠️  Dataset non chargé ({e})")
    df             = pd.DataFrame()
    DATASET_VILLES = []

# ── SegFormer ─────────────────────────────────────────────────────────────────
MODEL_NAME = "nvidia/segformer-b2-finetuned-ade-512-512"
print("📥 Chargement SegFormer...")
seg_processor = SegformerImageProcessor.from_pretrained(MODEL_NAME)
seg_model = SegformerForSemanticSegmentation.from_pretrained(MODEL_NAME)
seg_model.eval()
id2label = seg_model.config.id2label


def get_ids(*keywords):
    return [int(k) for k, v in id2label.items()
            if any(kw.lower() in v.lower() for kw in keywords)]


ADE_GROUPS = {
    "wall": get_ids("wall"),
    "floor": get_ids("floor", "flooring", "rug", "carpet"),
    "ceiling": get_ids("ceiling"),
    "window": get_ids("window"),
    "furniture": get_ids("sofa", "chair", "table", "bed", "cabinet"),
    "kitchen": get_ids("kitchen", "refrigerator", "stove", "oven"),
    "bathroom": get_ids("bathtub", "toilet", "sink", "shower"),
    "nature": get_ids("grass", "tree", "plant", "flower"),
    "pool": get_ids("pool", "swimming"),
    "sky": get_ids("sky"),
}
print("✅ SegFormer chargé")

# ══════════════════════════════════════════════════════════════════════════════
# HELPERS — logique notebook
# ══════════════════════════════════════════════════════════════════════════════
def detect_intent(message):
    t = unicodedata.normalize("NFD", message.lower()).encode("ascii","ignore").decode("utf-8")
    if re.search(r"evalue|score|analyse|premium|evaluer", t): return "eval"
    if re.search(r"villa|appart|studio|piscine|jardin|garage|location|vente|s\+", t): return "rag"
    return "chat"

def extract_criteres(message):
    t = message.lower()
    criteres = {"villes":[],"property_type":None,"piscine":0,"jardin":0,"garage":0,"meuble":0,"bedrooms_exact":None,"type_transaction":None}
    for v in ["la marsa","marsa","gammarth","carthage","tunis","sousse","ariana","sidi bou said","hammamet","el menzah","ennasr"]:
        if v in t: criteres["villes"] = [v]; break
    if "villa"  in t: criteres["property_type"] = "villa"
    elif "appart" in t: criteres["property_type"] = "appartement"
    elif "studio" in t: criteres["property_type"] = "studio"
    if "piscine"  in t: criteres["piscine"] = 1
    if "jardin"   in t: criteres["jardin"]  = 1
    if "garage"   in t: criteres["garage"]  = 1
    if "location" in t or "louer" in t:  criteres["type_transaction"] = "location"
    elif "vente"  in t or "acheter" in t: criteres["type_transaction"] = "vente"
    m = re.search(r"s\+(\d)", t)
    if m: criteres["bedrooms_exact"] = int(m.group(1))
    return criteres

CORRECTIONS = {"lamarsa":"la marsa","marsa":"la marsa","gammarth":"gammarth","gammart":"gammarth",
               "souse":"sousse","sousse":"sousse","soukra":"la soukra","lasoukra":"la soukra",
               "tunis":"tunis","tounes":"tunis","carthage":"carthage","cartage":"carthage",
               "ariana":"ariana","menzah":"el menzah","ennaser":"ennasr","ennasr":"ennasr"}

def rechercher_biens(criteres, n=6):
    if df.empty: return pd.DataFrame(), "❌ Dataset non disponible"
    res = df.copy()
    villes = criteres.get("villes", [])
    if villes:
        ville_req      = villes[0].lower().strip()
        ville_corrigee = CORRECTIONS.get(ville_req, ville_req)
        mask = res["ville_norm"].str.contains(ville_corrigee, na=False)
        if not mask.any(): mask = res["ville_norm"].str.contains(ville_req[:4], na=False)
        if mask.any(): res = res[mask]
        else: return pd.DataFrame(), f"❌ Ville '{ville_req}' non trouvée"
    ptype = criteres.get("property_type")
    if ptype:
        pl = ptype.lower()
        if pl == "villa":      res = res[res["property_type_lower"].str.contains("villa",   na=False)]
        elif pl in ("appartement","appart"): res = res[res["property_type_lower"].str.contains("appart", na=False)]
    for eq in ["piscine","jardin","garage","meuble"]:
        if criteres.get(eq) == 1: res = res[res[eq] == 1]
    trans = criteres.get("type_transaction")
    if trans and "type" in res.columns:
        if "location" in trans: res = res[res["type"].str.lower().str.contains("location", na=False)]
        elif "vente"  in trans: res = res[res["type"].str.lower().str.contains("vente",    na=False)]
    beds = criteres.get("bedrooms_exact")
    if beds: res = res[res["bedrooms"] == float(beds + 1)]
    res = res.drop_duplicates(subset=["title"]).head(n)
    return res, f"📊 {len(res)} bien(s) trouvé(s)"

_CHAT_RESPONSES = {
    "difference vente location": "🔑 La vente est un achat définitif. La location est un loyer mensuel sans acquisition.",
    "prix moyen":   "💰 Prix moyens Tunis : Appart S+2 : 200K-400K DT, Villa : 500K-1.5M DT.",
    "meilleur quartier": "🏆 La Marsa, Carthage, Sidi Bou Said, Gammarth (prestige), El Menzah (étudiants).",
    "investir":     "💡 Investissement locatif intéressant à La Marsa, Carthage, El Menzah.",
    "s+2":          "🏠 S+2 = Salon + 2 chambres. Surface moyenne : 70-100m².",
    "s+3":          "🏠 S+3 = Salon + 3 chambres. Surface moyenne : 100-130m².",
}

def chat_response(message):
    t = message.lower()
    for key, resp in _CHAT_RESPONSES.items():
        if key in t: return resp
    return "Je suis AQARIA, votre assistant immobilier tunisien. Posez-moi vos questions !"

@torch.no_grad()
def analyze_image(img: Image.Image) -> dict:
    img = img.resize((512, 512)).convert("RGB")
    img_arr = np.array(img)
    inputs = seg_processor(images=img, return_tensors="pt")
    logits = seg_model(**inputs).logits
    upsampled = torch.nn.functional.interpolate(
        logits, size=(512, 512), mode="bilinear", align_corners=False
    )
    mask = upsampled.argmax(dim=1).squeeze(0).cpu().numpy()
    total = mask.size

    ratios = {grp: float(sum(int(np.sum(mask == cid)) for cid in ids)) / total
              for grp, ids in ADE_GROUPS.items()}

    img_float = img_arr.astype(np.float32) / 255.0
    brightness = float(np.mean(
        0.299 * img_float[:, :, 0] + 0.587 * img_float[:, :, 1] + 0.114 * img_float[:, :, 2]
    ))

    chips, features, bonus = [], [], 0
    if ratios["furniture"] > 0.01:
        chips.append({"label": "Living room", "color": None})
    if ratios["kitchen"] > 0.005:
        chips.append({"label": "Kitchen detected", "color": "var(--gold2)"})
        bonus += 2
    if ratios["bathroom"] > 0.005:
        chips.append({"label": "Bathroom detected", "color": None})
        bonus += 3
    if ratios["nature"] > 0.01:
        chips.append({"label": "Garden detected", "color": "var(--green-tn)"})
        bonus += 6
    if ratios["pool"] > 0.005:
        chips.append({"label": "Pool detected", "color": "var(--gold2)"})
        bonus += 8
    if ratios["window"] > 0.01:
        chips.append({"label": "Windows present", "color": None})
        bonus += 1
    if brightness > 0.35:
        chips.append({"label": "Good light", "color": None})

    if ratios["furniture"] > 0.01:
        features.append({"icon": "🛏", "label": "Bedrooms", "value": "Detected"})
    if ratios["window"] > 0.01:
        features.append({"icon": "🪟", "label": "Windows", "value": f"{round(ratios['window']*100,1)}% of space"})
    if ratios["nature"] > 0.01:
        features.append({"icon": "🌿", "label": "Garden", "value": "Yes (+6%)"})
    if ratios["kitchen"] > 0.005:
        features.append({"icon": "🍳", "label": "Kitchen", "value": "Yes (+2%)"})
    if ratios["bathroom"] > 0.005:
        features.append({"icon": "🚿", "label": "Bathroom", "value": "Yes (+3%)"})
    if ratios["pool"] > 0.005:
        features.append({"icon": "🏊", "label": "Pool", "value": "Yes (+8%)"})
    if brightness > 0.35:
        features.append({"icon": "☀️", "label": "Natural light",
                        "value": "High (+3%)" if brightness > 0.5 else "Medium"})
    if ratios["floor"] > 0.01:
        features.append({"icon": "🏠", "label": "Floor coverage", "value": f"{round(ratios['floor']*100,1)}% detected"})
    if brightness > 0.5:
        bonus += 3
    if not features:
        features.append({"icon": "❓", "label": "No features detected", "value": "Try another photo"})

    return {"chips": chips, "features": features, "estimate": f"+{bonus}%" if bonus > 0 else "0%"}

# ── ROUTES ────────────────────────────────────────────────────────────────────
@app.get("/api/")
def index():
    return {"status":"ok","gouvernorats":GOUVERNORATS}

@app.get("/api/status")
def api_status():
    return {"status":"ok","biens":len(df) if not df.empty else 0,"villes":DATASET_VILLES}

@app.get("/api/status")
def api_status():
    return {"status":"ok","biens":len(df) if not df.empty else 0,"villes":DATASET_VILLES}

@app.post("/api/recommander")
def recommander(req: RecommandRequest):
    message = req.message.strip()
    if not message: return {"response":{"text":"Message vide","biens":[]}}
    intent = detect_intent(message)
    if intent == "eval":
        return {"response":{"text":"Utilisez /api/evaluer pour l'évaluation premium","biens":[]}}
    elif intent == "rag":
        criteres       = extract_criteres(message)
        biens_df, note = rechercher_biens(criteres, 6)
        biens = []
        for _, row in biens_df.iterrows():
            biens.append({"title":str(row.get("title",""))[:60],"price":int(row["price_numeric"]),
                          "area":int(row["area_m2_numeric"]),"ville":str(row.get("ville","")),
                          "type":str(row.get("type","vente")),"property_type":str(row.get("property_type","")),
                          "bedrooms":row.get("bedrooms"),"amenities":[]})
        text = f"🔍 {note} pour '{message[:50]}'" if biens else "❌ Aucun bien trouvé. Essayez 'villa La Marsa'."
        return {"response":{"text":text,"biens":biens,"chips":[],"mode":"rag"}}
    else:
        reply = chat_response(message)
        return {"response":{"text":reply,"biens":[],"chips":[],"mode":"chat"}}

@app.post("/api/evaluer")
def evaluer(req: EvalRequest):
    desc = req.description.strip()
    if not desc: return {"error":"description manquante"}
    t = desc.lower()
    score = 50
    if any(w in t for w in ["piscine","jardin","garage"]):               score += 15
    if any(w in t for w in ["architecte","luxe","prestige","marbre"]):   score += 20
    if any(w in t for w in ["vue mer","domotique","haut de gamme"]):     score += 15
    if len(desc) > 200:                                                   score += 10
    score = min(100, score)
    if score >= 85:   cat = "🏆 EXCEPTIONNEL"
    elif score >= 70: cat = "⭐ HAUT STANDING"
    elif score >= 50: cat = "🏠 STANDARD"
    else:             cat = "🔨 À RÉNOVER"
    return {"score":score,"categorie":cat,"recommandation":"Évaluation OK"}

@app.get("/api/predict/trend")
def predict_trend(gouvernorat: str = "Tunis", horizon: int = 6):
    if gouvernorat not in arima_models:
        raise HTTPException(status_code=404, detail=f"Gouvernorat '{gouvernorat}' inconnu")
    return {"gouvernorat": gouvernorat, "horizon": horizon, "forecast": arima_models[gouvernorat].forecast(horizon).tolist()}


@app.get("/api/zones/signals")
def zone_signals():
    signals = []
    for gov, model in arima_models.items():
        forecast   = model.forecast(6)
        last_price = float(model.orig[-1])
        growth = (forecast[-1] - last_price) / last_price * 100
        signal = "buy" if growth > 4 else "sell" if growth < -2 else "wait"
        signals.append({"gouvernorat": gov, "signal": signal, "growth_pct": round(growth, 1),
                       "last_price": round(last_price), "forecast_6m": round(float(forecast[-1]))})
    return signals


@app.get("/api/zones/map")
def zones_map():
    GOV_POSITIONS = {
        "Tunis": {"top": "22%", "left": "45%"}, "Ariana": {"top": "20%", "left": "47%"},
        "Ben Arous": {"top": "26%", "left": "48%"}, "Manouba": {"top": "24%", "left": "43%"},
        "Bizerte": {"top": "18%", "left": "40%"}, "Nabeul": {"top": "32%", "left": "54%"},
        "Zaghouan": {"top": "30%", "left": "48%"}, "Monastir": {"top": "42%", "left": "55%"},
        "Sousse": {"top": "38%", "left": "52%"}, "Sfax": {"top": "58%", "left": "46%"},
    }
    zones, pins = [], []
    max_price = max(float(m.orig[-1]) for m in arima_models.values())
    for gov, model in arima_models.items():
        forecast = model.forecast(6)
        last_price = float(model.orig[-1])
        growth = (forecast[-1] - last_price) / last_price * 100
        if growth > 4:
            signal, tag, tag_class, fill, pin_type = "buy", "Buy now", "t-buy", "fill-buy", "pin-buy"
            sub = f"Prices rising · +{round(growth,1)}% expected"
        elif growth < -2:
            signal, tag, tag_class, fill, pin_type = "sell", "Sell now", "t-sell", "fill-sell", "pin-sell"
            sub = f"Peak reached · {round(growth,1)}% drop expected"
        else:
            signal, tag, tag_class, fill, pin_type = "wait", "Watch", "t-wait", "fill-wait", "pin-wait"
            sub = "Flat trend · wait for signal"
        zones.append({"city": gov, "tag": tag, "tagClass": tag_class, "price": f"{round(last_price/120):,}".replace(",", " "), "sub": sub,
                     "width": f"{round((last_price/max_price)*100)}%", "fillClass": fill, "signal": signal, "growth_pct": round(growth, 1)})
        if gov in GOV_POSITIONS:
            pins.append({"top": GOV_POSITIONS[gov]["top"], "left": GOV_POSITIONS[gov]
                        ["left"], "type": pin_type, "label": gov})
    zones.sort(key=lambda z: {"buy": 0, "wait": 1, "sell": 2}[z["signal"]])
    return {"zones": zones, "pins": pins}


@app.post("/api/estimate")
def estimate_price(req: EstimateRequest):
    row = pd.DataFrame([{
        'climatisation': req.climatisation, 'cuisine': req.cuisine,
        'nbpiece': req.rooms, 'salle_de_bain': req.salle_de_bain,
        'superficie_terrain': req.surface * 1.5, 'superficie_habitale': req.surface,
        'parking': req.parking, 'piscine': req.piscine, 'terrasse': req.terrasse,
        'ascenseur': req.ascenseur,
        'gouvernorat': GOV_ENCODE.get(req.gouvernorat, 0),
        'typeImm_regroupe': TYPE_ENCODE.get(req.type_bien, 0),
    }])[XGB_FEATURES]
    price = max(float(xgb_model.predict(row)[0]), 10_000)
    price_m2 = round(price / req.surface) if req.surface > 0 else 0
    signal_text = ""
    if req.gouvernorat in arima_models:
        model = arima_models[req.gouvernorat]
        forecast = model.forecast(6)
        last = float(model.orig[-1])
        growth = (forecast[-1] - last) / last * 100
        if growth > 4:
            signal_text = f"📈 Great time to sell — prices rising +{round(growth,1)}% expected"
        elif growth < -2:
            signal_text = f"📉 Consider waiting — prices may drop {round(growth,1)}%"
        else:
            signal_text = f"➡️ Market is stable in {req.gouvernorat}"
    return {"price": round(price), "price_low": round(price * 0.92), "price_high": round(price * 1.08), "price_m2": price_m2, "currency": "TND", "signal": signal_text, "confidence": 82}


@app.get("/api/listings")
async def get_listings():
    return [
        {"id": 1, "title": "Modern Apartment – S+3", "location": "Les Berges du Lac, Tunis", "price": 285000, "area": 120, "rooms": 4, "floor": "Floor 3", "type": "sale", "gouvernorat": "Tunis",
            "type_bien": "Appartement", "superficie_habitale": 120, "nbpiece": 4, "salle_de_bain": 2, "parking": True, "climatisation": True, "cuisine": True, "terrasse": True, "piscine": False, "ascenseur": True},
        {"id": 2, "title": "Family Villa with Garden", "location": "La Marsa, Tunis", "price": 580000, "area": 240, "rooms": 6, "floor": "Garden", "type": "sale", "gouvernorat": "Tunis",
            "type_bien": "Villa", "superficie_habitale": 240, "nbpiece": 6, "salle_de_bain": 4, "parking": True, "climatisation": True, "cuisine": True, "terrasse": True, "piscine": True, "ascenseur": False},
        {"id": 3, "title": "Bright Apartment – S+2", "location": "Sousse Ville", "price": 1200, "area": 85, "rooms": 3, "floor": "Floor 1", "type": "rent", "gouvernorat": "Sousse", "type_bien": "Appartement",
            "superficie_habitale": 85, "nbpiece": 3, "salle_de_bain": 1, "parking": False, "climatisation": False, "cuisine": False, "terrasse": False, "piscine": False, "ascenseur": False},
    ]


@app.post("/analyze-photo")
async def analyze_photo(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await image.read()
    result = analyze_image(Image.open(io.BytesIO(contents)))
    return result

@app.post("/standing")
async def standing_endpoint(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await image.read()
    
    try:
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        label = "Normal"
        confidence = 0.0

        if standing_model is not None:
            preds = standing_model.predict(img_array)
            score = float(np.max(preds[0]))
            cls = int(np.argmax(preds[0]))

            # As defined by the model: Old, Normal, luxury
            labels = ["Old", "Normal", "Luxury"]
            label = labels[cls] if cls < len(labels) else f"Class {cls}"
            confidence = score
        else:
            # Fallback for UI testing if model not present
            label = "Luxury"
            confidence = 0.92

        color_map = {
            "Luxury": "var(--gold2)",
            "Normal": "var(--green-tn)",
            "Old": "#6c757d"
        }

        feature_icons = {
            "Luxury": "✨",
            "Normal": "🏠",
            "Old": "⏳"
        }

        return {
            "status": "success",
            "standing_label": label,
            "confidence": confidence,
            "chips": [
                {"label": label, "color": color_map.get(label, "var(--gold2)")}
            ],
            "features": [
                {"icon": feature_icons.get(label, "🏢"), "label": "Classification", "value": label},
                {"icon": "🎯", "label": "Confidence", "value": f"{int(confidence * 100)}%"}
            ]
        }
    except Exception as e:
        print(f"Error processing standing model: {e}")
        return {"error": str(e), "chips": [], "features": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

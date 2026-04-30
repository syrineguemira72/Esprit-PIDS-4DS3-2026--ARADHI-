from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os

app = FastAPI(title="Classificateur de Maisons")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model(
    r"C:\Users\MSI\Desktop\projet\house_classifier_final.keras",
    compile=False,
    safe_mode=False
)

class_names = ['Luxury', 'Normal', 'Old']
IMG_SIZE = (224, 224)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img_resized = img.resize(IMG_SIZE, Image.Resampling.LANCZOS)
    img_array = np.array(img_resized, dtype=np.float32) / 255.0
    img_batch = np.expand_dims(img_array, axis=0)
    predictions = model.predict(img_batch)[0]
    best_idx = int(np.argmax(predictions))
    return JSONResponse({
        "class": class_names[best_idx],
        "confidence": float(predictions[best_idx]) * 100,
        "probabilities": {
            class_names[i]: float(predictions[i]) * 100
            for i in range(len(class_names))
        }
    })

@app.get("/")
def root():
    return FileResponse("index.html")
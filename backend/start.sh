#!/bin/bash

echo "📥 Downloading models from S3..."
aws s3 cp s3://aradhi-models/arima_models.pkl models/arima_models.pkl
aws s3 cp s3://aradhi-models/house_classifier_final.keras models/house_classifier_final.keras
aws s3 cp s3://aradhi-models/xgb_model.pkl models/xgb_model.pkl

echo "✅ Models ready, starting app..."
uvicorn app:app --host 0.0.0.0 --port 8000
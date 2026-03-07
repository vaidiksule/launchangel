#!/bin/bash

# Configuration
PROJECT_ID="glass-arcanum-442707-b3"
API_REGION="us-central1"
WEB_REGION="europe-west1"
SERVICE_NAME_BACKEND="launchangel-api"
SERVICE_NAME_FRONTEND="launchangel-frontend"

echo "🚀 Starting Manual Deployment for LaunchAngel..."

# 1. Build and Push Backend
echo "📦 Building Backend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME_BACKEND ./backend

# 2. Deploy Backend to Cloud Run
echo "🚀 Deploying Backend to Cloud Run..."
gcloud run deploy $SERVICE_NAME_BACKEND \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME_BACKEND \
    --platform managed \
    --region $API_REGION \
    --allow-unauthenticated \
    --port 8080

# 3. Build and Push Frontend
echo "📦 Building Frontend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME_FRONTEND ./frontend

# 4. Deploy Frontend to Cloud Run
echo "🚀 Deploying Frontend to Cloud Run..."
gcloud run deploy $SERVICE_NAME_FRONTEND \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME_FRONTEND \
    --platform managed \
    --region $WEB_REGION \
    --allow-unauthenticated \
    --port 8080

echo "✅ Manual Deployment Complete!"

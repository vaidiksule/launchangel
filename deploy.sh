#!/bin/bash

# Configuration
PROJECT_ID="your-project-id"
REGION="us-central1"
SERVICE_NAME_BACKEND="launchangel-api"
SERVICE_NAME_FRONTEND="launchangel-web"

echo "🚀 Starting Deployment for LaunchAngel..."

# 1. Build and Push Backend
echo "📦 Building Backend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME_BACKEND ./backend

# 2. Deploy Backend to Cloud Run
echo "🚀 Deploying Backend to Cloud Run..."
gcloud run deploy $SERVICE_NAME_BACKEND \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME_BACKEND \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars "DEBUG=False,ALLOWED_HOSTS=*"

# 3. Build and Push Frontend
# Note: Next.js needs the API URL at build time for some features
echo "📦 Building Frontend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME_FRONTEND ./frontend

# 4. Deploy Frontend to Cloud Run
echo "🚀 Deploying Frontend to Cloud Run..."
gcloud run deploy $SERVICE_NAME_FRONTEND \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME_FRONTEND \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated

echo "✅ Deployment Complete!"

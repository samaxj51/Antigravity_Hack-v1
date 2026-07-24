#!/bin/bash
# ======================================================================
# listen360 — One-Click Google Cloud Run Deployment Script
# ======================================================================
set -e

PROJECT_ID="hack-team-ctrl-hr"
REGION="us-central1"
REPO="listen360-repo"

echo "🚀 Starting deployment to Google Cloud Platform..."
echo "📦 Project: $PROJECT_ID | Region: $REGION"

# 1. Build and Push Backend Image (AMD64)
echo "--------------------------------------------------------"
echo "🔨 1/4 Building Backend container (linux/amd64)..."
docker buildx build --platform linux/amd64 -t us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/backend:v1 --load ./server

echo "📤 2/4 Pushing Backend container to Artifact Registry..."
docker push us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/backend:v1

echo "🚀 Deploying Backend service to Cloud Run..."
gcloud run deploy listen360-backend \
  --image us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/backend:v1 \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 5001 \
  --add-cloudsql-instances ${PROJECT_ID}:${REGION}:listen360-db \
  --set-env-vars DB_HOST=/cloudsql/${PROJECT_ID}:${REGION}:listen360-db,DB_PORT=5432,DB_USER=postgres,DB_PASS=Jeetgaye@hackathon,DB_NAME=listen360,JWT_SECRET=supersecretjwtkeyforhackathonlisten360,GCP_PROJECT_ID=${PROJECT_ID},GCP_LOCATION=${REGION},GEMINI_API_KEY=AIzaSyD_TmnElvQBVSaGtXRkvBknsUF_s-7WJdU

BACKEND_URL=$(gcloud run services describe listen360-backend --platform managed --region ${REGION} --format 'value(status.url)')
echo "✅ Backend deployed at: ${BACKEND_URL}"

# 2. Update Frontend Nginx proxy URL with Backend URL
sed -i '' "s|proxy_pass https://.*\.run\.app/api/;|proxy_pass ${BACKEND_URL}/api/;|g" nginx.cloudrun.conf

# 3. Build and Push Frontend Image (AMD64)
echo "--------------------------------------------------------"
echo "🔨 3/4 Building Frontend container (linux/amd64)..."
docker buildx build --platform linux/amd64 -f Dockerfile.cloudrun -t us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/frontend:v1 --load .

echo "📤 4/4 Pushing Frontend container to Artifact Registry..."
docker push us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/frontend:v1

echo "🚀 Deploying Frontend service to Cloud Run..."
gcloud run deploy listen360-frontend \
  --image us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/frontend:v1 \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 80

FRONTEND_URL=$(gcloud run services describe listen360-frontend --platform managed --region ${REGION} --format 'value(status.url)')

echo "========================================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "🌐 Live App:    ${FRONTEND_URL}"
echo "🔌 API Gateway: ${BACKEND_URL}/api/health"
echo "========================================================"

#!/bin/bash

# Exit on error
set -e

# Configuration
PROJECT_NAME="followly"
REGISTRY_NAMESPACE="followly"
REGISTRY_URL="rg.nl-ams.scw.cloud"
PLATFORM="linux/amd64"

# Generate unique tag based on timestamp and git commit (if available)
TIMESTAMP=$(date +%Y%m%d%H%M%S)
GIT_HASH=""

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  GIT_HASH="-$(git rev-parse --short HEAD)"
fi

IMAGE_TAG="${TIMESTAMP}${GIT_HASH}"
LATEST_TAG="latest"

# Full image names with registry
FULL_IMAGE_NAME="${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${PROJECT_NAME}:${IMAGE_TAG}"
LATEST_IMAGE_NAME="${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${PROJECT_NAME}:${LATEST_TAG}"

echo "Building Docker image for platform ${PLATFORM}..."
docker build --platform=${PLATFORM} -t $PROJECT_NAME .

echo "Tagging image with unique tag: ${IMAGE_TAG}"
docker tag $PROJECT_NAME $FULL_IMAGE_NAME

echo "Tagging image as latest..."
docker tag $PROJECT_NAME $LATEST_IMAGE_NAME

echo "Logging in to Scaleway Container Registry..."
docker login $REGISTRY_URL -u nologin --password-stdin < ~/.scw/secret_key

echo "Pushing image with unique tag to Scaleway Container Registry..."
docker push $FULL_IMAGE_NAME

echo "Pushing image with latest tag to Scaleway Container Registry..."
docker push $LATEST_IMAGE_NAME

echo "Done! Image pushed to:"
echo "- ${FULL_IMAGE_NAME}"
echo "- ${LATEST_IMAGE_NAME}"

# Optional: Deploy to your compute instance
# echo "Deploying to compute instance..."
# ssh user@your-instance "docker pull ${LATEST_IMAGE_NAME} && docker stop ${PROJECT_NAME} || true && docker rm ${PROJECT_NAME} || true && docker run -d -p 3000:3000 --name ${PROJECT_NAME} ${LATEST_IMAGE_NAME}"

echo "Process completed successfully!"
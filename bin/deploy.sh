#!/bin/bash

# CONFIGURATION
BUCKET_NAME="followly-www"
REGION="nl-ams"  # or nl-ams, pl-waw
ENDPOINT_URL="https://s3.$REGION.scw.cloud"
BUILD_DIR="out"
S3_PATH=""
PROFILE="scaleway"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "Build directory '$BUILD_DIR' does not exist. Did you run 'sanity build'?"
  exit 1
fi

echo "⚠️ Clearing existing contents at 's3://$BUCKET_NAME'..."
aws s3 rm "s3://$BUCKET_NAME" \
  --profile "$PROFILE" \
  --endpoint-url "$ENDPOINT_URL" \
  --region "$REGION" \
  --recursive

echo "Uploading contents of '$BUILD_DIR' to 's3://$BUCKET_NAME/$S3_PATH' via Scaleway..."

aws s3 sync "$BUILD_DIR/" "s3://$BUCKET_NAME/$S3_PATH" \
  --profile "$PROFILE" \
  --endpoint-url "$ENDPOINT_URL" \
  --region "$REGION" \
  --acl public-read \
  --delete

if [ $? -eq 0 ]; then
  echo "✅ Upload completed successfully to Scaleway."
else
  echo "❌ Upload failed."
  exit 1
fi
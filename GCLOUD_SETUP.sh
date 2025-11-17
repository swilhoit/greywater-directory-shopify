#!/bin/bash

# ============================================================================
# Google Cloud Setup Script for Greywater Directory API
# ============================================================================
# This script creates a service account with BigQuery access and generates
# credentials for your Vercel deployment.
#
# Prerequisites:
# - gcloud CLI installed (https://cloud.google.com/sdk/docs/install)
# - Authenticated with gcloud (run: gcloud auth login)
# - Proper permissions in the GCP project
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="greywater-prospects-2025"
SERVICE_ACCOUNT_NAME="greywater-api-service"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="./greywater-api-key.json"
DATASET_ID="greywater_compliance"

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Greywater Directory - Google Cloud Setup${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Step 1: Set the active project
echo -e "${YELLOW}Step 1: Setting active GCP project...${NC}"
gcloud config set project ${PROJECT_ID}
echo -e "${GREEN}✓ Project set to: ${PROJECT_ID}${NC}"
echo ""

# Step 2: Enable required APIs (if not already enabled)
echo -e "${YELLOW}Step 2: Enabling BigQuery API...${NC}"
gcloud services enable bigquery.googleapis.com
echo -e "${GREEN}✓ BigQuery API enabled${NC}"
echo ""

# Step 3: Create service account (or use existing)
echo -e "${YELLOW}Step 3: Creating service account...${NC}"
if gcloud iam service-accounts describe ${SERVICE_ACCOUNT_EMAIL} &>/dev/null; then
    echo -e "${YELLOW}  Service account already exists: ${SERVICE_ACCOUNT_EMAIL}${NC}"
else
    gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
        --display-name="Greywater Directory API Service Account" \
        --description="Service account for accessing BigQuery from Vercel API endpoints"
    echo -e "${GREEN}✓ Service account created: ${SERVICE_ACCOUNT_EMAIL}${NC}"
fi
echo ""

# Step 4: Grant BigQuery permissions
echo -e "${YELLOW}Step 4: Granting BigQuery permissions...${NC}"

# Grant BigQuery Data Viewer role (read access to data)
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/bigquery.dataViewer" \
    --condition=None

# Grant BigQuery Job User role (ability to run queries)
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/bigquery.jobUser" \
    --condition=None

echo -e "${GREEN}✓ Permissions granted:${NC}"
echo -e "  - bigquery.dataViewer (read data)"
echo -e "  - bigquery.jobUser (run queries)"
echo ""

# Step 5: Create and download service account key
echo -e "${YELLOW}Step 5: Creating service account key...${NC}"
if [ -f "${KEY_FILE}" ]; then
    echo -e "${YELLOW}  Key file already exists. Creating backup...${NC}"
    mv ${KEY_FILE} ${KEY_FILE}.backup.$(date +%s)
fi

gcloud iam service-accounts keys create ${KEY_FILE} \
    --iam-account=${SERVICE_ACCOUNT_EMAIL}

echo -e "${GREEN}✓ Service account key created: ${KEY_FILE}${NC}"
echo ""

# Step 6: Display the credentials (for Vercel)
echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo -e "1. ${BLUE}Add Environment Variables to Vercel:${NC}"
echo ""
echo -e "   Go to: ${BLUE}https://vercel.com/your-org/your-project/settings/environment-variables${NC}"
echo ""
echo -e "   Add these three variables:"
echo ""
echo -e "   ${GREEN}BIGQUERY_PROJECT_ID${NC}"
echo -e "   Value: ${PROJECT_ID}"
echo ""
echo -e "   ${GREEN}BIGQUERY_DATASET_ID${NC}"
echo -e "   Value: ${DATASET_ID}"
echo ""
echo -e "   ${GREEN}BIGQUERY_CREDENTIALS${NC}"
echo -e "   Value: (See below - copy the entire minified JSON)"
echo ""

# Display minified JSON
echo -e "${YELLOW}2. Copy this minified JSON for BIGQUERY_CREDENTIALS:${NC}"
echo ""
echo -e "${BLUE}--- COPY BELOW THIS LINE ---${NC}"
cat ${KEY_FILE} | jq -c .
echo -e "${BLUE}--- COPY ABOVE THIS LINE ---${NC}"
echo ""

# Step 7: Test connection (optional)
echo -e "${YELLOW}3. Test the connection locally (optional):${NC}"
echo ""
echo "   Create a .env file with:"
echo ""
echo "   BIGQUERY_PROJECT_ID=${PROJECT_ID}"
echo "   BIGQUERY_DATASET_ID=${DATASET_ID}"
echo "   BIGQUERY_KEY_FILE=${KEY_FILE}"
echo ""
echo "   Then run: npm run bigquery:test"
echo ""

# Step 8: Security reminder
echo -e "${RED}⚠️  SECURITY REMINDERS:${NC}"
echo ""
echo -e "  • ${KEY_FILE} contains sensitive credentials - keep it secure!"
echo -e "  • Add ${KEY_FILE} to .gitignore (already done if using template)"
echo -e "  • Never commit this file to version control"
echo -e "  • Store credentials securely in Vercel environment variables"
echo ""

# Step 9: Deploy instructions
echo -e "${YELLOW}4. Deploy to Vercel:${NC}"
echo ""
echo "   git add ."
echo "   git commit -m \"Add hierarchy API endpoint with BigQuery integration\""
echo "   git push"
echo ""
echo -e "${GREEN}Done! Your 500 errors will be fixed once deployed.${NC}"
echo ""

# Optional: Create .env file automatically
read -p "Create .env file automatically for local testing? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > .env << EOF
# BigQuery Configuration (Generated by GCLOUD_SETUP.sh)
BIGQUERY_PROJECT_ID=${PROJECT_ID}
BIGQUERY_DATASET_ID=${DATASET_ID}
BIGQUERY_KEY_FILE=${KEY_FILE}

# Node Environment
NODE_ENV=development
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
    echo ""
fi

echo -e "${BLUE}============================================================================${NC}"
echo -e "  For detailed documentation, see: DEPLOYMENT_GUIDE.md"
echo -e "${BLUE}============================================================================${NC}"


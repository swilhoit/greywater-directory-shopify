#!/bin/bash

# ============================================================================
# Vercel Environment Variables Setup Script
# ============================================================================
# This script configures environment variables in Vercel using the CLI
# Run this AFTER completing GCLOUD_SETUP.sh
#
# Prerequisites:
# - Vercel CLI installed (npm i -g vercel)
# - Authenticated with Vercel (run: vercel login)
# - Service account key file exists (greywater-api-key.json)
# ============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_ID="greywater-prospects-2025"
DATASET_ID="greywater_compliance"
KEY_FILE="./greywater-api-key.json"

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Vercel Environment Variables Setup${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}✗ Vercel CLI not found${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Vercel CLI found${NC}"
echo ""

# Check if key file exists
if [ ! -f "${KEY_FILE}" ]; then
    echo -e "${RED}✗ Key file not found: ${KEY_FILE}${NC}"
    echo ""
    echo "Run GCLOUD_SETUP.sh first to generate the service account key."
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Key file found: ${KEY_FILE}${NC}"
echo ""

# Check if user is logged in to Vercel
echo -e "${YELLOW}Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Vercel. Logging in...${NC}"
    vercel login
fi

echo -e "${GREEN}✓ Authenticated with Vercel${NC}"
echo ""

# Link to Vercel project (if not already linked)
echo -e "${YELLOW}Linking to Vercel project...${NC}"
if [ ! -f ".vercel/project.json" ]; then
    echo "Follow the prompts to link your project:"
    vercel link
else
    echo -e "${GREEN}✓ Project already linked${NC}"
fi
echo ""

# Prepare credentials JSON (minified)
echo -e "${YELLOW}Preparing credentials...${NC}"
CREDENTIALS_JSON=$(cat ${KEY_FILE} | jq -c .)
echo -e "${GREEN}✓ Credentials prepared${NC}"
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local var_value=$2
    local var_description=$3
    
    echo -e "${YELLOW}Setting ${var_name}...${NC}"
    
    # Create temporary file with the value
    echo -n "${var_value}" > /tmp/vercel_env_value
    
    # Add to Production
    cat /tmp/vercel_env_value | vercel env add ${var_name} production
    
    # Add to Preview
    cat /tmp/vercel_env_value | vercel env add ${var_name} preview
    
    # Add to Development
    cat /tmp/vercel_env_value | vercel env add ${var_name} development
    
    # Clean up
    rm /tmp/vercel_env_value
    
    echo -e "${GREEN}✓ ${var_name} set for all environments${NC}"
    echo ""
}

# Set environment variables
echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Adding Environment Variables to Vercel${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

echo "This will add variables to Production, Preview, and Development environments."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi
echo ""

# Add BIGQUERY_PROJECT_ID
echo -e "${YELLOW}1/3: Adding BIGQUERY_PROJECT_ID...${NC}"
echo "${PROJECT_ID}" | vercel env add BIGQUERY_PROJECT_ID production || true
echo "${PROJECT_ID}" | vercel env add BIGQUERY_PROJECT_ID preview || true
echo "${PROJECT_ID}" | vercel env add BIGQUERY_PROJECT_ID development || true
echo -e "${GREEN}✓ BIGQUERY_PROJECT_ID set${NC}"
echo ""

# Add BIGQUERY_DATASET_ID
echo -e "${YELLOW}2/3: Adding BIGQUERY_DATASET_ID...${NC}"
echo "${DATASET_ID}" | vercel env add BIGQUERY_DATASET_ID production || true
echo "${DATASET_ID}" | vercel env add BIGQUERY_DATASET_ID preview || true
echo "${DATASET_ID}" | vercel env add BIGQUERY_DATASET_ID development || true
echo -e "${GREEN}✓ BIGQUERY_DATASET_ID set${NC}"
echo ""

# Add BIGQUERY_CREDENTIALS
echo -e "${YELLOW}3/3: Adding BIGQUERY_CREDENTIALS...${NC}"
echo "${CREDENTIALS_JSON}" | vercel env add BIGQUERY_CREDENTIALS production || true
echo "${CREDENTIALS_JSON}" | vercel env add BIGQUERY_CREDENTIALS preview || true
echo "${CREDENTIALS_JSON}" | vercel env add BIGQUERY_CREDENTIALS development || true
echo -e "${GREEN}✓ BIGQUERY_CREDENTIALS set${NC}"
echo ""

# Verify
echo -e "${BLUE}============================================================================${NC}"
echo -e "${YELLOW}Verifying environment variables...${NC}"
vercel env ls
echo ""

# Pull for local development
echo -e "${YELLOW}Pulling environment variables for local development...${NC}"
vercel env pull .env.local
echo -e "${GREEN}✓ Environment variables saved to .env.local${NC}"
echo ""

# Success
echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Deploy to Vercel:"
echo "   ${BLUE}git add .${NC}"
echo "   ${BLUE}git commit -m \"Add hierarchy API endpoint\"${NC}"
echo "   ${BLUE}git push${NC}"
echo ""
echo "   Or deploy directly:"
echo "   ${BLUE}vercel --prod${NC}"
echo ""
echo "2. Test the API endpoints:"
echo "   ${BLUE}curl \"https://your-domain.vercel.app/api/greywater-directory/hierarchy?level=states\"${NC}"
echo ""
echo "3. Check your browser - the 500 errors should be gone! ✅"
echo ""
echo -e "${BLUE}============================================================================${NC}"
echo ""


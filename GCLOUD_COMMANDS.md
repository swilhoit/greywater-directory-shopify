# Google Cloud CLI Commands - Quick Reference

## 🚀 Quick Start (Automated)

Run the automated setup script:

```bash
chmod +x GCLOUD_SETUP.sh
./GCLOUD_SETUP.sh
```

The script will:
- ✅ Create a service account
- ✅ Grant BigQuery permissions
- ✅ Generate credentials JSON
- ✅ Display formatted credentials for Vercel
- ✅ Optionally create .env file for local testing

---

## 📋 Manual Commands (Step by Step)

If you prefer to run commands manually, follow these steps:

### Step 1: Authenticate and Set Project

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project greywater-prospects-2025

# Verify current project
gcloud config get-value project
```

### Step 2: Enable BigQuery API

```bash
# Enable BigQuery API (if not already enabled)
gcloud services enable bigquery.googleapis.com

# Verify it's enabled
gcloud services list --enabled | grep bigquery
```

### Step 3: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create greywater-api-service \
  --display-name="Greywater Directory API" \
  --description="Service account for Vercel API to access BigQuery"

# Verify creation
gcloud iam service-accounts list | grep greywater-api-service
```

### Step 4: Grant BigQuery Permissions

```bash
# Grant BigQuery Data Viewer role (read data)
gcloud projects add-iam-policy-binding greywater-prospects-2025 \
  --member="serviceAccount:greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

# Grant BigQuery Job User role (run queries)
gcloud projects add-iam-policy-binding greywater-prospects-2025 \
  --member="serviceAccount:greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser"

# Verify permissions
gcloud projects get-iam-policy greywater-prospects-2025 \
  --flatten="bindings[].members" \
  --filter="bindings.members:greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com"
```

### Step 5: Create and Download Key

```bash
# Create key file
gcloud iam service-accounts keys create greywater-api-key.json \
  --iam-account=greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com

# View the key (formatted)
cat greywater-api-key.json | jq .

# Minify for Vercel (copy this entire output)
cat greywater-api-key.json | jq -c .
```

### Step 6: Set Up Vercel Environment Variables

#### Option A: Via Vercel Dashboard

1. Go to: https://vercel.com/your-org/your-project/settings/environment-variables
2. Add these three variables:

```
BIGQUERY_PROJECT_ID
greywater-prospects-2025

BIGQUERY_DATASET_ID
greywater_compliance

BIGQUERY_CREDENTIALS
<paste minified JSON from step 5>
```

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Set environment variables
vercel env add BIGQUERY_PROJECT_ID
# When prompted, enter: greywater-prospects-2025

vercel env add BIGQUERY_DATASET_ID
# When prompted, enter: greywater_compliance

vercel env add BIGQUERY_CREDENTIALS
# When prompted, paste the minified JSON

# Select environments: Production, Preview, and Development
```

---

## 🧪 Testing

### Test BigQuery Connection Locally

```bash
# Create .env file
cat > .env << EOF
BIGQUERY_PROJECT_ID=greywater-prospects-2025
BIGQUERY_DATASET_ID=greywater_compliance
BIGQUERY_KEY_FILE=./greywater-api-key.json
NODE_ENV=development
EOF

# Test the connection
npm run bigquery:test

# Test the laws library
npm run laws:overview
```

### Test API Locally

```bash
# Run Vercel dev server
vercel dev

# In another terminal, test the endpoints
curl "http://localhost:3000/api/greywater-directory/hierarchy?level=states"
curl "http://localhost:3000/api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE"
curl "http://localhost:3000/api/greywater-directory/hierarchy?level=cities&parentId=CA_STATE&parentType=state"
```

---

## 🚢 Deploy

```bash
# Add all files
git add .

# Commit changes
git commit -m "Add hierarchy API endpoint with BigQuery integration"

# Push to repository (triggers Vercel deployment if connected)
git push

# Or deploy directly with Vercel CLI
vercel --prod
```

---

## 🔍 Verify Deployment

### Check Vercel Deployment

```bash
# Get deployment URL
vercel ls

# Test the deployed API
curl "https://your-domain.vercel.app/api/greywater-directory/hierarchy?level=states"
```

### Check in Browser

Open your application and check the browser console. You should see:

```
✅ GET /api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE 200
✅ GET /api/greywater-directory/hierarchy?level=cities&parentId=CA_STATE&parentType=state 200
```

---

## 🛠️ Troubleshooting Commands

### Check Service Account Permissions

```bash
# List all IAM policies for your service account
gcloud projects get-iam-policy greywater-prospects-2025 \
  --flatten="bindings[].members" \
  --filter="bindings.members:greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com" \
  --format="table(bindings.role)"
```

### List Service Account Keys

```bash
# List all keys for the service account
gcloud iam service-accounts keys list \
  --iam-account=greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com
```

### Test BigQuery Access

```bash
# Test query access
bq query --use_legacy_sql=false \
  'SELECT COUNT(*) as total FROM `greywater-prospects-2025.greywater_compliance.jurisdictions_master`'

# List tables in dataset
bq ls greywater-prospects-2025:greywater_compliance
```

### Delete and Recreate (if needed)

```bash
# Delete service account key
gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com

# Delete service account (be careful!)
gcloud iam service-accounts delete \
  greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com
```

---

## 📚 Additional Resources

### Check Vercel Environment Variables

```bash
# List all environment variables
vercel env ls

# Pull environment variables for local development
vercel env pull
```

### View Vercel Logs

```bash
# View function logs
vercel logs

# View logs for specific deployment
vercel logs <deployment-url>
```

### BigQuery Quotas

```bash
# Check BigQuery quotas
gcloud alpha quotas list \
  --service=bigquery.googleapis.com \
  --project=greywater-prospects-2025
```

---

## 🔐 Security Best Practices

### After Setup

1. **Secure the key file:**
   ```bash
   chmod 600 greywater-api-key.json
   ```

2. **Verify .gitignore:**
   ```bash
   grep "greywater-api-key.json" .gitignore || echo "greywater-api-key.json" >> .gitignore
   grep "*.json" .gitignore || echo "*.json" >> .gitignore
   ```

3. **Rotate keys regularly:**
   ```bash
   # Create new key
   gcloud iam service-accounts keys create greywater-api-key-new.json \
     --iam-account=greywater-api-service@greywater-prospects-2025.iam.gserviceaccount.com
   
   # Update Vercel with new key
   # Then delete old key
   ```

---

## 🎯 Quick Commands Summary

```bash
# Complete setup in one go
chmod +x GCLOUD_SETUP.sh && ./GCLOUD_SETUP.sh

# Test locally
vercel dev

# Deploy
git push  # or: vercel --prod

# View logs
vercel logs
```

---

**Need Help?** Check the troubleshooting section in `DEPLOYMENT_GUIDE.md`


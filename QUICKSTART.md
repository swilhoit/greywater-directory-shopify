# 🚀 Quick Start - Fix 500 Errors in 3 Steps

This guide will help you fix the 500 Internal Server Errors using automated scripts.

---

## ⚡ Super Quick Setup (3 Commands)

```bash
# Step 1: Set up Google Cloud service account and permissions
./GCLOUD_SETUP.sh

# Step 2: Configure Vercel environment variables
./SETUP_VERCEL_ENV.sh

# Step 3: Deploy
git add . && git commit -m "Add hierarchy API" && git push
```

**That's it!** Your 500 errors will be fixed. ✅

---

## 📋 Detailed Walkthrough

### Prerequisites

Make sure you have these installed:

```bash
# Check gcloud CLI
gcloud --version

# Check Vercel CLI
vercel --version

# Check Node.js
node --version

# Install if missing:
# gcloud: https://cloud.google.com/sdk/docs/install
# vercel: npm install -g vercel
# node: https://nodejs.org/
```

### Step 1: Google Cloud Setup (2 minutes)

This creates a service account with BigQuery access:

```bash
./GCLOUD_SETUP.sh
```

**What it does:**
- ✅ Creates service account `greywater-api-service`
- ✅ Grants BigQuery read permissions
- ✅ Generates credentials file `greywater-api-key.json`
- ✅ Displays formatted credentials for Vercel
- ✅ Creates `.env` file for local testing (optional)

**Output:** You'll see green checkmarks for each step completed.

### Step 2: Vercel Environment Setup (1 minute)

This adds your credentials to Vercel:

```bash
./SETUP_VERCEL_ENV.sh
```

**What it does:**
- ✅ Links to your Vercel project
- ✅ Adds `BIGQUERY_PROJECT_ID` to all environments
- ✅ Adds `BIGQUERY_DATASET_ID` to all environments
- ✅ Adds `BIGQUERY_CREDENTIALS` to all environments
- ✅ Pulls variables for local development

**Output:** You'll see all environment variables listed and confirmed.

### Step 3: Deploy (30 seconds)

Deploy your changes to Vercel:

```bash
git add .
git commit -m "Add hierarchy API endpoint with BigQuery integration"
git push
```

Or deploy directly with Vercel CLI:

```bash
vercel --prod
```

**Done!** 🎉

---

## ✅ Verify It Works

### Test the API

Once deployed, test these endpoints:

```bash
# Replace 'your-domain' with your actual Vercel URL
BASE_URL="https://your-domain.vercel.app"

# Test states
curl "${BASE_URL}/api/greywater-directory/hierarchy?level=states"

# Test counties
curl "${BASE_URL}/api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE"

# Test cities
curl "${BASE_URL}/api/greywater-directory/hierarchy?level=cities&parentId=CA_STATE&parentType=state"
```

**Expected:** Each should return `200 OK` with JSON data.

### Check Your Browser

Open your application and check the browser console:

**Before:** ❌
```
GET /api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE 500 (Internal Server Error)
```

**After:** ✅
```
GET /api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE 200
```

---

## 🧪 Test Locally First (Optional)

Before deploying, test everything locally:

```bash
# Run local dev server
vercel dev

# In another terminal, test endpoints
curl "http://localhost:3000/api/greywater-directory/hierarchy?level=states"
curl "http://localhost:3000/api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE"
curl "http://localhost:3000/api/greywater-directory/hierarchy?level=cities&parentId=CA_STATE&parentType=state"
```

---

## 🛠️ Manual Setup (If You Prefer)

Don't want to use scripts? Follow the manual commands in:

📄 **`GCLOUD_COMMANDS.md`** - All gcloud commands step by step

---

## 📚 Full Documentation

For detailed information, see:

| File | Description |
|------|-------------|
| `QUICKSTART.md` | This file - quick automated setup |
| `GCLOUD_COMMANDS.md` | Manual gcloud CLI commands |
| `DEPLOYMENT_GUIDE.md` | Complete deployment guide with troubleshooting |
| `FIX_SUMMARY.md` | Overview of what was fixed |
| `api/greywater-directory/README.md` | API endpoint documentation |

---

## ❓ Troubleshooting

### Script Permission Error

```bash
chmod +x GCLOUD_SETUP.sh SETUP_VERCEL_ENV.sh
```

### "gcloud command not found"

Install Google Cloud SDK:
- **Mac:** `brew install google-cloud-sdk`
- **Linux/Windows:** https://cloud.google.com/sdk/docs/install

### "vercel command not found"

```bash
npm install -g vercel
```

### "Permission denied on BigQuery"

Re-run the gcloud setup script:
```bash
./GCLOUD_SETUP.sh
```

### Still Getting 500 Errors?

1. **Check Vercel environment variables:**
   ```bash
   vercel env ls
   ```
   
2. **Check Vercel logs:**
   ```bash
   vercel logs
   ```

3. **Verify BigQuery access:**
   ```bash
   bq query --use_legacy_sql=false \
     'SELECT COUNT(*) FROM `greywater-prospects-2025.greywater_compliance.jurisdictions_master`'
   ```

4. **Check detailed guides:**
   - `DEPLOYMENT_GUIDE.md` - Troubleshooting section
   - `GCLOUD_COMMANDS.md` - Troubleshooting commands

---

## 🎯 What Was Fixed?

Your frontend was calling these API endpoints:
- `/api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE`
- `/api/greywater-directory/hierarchy?level=cities&parentId=CA_STATE`

But they didn't exist, causing **500 Internal Server Errors**.

**Solution:** Created a fully functional API endpoint that:
- ✅ Connects to your BigQuery database
- ✅ Fetches hierarchical data (states → counties → cities)
- ✅ Returns formatted JSON responses
- ✅ Includes proper error handling
- ✅ Supports CORS for cross-origin requests

---

## 🔒 Security Notes

The setup scripts:
- ✅ Create minimal permission service account
- ✅ Store credentials securely in Vercel
- ✅ Add key file to `.gitignore`
- ✅ Generate separate keys for each environment

**Never commit `greywater-api-key.json` to version control!**

---

## 🚀 Next Steps After Setup

1. ✅ Verify the 500 errors are gone
2. ✅ Test all hierarchy levels (states, counties, cities)
3. ✅ Monitor Vercel function usage
4. ✅ Consider adding caching for frequently accessed data
5. ✅ Expand to support more hierarchy levels (water districts, etc.)

---

## 💬 Need Help?

Check these resources:
- **Quick Commands:** `GCLOUD_COMMANDS.md`
- **Full Guide:** `DEPLOYMENT_GUIDE.md`
- **API Docs:** `api/greywater-directory/README.md`
- **Vercel Logs:** `vercel logs`

---

**Status:** ✅ Ready to Deploy

Run the scripts, deploy, and your 500 errors will be history! 🎉


# Deployment Guide - Fixing 500 Errors

## What Was Fixed

The 500 Internal Server Errors were occurring because the API endpoint `/api/greywater-directory/hierarchy` didn't exist. I've created:

1. ✅ **API Endpoint**: `/api/greywater-directory/hierarchy.js`
   - Handles requests for states, counties, and cities
   - Queries BigQuery for greywater compliance data
   - Returns properly formatted JSON responses

2. ✅ **Vercel Configuration**: `vercel.json`
   - Configured to properly route API requests
   - Set up Node.js runtime for serverless functions

3. ✅ **Documentation**: `api/greywater-directory/README.md`
   - Complete API documentation
   - Usage examples for all endpoints
   - Data schema reference

## Deployment Steps

### 1. Set Up Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

**Required Variables:**

```
BIGQUERY_PROJECT_ID=greywater-prospects-2025
BIGQUERY_DATASET_ID=greywater_compliance
BIGQUERY_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"..."}
```

**To get your BIGQUERY_CREDENTIALS:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to IAM & Admin → Service Accounts
3. Create or select a service account with BigQuery access
4. Create a JSON key
5. Copy the entire JSON content and paste it as the value for `BIGQUERY_CREDENTIALS`

**Important:** The credentials JSON must be on a single line in Vercel. You can minify it first.

### 2. Deploy to Vercel

**Option A: Deploy from Git (Recommended)**

If your repository is connected to Vercel:

```bash
git add .
git commit -m "Add hierarchy API endpoint to fix 500 errors"
git push
```

Vercel will automatically deploy.

**Option B: Deploy via Vercel CLI**

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Test the Endpoints

Once deployed, test these URLs (replace `your-domain` with your actual Vercel domain):

```bash
# Test states
curl "https://your-domain.vercel.app/api/greywater-directory/hierarchy?level=states"

# Test counties for California
curl "https://your-domain.vercel.app/api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE"

# Test cities for California
curl "https://your-domain.vercel.app/api/greywater-directory/hierarchy?level=cities&parentId=CA_STATE&parentType=state"
```

### 4. Verify in Browser

Open your application and check the browser console. The 500 errors should now be resolved and you should see successful responses:

```
GET https://greywater-website.vercel.app/api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE
Status: 200 OK ✅

GET https://greywater-website.vercel.app/api/greywater-directory/hierarchy?level=cities&parentId=CA_STATE&parentType=state
Status: 200 OK ✅
```

## Troubleshooting

### Still Getting 500 Errors?

1. **Check Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify all three variables are set correctly
   - Make sure `BIGQUERY_CREDENTIALS` is valid JSON

2. **Check Vercel Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Check the Function Logs for error details

3. **Verify BigQuery Permissions**
   - Ensure your service account has `BigQuery Data Viewer` and `BigQuery Job User` roles
   - Test the connection by running: `npm run bigquery:test` locally

### Common Issues

**Issue: "Cannot find module '@google-cloud/bigquery'"**
- Solution: Make sure dependencies are installed in Vercel
- Check that `package.json` includes `@google-cloud/bigquery`

**Issue: "Permission denied on BigQuery"**
- Solution: Grant proper roles to your service account:
  ```bash
  gcloud projects add-iam-policy-binding greywater-prospects-2025 \
    --member="serviceAccount:your-sa@project.iam.gserviceaccount.com" \
    --role="roles/bigquery.dataViewer"
  ```

**Issue: "Invalid credentials"**
- Solution: Regenerate your service account key JSON and update in Vercel

## Local Development

To test locally before deploying:

1. Create a `.env` file (use `.env.example` as template):
   ```env
   BIGQUERY_PROJECT_ID=greywater-prospects-2025
   BIGQUERY_DATASET_ID=greywater_compliance
   BIGQUERY_CREDENTIALS={"type":"service_account",...}
   ```

2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

3. Run locally:
   ```bash
   vercel dev
   ```

4. Test the endpoint:
   ```bash
   curl "http://localhost:3000/api/greywater-directory/hierarchy?level=states"
   ```

## API Usage in Frontend

Update your frontend code to handle the responses properly:

```javascript
// Fetch counties
const fetchCounties = async (stateId) => {
  try {
    const response = await fetch(
      `/api/greywater-directory/hierarchy?level=counties&parentId=${stateId}`
    );
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('API Error:', result.error);
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

// Fetch cities
const fetchCities = async (stateId) => {
  try {
    const response = await fetch(
      `/api/greywater-directory/hierarchy?level=cities&parentId=${stateId}&parentType=state`
    );
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('API Error:', result.error);
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};
```

## Next Steps

1. ✅ Deploy the updated code to Vercel
2. ✅ Configure environment variables
3. ✅ Test all three hierarchy levels (states, counties, cities)
4. ✅ Monitor Vercel logs for any issues
5. ✅ Implement caching if you experience rate limiting

## Questions?

If you continue to experience issues:
- Check the detailed API documentation in `api/greywater-directory/README.md`
- Review Vercel function logs
- Verify BigQuery access and quotas in Google Cloud Console


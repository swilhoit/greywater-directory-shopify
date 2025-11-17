# BigQuery Greywater Database Guide

## Connection Details

**Project:** `greywater-prospects-2025`
**Authentication:** Application Default Credentials (gcloud)

## Available Datasets

### 1. `prospects_data` - Business Prospects (11 tables)
Lead generation and business intelligence data.

**Key Tables:**
- `austin_prospects` - Property management and hospitality businesses in Austin
- `california_businesses` - CA business prospects
- `california_hospitality_unified_final` - Unified hospitality data
- `enriched_contacts` - Contact information with email/phone
- `outreach_view` - Sales outreach tracking

### 2. `greywater_compliance` - Laws & Regulations (50+ tables)
Comprehensive greywater laws, regulations, and compliance requirements.

**Key Tables:**
- `jurisdictions_master` - 602 jurisdictions (529 cities, 47 water districts, 7 counties, 3 states)
- `regulations_master` - 23 greywater regulations across jurisdictions
- `permits_master` - 20 permit requirements
- `incentive_programs` - Financial incentives and rebates
- `program_relationships` - Program hierarchies and stacking

**Coverage:**
- California: 579 jurisdictions (most comprehensive)
- Texas: 12 jurisdictions
- Arizona: 11 jurisdictions

### 3. `geography` - Geographic Data (15 tables)
Water districts, cities, counties, and spatial relationships.

**Key Tables:**
- `water_districts` - Water district boundaries and information
- `cities` - City data with coordinates
- `counties` - County-level data
- `city_county_mapping` - Relationships between cities and counties

## Usage

### Test Connection
```bash
npm run bigquery:test
```

### Query Laws Database
```bash
# Show overview
npm run laws:overview

# Search specific location
npm run laws:search Austin TX
npm run laws:search "Los Angeles" CA
```

### Programmatic Usage

#### Basic BigQuery Client
```javascript
import greywaterBQ from './lib/bigquery.js';

// List all tables
const tables = await greywaterBQ.listTables();

// Query a table
const prospects = await greywaterBQ.queryTable('austin_prospects', {
  where: 'Priority_Score > 90',
  orderBy: 'Priority_Score DESC',
  limit: 10
});

// Custom SQL query
const results = await greywaterBQ.query(`
  SELECT Name, Domain, City, Priority_Score
  FROM \`greywater-prospects-2025.prospects_data.austin_prospects\`
  WHERE Rating_Value > 4.5
  LIMIT 20
`);
```

#### Greywater Laws Helper
```javascript
import greywaterLaws from './lib/greywater-laws.js';

// Get jurisdictions
const cities = await greywaterLaws.getJurisdictions({
  state: 'CA',
  type: 'city',
  limit: 50
});

// Get regulations for a jurisdiction
const regulations = await greywaterLaws.getRegulations({
  state: 'CA',
  status: 'active'
});

// Get complete location info (jurisdiction + regulations + permits)
const info = await greywaterLaws.getLocationInfo('Los Angeles', 'CA');

// Search jurisdictions
const results = await greywaterLaws.searchJurisdictions('San Diego');

// Get statistics
const stats = await greywaterLaws.getJurisdictionStatsByState();
```

## Data Schema Examples

### Prospects Data
```javascript
{
  custom_id: "...",
  place_id: "...",
  Name: "Property Management Company",
  Domain: "example.com",
  Phone: "+1-512-555-1234",
  City: "Austin",
  State: "Texas",
  Rating_Value: 4.7,
  Priority_Score: 100,
  Deal_Value_Min: 13495,
  Deal_Value_Max: 67475,
  Incentive_Programs: "Austin Water GoPurple; L2L Rebate"
}
```

### Jurisdictions
```javascript
{
  jurisdiction_id: "...",
  jurisdiction_name: "City of Los Angeles",
  jurisdiction_type: "city",
  state_code: "CA",
  population: 3898747,
  website: "https://www.lacity.org",
  contact_phone: "213-473-3231"
}
```

### Regulations
```javascript
{
  regulation_id: "...",
  jurisdiction_id: "...",
  regulation_name: "Los Angeles Plumbing Code",
  regulation_type: "local_ordinance",
  status: "active",
  system_allowance: "allowed",
  system_types_covered: ["laundry_to_landscape", "simple_greywater"],
  regulation_url: "https://..."
}
```

### Permits
```javascript
{
  permit_id: "...",
  jurisdiction_id: "...",
  permit_name: "Greywater Installation Permit",
  permit_type: "greywater_system",
  sector_applicability: "residential",
  base_fee: 150.00,
  processing_time_days: 14,
  application_url: "https://..."
}
```

## Configuration

Environment variables in `.env`:
```bash
BIGQUERY_PROJECT_ID=greywater-prospects-2025
BIGQUERY_DATASET_ID=prospects_data
# Using application default credentials (no key file needed)
```

## Troubleshooting

If you get authentication errors:
```bash
# Re-authenticate
gcloud auth application-default login

# Set project
gcloud config set project greywater-prospects-2025

# Verify
gcloud auth application-default print-access-token
```

## Next Steps

Potential integrations:
1. **City/Location Pages** - Auto-generate Shopify pages with local greywater laws
2. **Permit Lookup Tool** - Interactive permit requirement finder
3. **Incentive Calculator** - Show rebates and savings by location
4. **Prospect CRM Integration** - Connect leads with local compliance data
5. **API Endpoints** - Create Shopify App Proxy endpoints for dynamic data

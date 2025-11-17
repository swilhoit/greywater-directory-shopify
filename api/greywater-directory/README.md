# Greywater Directory Hierarchy API

API endpoint for fetching hierarchical greywater compliance data from BigQuery.

## Endpoint

```
GET /api/greywater-directory/hierarchy
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `level` | string | Yes | The hierarchy level to fetch: `states`, `counties`, or `cities` |
| `parentId` | string | Conditional | Required for `counties` and `cities` levels. The ID of the parent jurisdiction |
| `parentType` | string | No | Optional type hint: `state` or `county` |

## Usage Examples

### Get All States

```bash
GET /api/greywater-directory/hierarchy?level=states
```

**Response:**
```json
{
  "success": true,
  "level": "states",
  "parentId": null,
  "count": 50,
  "data": [
    {
      "jurisdiction_id": "CA_STATE",
      "state_code": "CA",
      "state_name": "California",
      "population": 39538223,
      "county_count": 58,
      "city_count": 482,
      "state_regulations": "California Plumbing Code",
      "state_allowance": "allowed",
      "active_program_count": 12
    }
  ]
}
```

### Get Counties for a State

```bash
GET /api/greywater-directory/hierarchy?level=counties&parentId=CA_STATE
```

**Response:**
```json
{
  "success": true,
  "level": "counties",
  "parentId": "CA_STATE",
  "count": 58,
  "data": [
    {
      "jurisdiction_id": "CA_COUNTY_LOS_ANGELES",
      "jurisdiction_name": "County of Los Angeles",
      "county_name": "Los Angeles",
      "state_code": "CA",
      "state_name": "California",
      "population": 10039107,
      "city_count": 88,
      "total_city_population": 8500000,
      "local_regulations": "LA County Ordinance 2020-123",
      "county_allowance": "allowed",
      "base_permit_fee": 150.0,
      "processing_time_days": 14,
      "active_program_count": 3
    }
  ]
}
```

### Get Cities for a State

```bash
GET /api/greywater-directory/hierarchy?level=cities&parentId=CA_STATE&parentType=state
```

**Response:**
```json
{
  "success": true,
  "level": "cities",
  "parentId": "CA_STATE",
  "count": 482,
  "data": [
    {
      "jurisdiction_id": "CA_CITY_LOS_ANGELES",
      "city_name": "Los Angeles",
      "county_name": "Los Angeles",
      "state_code": "CA",
      "state_name": "California",
      "population": 3898747,
      "local_city_regulations": "LA Municipal Code Chapter 64.70",
      "city_allowance": "allowed",
      "city_permit_fee": 200.0,
      "processing_days": 10,
      "incentives": "Save Our Water Rebate; LA Water Conservation",
      "active_program_count": 2,
      "has_local_rules": 1
    }
  ]
}
```

### Get Cities for a County

```bash
GET /api/greywater-directory/hierarchy?level=cities&parentId=CA_COUNTY_LOS_ANGELES
```

## Error Responses

### Missing Required Parameter

```json
{
  "error": "Missing required parameter: level",
  "usage": "Valid levels are: states, counties, cities"
}
```

### Invalid Level

```json
{
  "error": "Invalid level: invalid",
  "usage": "Valid levels are: states, counties, cities"
}
```

### Server Error

```json
{
  "error": "Internal server error",
  "message": "Error description here"
}
```

## Data Schema

### State Data
- `jurisdiction_id`: Unique identifier (e.g., "CA_STATE")
- `state_code`: Two-letter state code
- `state_name`: Full state name
- `population`: State population
- `county_count`: Number of counties
- `city_count`: Number of cities with data
- `state_regulations`: State-level regulations (semicolon-separated)
- `state_allowance`: Whether greywater is allowed
- `active_program_count`: Number of active incentive programs

### County Data
- `jurisdiction_id`: Unique identifier
- `jurisdiction_name`: Full county name
- `county_name`: Short county name
- `state_code` & `state_name`: Parent state info
- `population`: County population
- `city_count`: Number of major cities
- `local_regulations`: County-specific regulations
- `county_allowance`: Greywater allowance status
- `base_permit_fee`: Starting permit fee
- `processing_time_days`: Typical processing time
- `active_program_count`: Available incentive programs

### City Data
- `jurisdiction_id`: Unique identifier
- `city_name`: City name
- `county_name`: Parent county
- `state_code` & `state_name`: State info
- `population`: City population
- `local_city_regulations`: City-specific regulations
- `city_allowance`: Local allowance status
- `city_permit_fee`: City permit fee
- `processing_days`: Processing time
- `incentives`: Available incentive programs
- `active_program_count`: Number of active programs
- `has_local_rules`: Whether city has local regulations (0 or 1)

## Environment Variables

Required environment variables in your Vercel project or `.env` file:

```env
BIGQUERY_PROJECT_ID=your-project-id
BIGQUERY_CREDENTIALS={"type":"service_account",...}
BIGQUERY_DATASET_ID=greywater_compliance
```

## CORS

This endpoint supports CORS and can be called from any origin. All responses include:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Rate Limiting

BigQuery has quotas and rate limits. For production use, consider implementing caching:
- Use Redis or similar for frequently accessed data
- Cache responses for 24 hours for static data
- Implement request throttling on the client side


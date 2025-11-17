# Greywater Compliance Database Schema

**Database:** `greywater-prospects-2025.greywater_compliance`
**Total Tables:** 50+ (29 tables, 21 views)

---

## 📋 Core Master Tables

### 1. `jurisdictions_master` (602 rows)
Primary table for all jurisdictions with greywater compliance data.

**Clustered by:** `jurisdiction_type`, `state_code`, `county_name`

```javascript
{
  jurisdiction_id: STRING,           // Unique ID (e.g., "CA_CITY_LOS_ANGELES")
  jurisdiction_name: STRING,         // "City of Los Angeles"
  jurisdiction_type: STRING,         // city, county, water_district, state, etc.

  // Geography
  state_code: STRING,                // "CA"
  state_name: STRING,                // "California"
  county_name: STRING,               // "Los Angeles"
  city_name: STRING,                 // "Los Angeles"
  water_district_name: STRING,       // If applicable

  // Hierarchy
  parent_jurisdiction_id: STRING,    // Links to parent jurisdiction

  // Demographics
  population: INTEGER,               // 3898747
  service_area_sqmi: FLOAT,         // Square miles covered

  // Contact Info
  website: STRING,                   // Official website URL
  contact_phone: STRING,             // Main phone number
  contact_email: STRING,             // Contact email
  primary_contact_department: STRING,// Department name

  // Metadata
  last_updated: TIMESTAMP,
  data_source: STRING,
  notes: STRING,
  consolidated_at: TIMESTAMP
}
```

---

### 2. `regulations_master` (23 rows)
Greywater regulations and ordinances.

**Clustered by:** `jurisdiction_id`, `status`, `sector_applicability`

```javascript
{
  regulation_id: STRING,                      // Unique ID
  jurisdiction_id: STRING,                    // FK to jurisdictions_master

  // Regulation Details
  regulation_type: STRING,                    // local_ordinance, plumbing_code, etc.
  regulation_name: STRING,                    // "Los Angeles Plumbing Code"
  regulation_number: STRING,                  // Code/ordinance number
  chapter_section: STRING,                    // Specific sections

  // Dates & Status
  effective_date: DATE,                       // When it took effect
  last_amended_date: STRING,                  // Last amendment
  status: STRING,                             // active, pending, repealed

  // Applicability
  sector_applicability: STRING,               // residential, commercial, both
  system_allowance: STRING,                   // allowed, prohibited, conditional
  system_types_covered: STRING,               // JSON array of system types

  // Requirements
  capacity_limits: STRING,                    // Gallons per day limits
  use_restrictions: STRING,                   // What water can be used for
  setback_requirements: STRING,               // Distance from buildings, etc.
  soil_requirements: STRING,                  // Soil type requirements
  professional_installation_required: BOOLEAN,

  // Documentation
  regulation_text: STRING,                    // Full text or summary
  regulation_url: STRING,                     // Link to official regulation

  // Enforcement
  enforcement_agency: STRING,                 // Who enforces it
  penalties: STRING,                          // Violation penalties

  // Metadata
  last_updated: TIMESTAMP,
  data_source: STRING,
  notes: STRING,
  consolidated_at: TIMESTAMP
}
```

---

### 3. `permits_master` (20 rows)
Permit requirements for greywater installations.

**Clustered by:** `jurisdiction_id`, `sector_applicability`, `permit_type`

```javascript
{
  permit_id: STRING,                    // Unique ID
  jurisdiction_id: STRING,              // FK to jurisdictions_master

  // Permit Details
  permit_name: STRING,                  // "Greywater Installation Permit"
  permit_type: STRING,                  // greywater_system, plumbing, building
  sector_applicability: STRING,         // residential, commercial, both

  // Costs
  base_fee: FLOAT,                      // $150.00
  additional_fees: FLOAT,               // Extra fees
  total_estimated_cost: FLOAT,          // Total cost estimate

  // Processing
  processing_time_days: INTEGER,        // 14 days
  expedited_available: BOOLEAN,         // Can be expedited?
  expedited_fee: FLOAT,                 // Extra cost for expediting
  expedited_time_days: INTEGER,         // Faster processing time

  // Application
  application_url: STRING,              // Where to apply
  required_documents: STRING,           // List of required docs

  // Inspection
  inspection_requirements: STRING,      // What's inspected
  inspection_fee: FLOAT,                // Cost of inspection
  approval_authority: STRING,           // Who approves

  // Validity
  validity_period_days: INTEGER,        // How long permit is valid
  renewal_required: BOOLEAN,            // Need to renew?

  // Professional Requirements
  professional_required: BOOLEAN,       // Need licensed professional?
  contractor_license_required: BOOLEAN, // Need contractor license?
  insurance_requirements: STRING,       // Insurance needed
  bond_requirements: STRING,            // Bond needed

  // Metadata
  last_updated: TIMESTAMP,
  data_source: STRING,
  notes: STRING
}
```

---

### 4. `incentive_programs` (106 rows)
Rebates, grants, and financial incentives.

```javascript
{
  program_id: STRING,                   // Unique ID
  program_name: STRING,                 // "Save Our Water Rebate"
  program_type: STRING,                 // rebate, grant, tax_credit, etc.
  funding_source: STRING,               // state_budget, utility, federal
  program_status: STRING,               // active, inactive, pending

  // Dates
  start_date: DATE,
  end_date: DATE,
  application_deadline: DATE,

  // Amounts
  incentive_amount_min: FLOAT,          // $50
  incentive_amount_max: FLOAT,          // $3000
  incentive_per_unit: STRING,           // per_system, per_farm, varies
  annual_budget: FLOAT,                 // $25,000,000
  total_budget: FLOAT,
  funds_remaining: FLOAT,

  // Eligibility
  eligible_system_types: STRING,        // JSON array
  eligible_uses: STRING,                // JSON array
  income_requirements: STRING,          // Income qualifications
  property_requirements: STRING,        // Property type requirements
  installation_requirements: STRING,    // How it must be installed

  // Application
  application_process: STRING,          // How to apply
  application_url: STRING,              // Application link
  required_documentation: STRING,       // Docs needed
  processing_time_days: INTEGER,

  // Contact
  contact_department: STRING,
  contact_phone: STRING,
  contact_email: STRING,

  // Metadata
  last_updated: TIMESTAMP,
  data_source: STRING,
  notes: STRING,
  verification_status: STRING,
  verification_date: DATE,
  source_url: STRING,

  // Additional flags
  is_free_installation: BOOLEAN,
  covers_full_cost: BOOLEAN,
  covers_materials_only: BOOLEAN,
  covers_labor: BOOLEAN,
  covers_design: BOOLEAN,
  requires_pre_approval: BOOLEAN,
  has_income_tiers: BOOLEAN,
  combines_with_other_programs: BOOLEAN
}
```

---

## 🔗 Relationship Tables

### 5. `program_jurisdiction_link`
Links incentive programs to jurisdictions (many-to-many).

```javascript
{
  program_id: STRING,        // FK to incentive_programs
  jurisdiction_id: STRING    // FK to jurisdictions_master
}
```

### 6. `program_relationships`
Shows parent/child relationships between programs (stacking).

```javascript
{
  parent_program_id: STRING,
  child_program_id: STRING,
  relationship_type: STRING,  // stacks_with, requires, excludes
  notes: STRING
}
```

### 7. `program_sector_link`
Links programs to specific sectors.

```javascript
{
  program_id: STRING,
  sector_name: STRING        // residential, commercial, agricultural, etc.
}
```

---

## 🏗️ Hierarchy & Structure

### 8. `complete_jurisdiction_hierarchy`
Maps the complete regulatory hierarchy for any location.

```javascript
{
  hierarchy_id: STRING,
  location_identifier: STRING,

  // Hierarchy IDs
  state_jurisdiction_id: STRING,
  county_jurisdiction_id: STRING,
  city_jurisdiction_id: STRING,
  water_district_jurisdiction_ids: STRING,  // JSON array
  special_district_jurisdiction_ids: STRING,

  // Authority mapping
  primary_regulatory_authority: STRING,
  permit_issuing_authority: STRING,
  inspection_authority: STRING,
  // ... more authority fields
}
```

---

## 📊 Useful Views

### Key Views for Queries:

**`incentives_master`** - Enhanced view of all incentive programs with jurisdiction info

**`programs_by_location`** - All programs available for a specific location

**`programs_enhanced`** - Programs with full details and relationships

**`compliance_inheritance_view`** - Shows how regulations inherit from state → county → city

**`maximum_rebate_potential`** - Calculates max possible rebates per location

**`incentive_opportunities`** - Available incentives with eligibility info

**`aqua2use_permit_guide`** - Specific permit guide for Aqua2Use systems

**`city_programs_view`** - All programs at city level

**`county_programs_view`** - All programs at county level

**`full_coverage_programs`** - Programs that cover entire states/regions

**`income_qualified_programs`** - Programs with income requirements

**`programs_requiring_preapproval`** - Programs needing preapproval

---

## 🗺️ Geographic Support Tables

### 9. `geography_links`
Links between different geographic entities.

### 10. `california_cities_location_codes`
Location codes for California cities (for APIs).

### 11. `dataforseo_location_codes`
Location codes for DataForSEO API integration.

---

## 📚 Reference Tables

### 12. `lookup_sectors`
Standard sector definitions (residential, commercial, etc.).

### 13. `incentive_types_reference`
Standard incentive type definitions.

### 14. `program_tiers`
Tier structures for tiered incentive programs.

---

## 🔍 Research Tracking

### 15. `research_quality_master`
Tracks data quality and research status.

```javascript
{
  jurisdiction_id: STRING,
  research_status: STRING,      // complete, partial, pending
  last_researched: TIMESTAMP,
  researcher: STRING,
  confidence_score: FLOAT,
  notes: STRING
}
```

---

## 📐 Schema Patterns

### Naming Conventions:
- **Master tables:** `*_master` - Core canonical data
- **Link tables:** `*_link` - Many-to-many relationships
- **Views:** `*_view` or descriptive names
- **Batch tables:** `*_batch_YYYYMMDD_HHMMSS` - Import batches

### ID Format:
- **Jurisdictions:** `{STATE}_{TYPE}_{NAME}`
  - Example: `CA_CITY_LOS_ANGELES`
- **Programs:** `{STATE}_{PROGRAM}_{YEAR}`
  - Example: `CA_SAVE_OUR_WATER_2025`

### Clustered Indexes:
Key tables are clustered for performance:
- `jurisdictions_master`: By type, state, county
- `regulations_master`: By jurisdiction, status, sector
- `permits_master`: By jurisdiction, sector, type

---

## 🔄 Data Relationships

```
jurisdictions_master (1)
  ├─→ regulations_master (many)
  ├─→ permits_master (many)
  └─→ program_jurisdiction_link (many)
       └─→ incentive_programs (many)

incentive_programs (1)
  ├─→ program_jurisdiction_link (many)
  ├─→ program_relationships (many)
  └─→ program_sector_link (many)

complete_jurisdiction_hierarchy
  └─→ Maps all jurisdictions for a location
```

---

## 💡 Query Patterns

### Get everything for a location:
```sql
-- Get all regulations, permits, and incentives for Los Angeles
SELECT
  j.*,
  r.regulation_name,
  p.permit_name,
  prog.program_name
FROM jurisdictions_master j
LEFT JOIN regulations_master r ON j.jurisdiction_id = r.jurisdiction_id
LEFT JOIN permits_master p ON j.jurisdiction_id = p.jurisdiction_id
LEFT JOIN program_jurisdiction_link pjl ON j.jurisdiction_id = pjl.jurisdiction_id
LEFT JOIN incentive_programs prog ON pjl.program_id = prog.program_id
WHERE j.city_name = 'Los Angeles' AND j.state_code = 'CA'
```

### Find stackable incentives:
```sql
SELECT
  p1.program_name as program,
  p2.program_name as stacks_with
FROM program_relationships pr
JOIN incentive_programs p1 ON pr.parent_program_id = p1.program_id
JOIN incentive_programs p2 ON pr.child_program_id = p2.program_id
WHERE pr.relationship_type = 'stacks_with'
```

---

## 🎯 Schema Strengths

✅ **Normalized Design** - Proper relationships, minimal redundancy
✅ **Comprehensive Coverage** - Jurisdictions, regs, permits, incentives
✅ **Geographic Hierarchy** - State → County → City → District
✅ **Program Stacking** - Track which incentives combine
✅ **Research Tracking** - Know data quality and status
✅ **Clustered Indexes** - Optimized for common queries
✅ **Flexible Views** - Pre-built queries for common needs

---

**Schema Version:** 1.0
**Last Updated:** September 2025
**Maintainer:** Greywater Directory Team

# Greywater Compliance Database - Population Guide

Complete guide for populating the greywater compliance database with city, county, and state data.

---

## 📊 Current Status

- **Total Jurisdictions:** 602
- **Complete with Regulations:** 23 (3.8%)
- **Primary Coverage:** California cities
- **Gap Areas:** Texas (0%), Arizona (0%), most CA cities (96%)

---

## 🎯 Prioritized Approach

### Phase 1: Top 25 Cities (Highest Impact)
**Target Timeline:** 3 months
**Coverage Increase:** 360% (23 → 48 jurisdictions)
**Population Reach:** ~27 million people

**Priority Order:**
1. **Texas Top 6** (Houston, San Antonio, Austin, Fort Worth, El Paso, Dallas)
2. **Arizona Top 6** (Phoenix, Tucson, Mesa, Chandler, Scottsdale, Gilbert)
3. **California Top 13** (San Diego, San Jose, San Francisco, etc.)

See `PRIORITY_CITIES.md` for complete list.

---

## 🛠️ Tools & Files Created

### Core Libraries:
- **`lib/bigquery.js`** - BigQuery client wrapper
- **`lib/greywater-laws.js`** - Query helpers for compliance data
- **`lib/data-insertion.js`** - Data insertion helpers with ID generation

### Scripts:
- **`scripts/batch-insert-cities.js`** - Batch insert city data
- **`scripts/test-greywater-laws.js`** - Query and test database
- **`scripts/test-bigquery.js`** - Test database connection

### Data Templates:
- **`scripts/city-data-examples/`** - City data file templates
- **`scripts/city-data-examples/houston-tx.js`** - Example template

### Documentation:
- **`PRIORITY_CITIES.md`** - Top 50 cities to research, prioritized
- **`DATABASE_SCHEMA.md`** - Complete schema reference
- **`research-framework.md`** - Research methodology
- **`COMPLIANCE_DATA_SUMMARY.md`** - Current data summary

---

## 🚀 Quick Start

### 1. Research a City

Use the research framework to gather data:

```bash
# Reference the research framework
cat scripts/research-framework.md
```

**Time per city:** 55-85 minutes
- Regulations research: 20-30 min
- Permits research: 15-20 min
- Incentives research: 10-15 min
- Data entry: 5-10 min

### 2. Create City Data File

Copy the template and fill in researched data:

```bash
# Copy template
cp scripts/city-data-examples/houston-tx.js \
   scripts/city-data-examples/your-city.js

# Edit with researched data
# Remove research_notes section when complete
```

### 3. Validate with Dry Run

Test the data file without inserting:

```bash
npm run data:insert:dry-run city-data-examples/your-city.js
```

### 4. Insert Into Database

Once validated, insert the data:

```bash
npm run data:insert city-data-examples/your-city.js
```

### 5. Verify Insertion

Check that the data was inserted correctly:

```bash
npm run laws:search "City Name" ST
```

---

## 📝 Data Template Structure

### Complete City Data Object:

```javascript
export default {
  // Required: Jurisdiction information
  jurisdiction: {
    jurisdiction_name: 'City of Houston',
    jurisdiction_type: 'city',
    state_code: 'TX',
    state_name: 'Texas',
    county_name: 'Harris',
    city_name: 'Houston',
    population: 2304580,
    website: 'https://www.houstontx.gov',
    contact_phone: '311',
    contact_email: 'contact@example.gov',
    primary_contact_department: 'Development Services',
    data_source: 'City website',
    notes: 'Additional context'
  },

  // Regulations (array)
  regulations: [
    {
      regulation_type: 'plumbing_code',
      regulation_name: 'Houston Plumbing Code',
      regulation_number: 'Chapter 33',
      effective_date: '2023-01-01',
      status: 'active',
      sector_applicability: 'both',
      system_allowance: 'allowed',
      system_types_covered: ['laundry_to_landscape', 'simple_greywater'],
      capacity_limits: 'Up to 400 gpd for residential',
      use_restrictions: 'Subsurface irrigation only',
      setback_requirements: '5 ft from buildings',
      professional_installation_required: false,
      regulation_url: 'https://...',
      enforcement_agency: 'Building Department',
      data_source: 'City building code',
      notes: 'Follows TX state code'
    }
  ],

  // Permits (array)
  permits: [
    {
      permit_name: 'Greywater System Permit',
      permit_type: 'plumbing',
      sector_applicability: 'residential',
      base_fee: 150.00,
      additional_fees: 25.00,
      processing_time_days: 14,
      expedited_available: true,
      expedited_fee: 75.00,
      expedited_time_days: 5,
      application_url: 'https://...',
      required_documents: ['site plan', 'system design'],
      inspection_requirements: 'Rough-in and final',
      inspection_fee: 100.00,
      professional_required: false,
      contractor_license_required: true,
      data_source: 'Permit portal',
      notes: 'Online application available'
    }
  ],

  // Remove this section when research is complete
  research_notes: {
    status: 'TEMPLATE - NOT YET RESEARCHED',
    next_steps: ['Research building code', 'Get permit fees'],
    key_contacts: ['Department: 555-1234']
  }
};
```

---

## 🔍 Research Checklist

### Before Starting:
- [ ] Review `PRIORITY_CITIES.md` for city priority
- [ ] Check if city already in database
- [ ] Review `research-framework.md` for methodology

### Jurisdiction Info (10 min):
- [ ] Verify population (Census Bureau)
- [ ] Get official website URL
- [ ] Find contact phone/email
- [ ] Identify parent county
- [ ] Note any water districts

### Regulations Research (25 min):
- [ ] Download city building/plumbing code
- [ ] Check for greywater-specific ordinances
- [ ] Verify if city adopts state code
- [ ] Document system types allowed
- [ ] Note capacity limits and restrictions
- [ ] Save regulation URLs
- [ ] Check effective dates

**Key sources:**
- City building department website
- Municode.com or American Legal Publishing
- State plumbing code documents

### Permits Research (20 min):
- [ ] Access city permit portal
- [ ] Get current fee schedule
- [ ] Document processing times
- [ ] List required documents
- [ ] Note inspection requirements
- [ ] Check for expedited options
- [ ] Test application URLs

**Key sources:**
- City building department permit portal
- Online fee schedules
- Permit application forms

### Incentives Research (15 min):
- [ ] Check city water utility rebates
- [ ] Review county programs
- [ ] Check water district programs
- [ ] Note state programs available
- [ ] Document rebate amounts
- [ ] Note eligibility requirements
- [ ] Save application URLs

**Key sources:**
- City water utility website
- Water conservation pages
- Regional water district sites

### Data Entry (10 min):
- [ ] Create city data file
- [ ] Fill in all researched info
- [ ] Add source URLs
- [ ] Remove research_notes section
- [ ] Run dry-run validation
- [ ] Insert into database
- [ ] Verify with query

---

## 🎯 Quality Standards

### Required Fields:
- ✅ Jurisdiction name, type, state
- ✅ Population
- ✅ Official website
- ✅ At least one regulation OR note if none exist
- ✅ Primary source URLs

### Data Quality Levels:

**High Confidence (90-100%):**
- Direct from official documents
- Verified with city staff
- Current within 6 months

**Medium Confidence (70-89%):**
- From official website
- No direct verification
- Current within 1 year

**Low Confidence (50-69%):**
- Third-party sources
- Older information (>1 year)
- Conflicting information resolved

**Needs Review (<50%):**
- Incomplete information
- No primary sources
- Conflicting data unresolved

---

## 🔄 Batch Processing

### Process Multiple Cities:

```bash
# Dry run all cities in examples folder
npm run data:insert:dry-run city-data-examples/*.js

# Insert all complete cities
npm run data:insert city-data-examples/*.js
```

### Weekly Workflow:

**Monday-Wednesday: Research**
- Research 3-4 cities
- Create data files
- Document sources

**Thursday: Quality Check**
- Review data files
- Run dry-run tests
- Fix any issues

**Friday: Insert**
- Batch insert verified data
- Update tracking spreadsheet
- Plan next week's cities

---

## 📈 Progress Tracking

### Weekly Goals:
- **Researchers:** 3-5 cities per week
- **Quality:** 90%+ confidence score
- **Coverage:** Focus on Phase 1 priorities

### Monthly Review:
- Completed cities count
- Population coverage increase
- State distribution
- Quality score average
- Process improvements

### Quarterly Targets:
- **Q1 2026:** 25 cities (Phase 1 complete)
- **Q2 2026:** 50 cities total
- **Q3 2026:** 100 cities total
- **Q4 2026:** 150 cities total

---

## 🛡️ Data Validation

### Automatic Checks:
- Required fields present
- Valid state codes
- URLs properly formatted
- Numeric values in range
- Dates in correct format

### Manual Verification:
- Source URLs accessible
- Phone numbers formatted correctly
- Email addresses valid
- Regulation current and active
- Fees match official schedules

---

## 💡 Tips for Efficient Research

### City Website Navigation:
1. Start with "/development" or "/building"
2. Look for "Codes & Ordinances"
3. Check "Water" or "Utilities" section
4. Search for "greywater" or "graywater"

### Common Code Locations:
- Building/Development Services dept
- Water Utilities dept
- Environmental Services dept
- Public Works dept

### Fee Schedule Tips:
- Usually PDF on permit portal
- May be called "Master Fee Schedule"
- Check effective date
- Note if updated annually

### Time-Saving Strategies:
- Research similar cities together (same state)
- Create state-specific checklists
- Batch download codes for offline review
- Use browser bookmarks for common sites

---

## 🚨 Common Issues & Solutions

### Issue: Can't find greywater regulations
**Solution:** Check if city adopts state code without amendments. If yes, note "Follows [STATE] state plumbing code"

### Issue: Permit fees unclear
**Solution:** Contact building department directly or note "Contact for fee estimate" with phone number

### Issue: Conflicting information
**Solution:** Use most recent official source. Note discrepancy in notes field.

### Issue: City has no greywater regulations
**Solution:** Still create jurisdiction entry. Note "No specific greywater regulations found as of [DATE]"

---

## 📞 Support & Questions

### Resources:
- Schema reference: `DATABASE_SCHEMA.md`
- Research methodology: `scripts/research-framework.md`
- Priority list: `PRIORITY_CITIES.md`
- Example templates: `scripts/city-data-examples/`

### Testing:
```bash
# Test database connection
npm run bigquery:test

# Query existing data
npm run laws:overview
npm run laws:search "Los Angeles" CA

# Validate new data
npm run data:insert:dry-run city-data-examples/your-city.js
```

---

## 🎓 Training Resources

### New Researcher Onboarding:
1. Read `DATABASE_SCHEMA.md` - Understand data structure
2. Review `research-framework.md` - Learn methodology
3. Study `houston-tx.js` template - See example
4. Practice with dry-run - Test without inserting
5. Start with simple city - Build confidence

### Estimated Training Time:
- **Documentation review:** 1-2 hours
- **Template practice:** 30 minutes
- **First city (with guidance):** 2 hours
- **Subsequent cities:** 60-90 minutes

---

**Ready to start?** Pick a city from `PRIORITY_CITIES.md` and begin researching!

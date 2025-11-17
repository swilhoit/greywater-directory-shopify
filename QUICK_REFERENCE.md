# Quick Reference Card

## 📊 Database at a Glance

- **Current:** 23/602 jurisdictions complete (3.8%)
- **Coverage:** California only
- **Goal:** 48 jurisdictions in 3 months (360% increase)

## 🚀 Common Commands

```bash
# Test database connection
npm run bigquery:test

# View database overview
npm run laws:overview

# Search specific city
npm run laws:search "City Name" ST

# Insert city data (test first)
npm run data:insert:dry-run city-data-examples/your-city.js
npm run data:insert city-data-examples/your-city.js
```

## 🎯 Top Priority Cities

### Texas (0% complete)
1. Houston - 2.3M
2. San Antonio - 1.5M
3. Austin - 966K

### Arizona (0% complete)
4. Phoenix - 1.7M
5. Tucson - 543K
6. Mesa - 504K

### California (4% complete)
7. San Diego - 1.4M
8. San Jose - 1.0M
9. San Francisco - 874K

## 📝 LLM-Based Research Workflow

1. **Use LLM to Research** (60-90 min/city)
   - Use prompts from `LLM_RESEARCH_PROMPTS.md`
   - Or just ask: "Research greywater regulations for [City], [State]"
   - LLM will search and structure data

2. **Generate Data File**
   - LLM creates formatted JavaScript file
   - Save to city-data-examples/
   - No manual coding needed!

3. **Validate**
   - `npm run data:insert:dry-run city-file.js`
   - Fix any issues

4. **Insert**
   - `npm run data:insert city-file.js`
   - Verify: `npm run laws:search "City" ST`

## 📚 Key Documents

- **Start Here:** `LLM_RESEARCH_PROMPTS.md` ⭐ NEW!
- **City Priorities:** `PRIORITY_CITIES.md`
- **Data Guide:** `DATA_POPULATION_GUIDE.md`
- **Schema Reference:** `DATABASE_SCHEMA.md`
- **Full Summary:** `DATA_EXPANSION_SUMMARY.md`

## 🎓 Time Estimates

- **Research per city:** 55-85 minutes
- **Data entry:** 5-10 minutes
- **Weekly goal:** 3-5 cities
- **Phase 1 (25 cities):** ~30-40 hours (3 months)

## 🛠️ File Locations

- **Templates:** `scripts/city-data-examples/`
- **Helper libs:** `lib/data-insertion.js`, `lib/greywater-laws.js`
- **Scripts:** `scripts/batch-insert-cities.js`

## ⚡ Quick Tips

- Start with Texas/Arizona (0% coverage, high priority)
- Research similar cities together (same state)
- Always dry-run before inserting
- Check primary sources (official city websites)
- Document source URLs
- 90%+ confidence score target

## 🎯 Success Metrics

- **Weekly:** 3-5 cities completed
- **Monthly:** 12-20 cities completed
- **3 Months:** 25 cities (Phase 1 complete)
- **Quality:** 90%+ confidence, zero errors

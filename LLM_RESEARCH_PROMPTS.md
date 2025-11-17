# LLM Research Prompts for Greywater Compliance Data

Use these prompts with Claude, ChatGPT, or any LLM to research greywater regulations for each city.

---

## 🎯 Master Research Prompt

Copy and paste this prompt, replacing `[CITY]` and `[STATE]`:

```
I need to research greywater regulations, permits, and incentive programs for [CITY], [STATE].

Please help me by:

1. **Finding Basic Information:**
   - Current population
   - County name
   - Official city website
   - Building/development department contact info

2. **Researching Greywater Regulations:**
   - Does the city have specific greywater ordinances?
   - Or does it follow the state plumbing code?
   - What system types are allowed? (laundry-to-landscape, simple, complex)
   - Capacity limits (gallons per day)
   - Use restrictions (subsurface, irrigation only, etc.)
   - Setback requirements
   - Professional installation requirements
   - Link to actual regulation/code document

3. **Finding Permit Requirements:**
   - What permits are needed? (plumbing, building, both)
   - Permit fees (base + additional)
   - Processing time
   - Expedited options
   - Application portal URL
   - Required documents
   - Inspection requirements
   - Contractor/professional requirements

4. **Identifying Incentive Programs:**
   - City water utility rebates
   - County programs
   - Water district programs
   - State programs (if applicable)
   - Rebate amounts and eligibility
   - Application URLs and deadlines

Please provide sources/URLs for everything you find.

If you can't find specific greywater information, note what IS available about water conservation, plumbing codes, or building permits in general.
```

---

## 📋 Step-by-Step Prompts

### Step 1: Basic Jurisdiction Info

```
Research basic information about [CITY], [STATE]:

1. What is the current population? (Use latest census or estimate)
2. What county is it in?
3. What is the official city website?
4. What is the building department's contact information?
5. What is the primary water utility serving the city?

Provide sources for this information.
```

### Step 2: Greywater Regulations

```
Research greywater regulations for [CITY], [STATE]:

1. Search for "[CITY] [STATE] greywater regulations"
2. Search for "[CITY] [STATE] plumbing code greywater"
3. Check if the city has adopted the state plumbing code
4. Look for municipal code sections on water reuse

Questions to answer:
- Are greywater systems allowed?
- What types? (Residential? Commercial? Both?)
- What system types are permitted?
- Are there capacity limits?
- What are the use restrictions?
- Are there setback requirements?
- Is professional installation required?
- Where is this documented? (Provide URLs)

If you can't find city-specific regulations, check:
- State plumbing code for [STATE]
- Whether the city explicitly adopts state code
```

### Step 3: Permit Requirements

```
Research permit requirements for greywater systems in [CITY], [STATE]:

1. Search for "[CITY] [STATE] plumbing permit"
2. Search for "[CITY] [STATE] building permit fees"
3. Look for the city's master fee schedule
4. Find the online permit portal

Questions to answer:
- What type of permit is required?
- What is the base permit fee?
- Are there additional fees? (plan review, inspection, etc.)
- What is the typical processing time?
- Is expedited processing available? Cost?
- What documents are required?
- What inspections are needed?
- Must a licensed contractor do the work?
- Are there insurance/bond requirements?

Provide the permit application URL and fee schedule URL.
```

### Step 4: Incentive Programs

```
Research water conservation and greywater incentive programs available in [CITY], [STATE]:

Search for:
1. "[CITY] water utility rebates"
2. "[CITY] water conservation programs"
3. "[CITY] greywater rebate"
4. "[COUNTY] water conservation incentives"
5. "[STATE] water efficiency programs"

For each program found, identify:
- Program name
- Rebate/grant amount range
- Eligible system types
- Eligibility requirements (income limits, etc.)
- Application process and URL
- Deadlines (if any)
- Contact information
- Current status (active, waitlist, etc.)

Note: Programs may be at city, county, water district, or state level.
All programs available to residents of [CITY] should be included.
```

---

## 🔄 Follow-up Prompts

### If Information is Missing:

```
I couldn't find specific greywater regulations for [CITY], [STATE].

Can you:
1. Confirm whether [CITY] has adopted the [STATE] state plumbing code?
2. Check the [STATE] state plumbing code for greywater provisions?
3. Look for any city ordinances related to water reuse or conservation?
4. Check if there are county-level regulations that would apply?

If truly no information exists, help me document that:
- "No city-specific greywater regulations found as of [DATE]"
- "City follows [STATE] state plumbing code"
- Include state code reference/URL
```

### For Complex Regulations:

```
I found greywater regulations for [CITY], but they're complex.

Help me summarize:
1. What are the KEY allowances? (What IS permitted?)
2. What are the KEY restrictions? (What is NOT permitted or has limits?)
3. What's the simplest system a homeowner can install?
4. What's required for commercial installations?
5. Are there different tiers/categories of systems?

Organize this in a clear, structured way.
```

### For Fee Information:

```
I found a fee schedule for [CITY], but it's not clear which fees apply to greywater.

Help me identify:
1. Is there a specific "greywater" permit fee?
2. Or would it fall under "plumbing permit"?
3. Are there separate fees for residential vs commercial?
4. What additional fees apply? (plan review, inspections)
5. What's the total estimated cost for:
   - Simple residential system (laundry-to-landscape)
   - Complex residential system
   - Commercial system

Provide a cost breakdown.
```

---

## 💾 Data Formatting Prompt

Once research is complete, use this prompt to format the data:

```
I've completed research on greywater regulations for [CITY], [STATE].

Help me create a properly formatted JavaScript data file following this structure:

TEMPLATE TO FOLLOW:
[Paste the houston-tx.js template here]

MY RESEARCH FINDINGS:

**JURISDICTION:**
- City: [CITY]
- State: [STATE]
- Population: [NUMBER]
- County: [COUNTY]
- Website: [URL]
- Contact: [PHONE/EMAIL]

**REGULATIONS:**
[Paste your regulation findings]

**PERMITS:**
[Paste your permit findings]

**INCENTIVES:**
[Paste your incentive findings]

**SOURCES:**
[List all source URLs]

Please generate a complete JavaScript file in the exact format of the template,
with all fields properly filled in. Use proper data types (numbers not strings for fees, etc.).

For the research_notes section, assess the confidence level:
- high: Direct from official documents, verified
- medium: From official websites, appears current
- low: Limited information, may need verification

Include all source URLs in the research_notes.
```

---

## 🎯 State-Specific Guidance

### California Cities:

```
For [CITY], California:

Note: Most CA cities follow California Plumbing Code Chapter 15 (greywater systems).

Research focus:
1. Does [CITY] have any LOCAL amendments to state code?
2. Check [CITY] municipal code for "greywater" or "graywater"
3. Look for city-specific permit requirements
4. Check if [CITY] is in a water district with rebate programs
5. Look for local water conservation ordinances

California state resources:
- CA Plumbing Code: https://codes.iccsafe.org/
- State Water Board: https://www.waterboards.ca.gov/
- CA Department of Water Resources programs
```

### Texas Cities:

```
For [CITY], Texas:

Note: Texas cities typically follow Texas State Plumbing Code.

Research focus:
1. Does [CITY] have local plumbing ordinances?
2. Check [CITY] development services or building department
3. Look for city-specific permit fees
4. Check if Austin Water or San Antonio Water System serves the area
5. Look for GoPurple program or similar initiatives

Texas state resources:
- TX State Plumbing Code
- Texas Water Development Board: https://www.twdb.texas.gov/
- Municipal utility district programs
```

### Arizona Cities:

```
For [CITY], Arizona:

Note: Arizona cities follow Arizona Plumbing Code with possible local amendments.

Research focus:
1. Check [CITY] building/development services
2. Look for water conservation ordinances
3. Check if served by Phoenix Water, Tucson Water, or other utility
4. Look for xeriscape/water conservation rebates
5. Check Pima County or Maricopa County programs

Arizona state resources:
- AZ Plumbing Code
- Arizona Department of Water Resources: https://new.azwater.gov/
- Active Management Area programs
```

---

## ⚡ Quick Research Workflow

**For each city (60-90 minutes):**

1. **Run Master Prompt** (or step-by-step prompts)
2. **Review LLM output**, verify key claims
3. **Check provided URLs** to confirm accuracy
4. **Run Data Formatting Prompt** with your findings
5. **Save generated file** to `city-data-examples/`
6. **Test with dry-run**
7. **Insert into database**

**Batch research strategy:**
- Research 3-5 similar cities in one session
- Same state = similar regulations
- Can reuse pattern/format
- More efficient than one-by-one

---

## 🔍 Verification Checklist

Before inserting data, verify:

- [ ] Population is current (2020+ census or estimate)
- [ ] URLs are accessible and correct
- [ ] Fees match current fee schedule
- [ ] Regulation references are accurate
- [ ] Contact information is current
- [ ] System allowances are clearly stated
- [ ] Source URLs are documented
- [ ] Confidence level is realistic

---

## 📱 Mobile-Friendly Quick Prompt

For quick research on mobile:

```
Quick greywater research for [CITY], [STATE]:
1. Population & county?
2. City website & building dept contact?
3. Greywater allowed? What types?
4. Permit required? Fees?
5. Any rebates/incentives?
6. Sources?

Keep it brief - I'll format later.
```

---

## 🤖 Using This Conversational AI

You can use ME (Claude) right now to research! Just say:

"Research greywater regulations for Houston, Texas"

And I'll:
1. Use WebSearch to find current information
2. Structure the data properly
3. Generate a ready-to-insert data file
4. Provide all source URLs

**Try it now with your first priority city!**

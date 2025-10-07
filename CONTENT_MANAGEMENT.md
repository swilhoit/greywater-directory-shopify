# L2L Content Management System

This system allows you to manage dynamic content for your L2L (Laundry to Landscape) pages via CLI/API instead of manually editing in Shopify admin.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and add your Shopify credentials:
```bash
cp .env.example .env
```

Edit `.env` with your store details:
- `SHOPIFY_STORE_URL`: Your Shopify store URL
- `SHOPIFY_ADMIN_API_TOKEN`: Admin API access token from a custom app

### 3. Create Custom App in Shopify

1. Go to Settings > Apps and sales channels > Develop apps
2. Create a new app
3. Configure Admin API scopes:
   - `write_content`
   - `read_content`
   - `write_pages`
   - `read_pages`
4. Install the app and copy the Admin API access token

### 4. Initialize Metafields
Run the setup command to create metafield definitions:
```bash
npm run content:setup
```

## Usage

### List All Pages
View all pages and their L2L metafields:
```bash
npm run content:list
```

### Update Page Content
Update a specific page using a JSON file:
```bash
node scripts/manage-page-content.js update <page-handle> -f content/sample-page-content.json
```

Example:
```bash
node scripts/manage-page-content.js update l2l-greywater -f content/sample-page-content.json
```

### Export Page Content
Export current page content to a JSON file:
```bash
node scripts/manage-page-content.js export <page-handle> -o content/exported.json
```

## Content Structure

The content JSON supports these fields:

### hero_content
```json
{
  "hero_content": {
    "heading": "Main headline",
    "subheading": "Supporting text",
    "button_text": "CTA text",
    "button_url": "/link",
    "image_url": "https://cdn.shopify.com/..."
  }
}
```

### statistics
```json
{
  "statistics": [
    {
      "value": "10,000",
      "suffix": "gal",
      "label": "Water Saved",
      "description": "Per year",
      "icon": "💧"
    }
  ]
}
```

### features
```json
{
  "features": [
    {
      "title": "Feature name",
      "description": "Feature description",
      "icon": "🔧",
      "details": ["Detail 1", "Detail 2"]
    }
  ]
}
```

### faq
```json
{
  "faq": [
    {
      "question": "Question text",
      "answer": "Answer text"
    }
  ]
}
```

### cta
```json
{
  "cta": {
    "heading": "CTA heading",
    "description": "CTA description",
    "primary_button": {
      "text": "Primary action",
      "url": "/link"
    },
    "secondary_button": {
      "text": "Secondary action",
      "url": "/link"
    }
  }
}
```

## Using Dynamic Sections

The dynamic sections automatically read from metafields if available, otherwise fall back to section settings:

1. **hero-l2l-dynamic.liquid**: Reads from `page.metafields.l2l.hero_content`
2. **l2l-statistics-dynamic.liquid**: Reads from `page.metafields.l2l.statistics`

To use in your templates:
```json
{
  "sections": {
    "hero": {
      "type": "hero-l2l-dynamic"
    },
    "stats": {
      "type": "l2l-statistics-dynamic"
    }
  }
}
```

## Workflow Example

1. Create content file for a new campaign:
```bash
cp content/sample-page-content.json content/summer-campaign.json
# Edit content/summer-campaign.json
```

2. Update the page:
```bash
node scripts/manage-page-content.js update summer-l2l -f content/summer-campaign.json
```

3. Verify changes:
```bash
node scripts/manage-page-content.js export summer-l2l -o content/verify.json
```

## Benefits

- **Version Control**: Track content changes in Git
- **Bulk Updates**: Update multiple pages programmatically
- **CI/CD Integration**: Deploy content changes with your code
- **A/B Testing**: Easily swap content configurations
- **Content Reuse**: Share content across multiple pages
- **Backup**: Export and save content configurations
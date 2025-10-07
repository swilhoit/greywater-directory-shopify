#!/usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs/promises';

dotenv.config();

const shopUrl = process.env.SHOPIFY_STORE_DOMAIN || 'waterwisegroup.myshopify.com';
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiUrl = `https://${shopUrl}/admin/api/2024-10/graphql.json`;

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(JSON.stringify(data.errors, null, 2));
  }
  return data.data;
}

async function createCityPage(cityData) {
  const handle = `l2l-${cityData.city_name.toLowerCase().replace(/\s+/g, '-')}`;
  const title = `Laundry to Landscape Systems in ${cityData.city_name}`;

  // Prepare metafields that will work with existing hero-l2l and l2l-statistics sections
  const metafields = [
    {
      namespace: 'l2l',
      key: 'hero_content',
      value: JSON.stringify({
        heading: `Laundry to Landscape Greywater Systems in ${cityData.city_name}`,
        subheading: cityData.hero_subheading || `Save water, save money, and help your ${cityData.city_name} garden thrive`,
        button_text: `Get Started in ${cityData.city_name}`,
        button_url: '#installation'
      }),
      type: 'json'
    },
    {
      namespace: 'l2l',
      key: 'statistics',
      value: JSON.stringify([
        {
          icon: "💧",
          value: cityData.annual_water_savings || "10000",
          suffix: "+",
          label: "Gallons Saved Yearly",
          description: `Per ${cityData.city_name} household`
        },
        {
          icon: "💰",
          value: cityData.annual_cost_savings || "300",
          suffix: "$",
          label: "Annual Savings",
          description: `${cityData.city_name} water rates`
        },
        {
          icon: "🌱",
          value: cityData.water_savings_percent || "40",
          suffix: "%",
          label: "Less Outdoor Water",
          description: "Reduction in irrigation"
        },
        {
          icon: "🏦",
          value: cityData.rebate_amount || "0",
          suffix: "",
          label: "Local Rebates",
          description: cityData.water_district || "Check availability"
        }
      ]),
      type: 'json'
    },
    {
      namespace: 'l2l',
      key: 'city_info',
      value: JSON.stringify({
        city: cityData.city_name,
        state: cityData.state,
        water_district: cityData.water_district,
        permit_required: cityData.permit_required,
        rebate_program: cityData.rebate_program,
        climate_zone: cityData.climate_zone
      }),
      type: 'json'
    }
  ];

  const mutation = `
    mutation CreatePage($input: PageCreateInput!) {
      pageCreate(page: $input) {
        page {
          id
          handle
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      handle: handle,
      title: title,
      templateSuffix: 'l2l-greywater',
      isPublished: true,
      metafields: metafields
    }
  };

  const result = await graphqlRequest(mutation, variables);

  if (result.pageCreate.userErrors.length > 0) {
    console.error(`❌ Error creating ${cityData.city_name}:`, result.pageCreate.userErrors);
    return null;
  }

  return result.pageCreate.page;
}

// Main execution
async function main() {
  const cities = ['tucson', 'austin', 'los-angeles', 'portland'];

  for (const city of cities) {
    try {
      const cityData = JSON.parse(await fs.readFile(`cities/${city}.json`, 'utf-8'));
      const page = await createCityPage(cityData);
      if (page) {
        console.log(`✅ Created: ${page.title}`);
        console.log(`   URL: /pages/${page.handle}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create page for ${city}:`, error.message);
    }
  }
}

main().catch(console.error);
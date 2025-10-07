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

async function updatePageWithSimpleMetafields(cityData) {
  const handle = `l2l-${cityData.city_name.toLowerCase().replace(/\s+/g, '-')}`;

  // Find existing page
  const pagesQuery = `
    query {
      pages(first: 100) {
        edges {
          node {
            id
            handle
          }
        }
      }
    }
  `;

  const pagesResult = await graphqlRequest(pagesQuery);
  const page = pagesResult.pages.edges.find(edge => edge.node.handle === handle);

  if (!page) {
    console.log(`❌ Page not found: ${handle}`);
    return null;
  }

  // Prepare simplified metafields - only city name and rebate notice
  const metafields = [
    {
      namespace: 'l2l_city',
      key: 'city_name',
      value: cityData.city_name,
      type: 'single_line_text_field'
    },
    {
      namespace: 'l2l_city',
      key: 'rebate_notice',
      value: cityData.rebate_notice || '',
      type: 'multi_line_text_field'
    }
  ];

  // Update page with metafields
  const mutation = `
    mutation UpdatePage($id: ID!, $page: PageUpdateInput!) {
      pageUpdate(id: $id, page: $page) {
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
    id: page.node.id,
    page: {
      metafields: metafields.filter(mf => mf.value !== '') // Only include non-empty values
    }
  };

  const result = await graphqlRequest(mutation, variables);

  if (result.pageUpdate.userErrors.length > 0) {
    console.error(`❌ Error updating ${cityData.city_name}:`, result.pageUpdate.userErrors);
    return null;
  }

  return result.pageUpdate.page;
}

// Main execution
async function main() {
  const cities = ['tucson', 'austin', 'los-angeles', 'portland'];

  console.log('📝 Updating city pages with individual metafields...\n');

  for (const city of cities) {
    try {
      const cityData = JSON.parse(await fs.readFile(`cities/${city}.json`, 'utf-8'));
      const page = await updatePageWithSimpleMetafields(cityData);
      if (page) {
        console.log(`✅ Updated: ${page.title}`);
        console.log(`   Handle: ${page.handle}`);
      }
    } catch (error) {
      console.error(`❌ Failed to update ${city}:`, error.message);
    }
  }

  console.log('\n✅ Migration complete!');
  console.log('\n📍 View metafields in Shopify Admin:');
  console.log('   Pages > [Select a city page] > Metafields section');
}

main().catch(console.error);
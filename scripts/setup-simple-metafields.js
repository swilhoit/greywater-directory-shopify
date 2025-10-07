#!/usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';

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

async function createMetafieldDefinition(definition) {
  const mutation = `
    mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition {
          id
          name
          namespace
          key
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const result = await graphqlRequest(mutation, { definition });
    if (result.metafieldDefinitionCreate.userErrors.length > 0) {
      console.log(`⚠️  ${definition.namespace}.${definition.key}: ${result.metafieldDefinitionCreate.userErrors[0].message}`);
    } else {
      console.log(`✅ Created: ${definition.namespace}.${definition.key} (${definition.name})`);
    }
  } catch (error) {
    console.error(`❌ Error creating ${definition.namespace}.${definition.key}:`, error.message);
  }
}

async function setupMetafields() {
  console.log('📝 Creating individual metafield definitions for L2L city pages...\n');

  const definitions = [
    // Location Information
    {
      name: 'City Name',
      namespace: 'l2l_city',
      key: 'city_name',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Name of the city'
    },

    // Rebate Notice
    {
      name: 'Rebate Notice',
      namespace: 'l2l_city',
      key: 'rebate_notice',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Rebate or incentive notice text for the city'
    }
  ];

  // Create all definitions
  for (const def of definitions) {
    await createMetafieldDefinition(def);
  }

  console.log('\n✅ Metafield setup complete!');
  console.log('\n📍 Next steps:');
  console.log('   1. Run: node scripts/migrate-city-metafields.js');
  console.log('   2. View metafields in Shopify Admin > Settings > Custom data > Pages');
  console.log('   3. Pin the fields you want to see in page editor');
}

setupMetafields().catch(console.error);
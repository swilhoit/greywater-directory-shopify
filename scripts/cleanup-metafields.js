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

async function listMetafieldDefinitions() {
  const query = `
    query {
      metafieldDefinitions(first: 100, ownerType: PAGE) {
        edges {
          node {
            id
            name
            namespace
            key
            type {
              name
            }
            ownerType
          }
        }
      }
    }
  `;

  const result = await graphqlRequest(query);
  return result.metafieldDefinitions.edges.map(edge => edge.node);
}

async function deleteMetafieldDefinition(id) {
  const mutation = `
    mutation DeleteMetafieldDefinition($id: ID!) {
      metafieldDefinitionDelete(id: $id) {
        deletedDefinitionId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await graphqlRequest(mutation, { id });
  return result.metafieldDefinitionDelete;
}

async function cleanupMetafields() {
  console.log('🔍 Fetching all metafield definitions...\n');

  const definitions = await listMetafieldDefinitions();

  // Filter for l2l_city namespace metafields
  const l2lDefinitions = definitions.filter(def => def.namespace === 'l2l_city');

  console.log('📋 Found l2l_city metafield definitions:');
  l2lDefinitions.forEach(def => {
    console.log(`   ${def.namespace}.${def.key} - ${def.name}`);
  });

  // Keep only city_name and rebate_notice
  const fieldsToKeep = ['city_name', 'rebate_notice'];
  const definitionsToDelete = l2lDefinitions.filter(def => !fieldsToKeep.includes(def.key));

  if (definitionsToDelete.length === 0) {
    console.log('\n✅ No metafields need to be deleted!');
    return;
  }

  console.log('\n🗑️  Will delete the following metafields:');
  definitionsToDelete.forEach(def => {
    console.log(`   ❌ ${def.namespace}.${def.key} - ${def.name}`);
  });

  console.log('\n🔒 Will keep these metafields:');
  const definitionsToKeep = l2lDefinitions.filter(def => fieldsToKeep.includes(def.key));
  definitionsToKeep.forEach(def => {
    console.log(`   ✅ ${def.namespace}.${def.key} - ${def.name}`);
  });

  console.log('\n⚠️  WARNING: This will permanently delete metafield definitions and all their data!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

  // Wait 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('🚀 Starting deletion...\n');

  for (const def of definitionsToDelete) {
    try {
      const result = await deleteMetafieldDefinition(def.id);
      if (result.userErrors.length > 0) {
        console.log(`❌ Error deleting ${def.namespace}.${def.key}: ${result.userErrors[0].message}`);
      } else {
        console.log(`✅ Deleted: ${def.namespace}.${def.key} - ${def.name}`);
      }
    } catch (error) {
      console.error(`❌ Error deleting ${def.namespace}.${def.key}:`, error.message);
    }
  }

  console.log('\n🎉 Cleanup complete!');
  console.log('\n📝 Remaining l2l_city metafields:');
  console.log('   • city_name - City Name');
  console.log('   • rebate_notice - Rebate Notice');
}

// Add list-only mode
const args = process.argv.slice(2);
if (args.includes('--list-only')) {
  console.log('📋 Listing metafield definitions only...\n');
  const definitions = await listMetafieldDefinitions();
  const l2lDefinitions = definitions.filter(def => def.namespace === 'l2l_city');

  console.log('Found l2l_city metafield definitions:');
  if (l2lDefinitions.length === 0) {
    console.log('   (none found)');
  } else {
    l2lDefinitions.forEach(def => {
      console.log(`   ${def.namespace}.${def.key} - ${def.name} (${def.type.name})`);
    });
  }
  process.exit(0);
}

cleanupMetafields().catch(console.error);
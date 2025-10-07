#!/usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const shopUrl = process.env.SHOPIFY_STORE_DOMAIN || 'waterwisegroup.myshopify.com';
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiUrl = `https://${shopUrl}/admin/api/2024-10/graphql.json`;

async function graphqlRequest(query) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  if (data.errors) {
    console.error('GraphQL Errors:', data.errors);
    return null;
  }
  return data.data;
}

async function verifyPages() {
  const query = `{
    pages(first: 50) {
      edges {
        node {
          id
          handle
          title
          templateSuffix
          metafields(first: 10) {
            edges {
              node {
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    }
  }`;

  const data = await graphqlRequest(query);

  if (!data || !data.pages) {
    console.error('Failed to fetch pages');
    return;
  }

  console.log('\n📍 City L2L Pages Status:\n');
  console.log('=' .repeat(80));

  data.pages.edges.forEach(edge => {
    const page = edge.node;
    console.log(`\n📄 ${page.title}`);
    console.log(`   URL: https://${shopUrl}/pages/${page.handle}`);
    console.log(`   Template: ${page.templateSuffix || 'default'}`);
    console.log(`   Page ID: ${page.id}`);

    if (page.metafields.edges.length > 0) {
      console.log(`   ✅ Metafields (${page.metafields.edges.length} found):`);
      page.metafields.edges.forEach(mf => {
        const metafield = mf.node;
        console.log(`      - ${metafield.namespace}.${metafield.key} (${metafield.type})`);
        if (metafield.key === 'hero_content' || metafield.key === 'city_info') {
          try {
            const value = JSON.parse(metafield.value);
            if (metafield.key === 'hero_content') {
              console.log(`        Heading: "${value.heading?.substring(0, 50)}..."`);
            }
            if (metafield.key === 'city_info') {
              console.log(`        City: ${value.city}, ${value.state}`);
              console.log(`        Water District: ${value.water_district}`);
            }
          } catch (e) {
            // Not JSON
          }
        }
      });
    } else {
      console.log(`   ⚠️  No metafields found`);
    }
  });

  console.log('\n' + '=' .repeat(80));
  console.log('\n💡 To pin metafields in Shopify Admin:');
  console.log('   1. Go to Settings > Custom data > Pages');
  console.log('   2. Add metafield definitions for l2l namespace');
  console.log('   3. Or go to any page in admin and click "Show all" under Metafields');
  console.log('\n💡 To view a page with metafields:');
  console.log(`   Visit: https://${shopUrl}/pages/l2l-tucson`);
  console.log('\n💡 To update page content:');
  console.log('   node scripts/manage-page-content.js update l2l-tucson -f cities/tucson.json\n');
}

verifyPages().catch(console.error);
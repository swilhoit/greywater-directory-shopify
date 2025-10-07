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

async function createIndividualMetafields() {
  console.log('🔧 Creating individual metafield definitions to replace JSON fields...\n');

  // Individual fields that will replace the JSON metafields
  const definitions = [
    // Hero Content Fields (replaces l2l.hero_content)
    {
      name: 'Hero Heading',
      namespace: 'l2l_individual',
      key: 'hero_heading',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Main heading for the hero section'
    },
    {
      name: 'Hero Subheading',
      namespace: 'l2l_individual',
      key: 'hero_subheading',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Subheading text for the hero section'
    },
    {
      name: 'Hero Button Text',
      namespace: 'l2l_individual',
      key: 'hero_button_text',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Call to action button text'
    },
    {
      name: 'Hero Button URL',
      namespace: 'l2l_individual',
      key: 'hero_button_url',
      type: 'url',
      ownerType: 'PAGE',
      description: 'Call to action button link'
    },
    {
      name: 'Hero Image URL',
      namespace: 'l2l_individual',
      key: 'hero_image_url',
      type: 'url',
      ownerType: 'PAGE',
      description: 'URL for hero section image'
    },

    // Statistics Fields (replaces l2l.statistics array)
    {
      name: 'Stat 1 Value',
      namespace: 'l2l_individual',
      key: 'stat1_value',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'First statistic value (e.g., 15,000)'
    },
    {
      name: 'Stat 1 Suffix',
      namespace: 'l2l_individual',
      key: 'stat1_suffix',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'First statistic suffix (e.g., gal, +, %)'
    },
    {
      name: 'Stat 1 Label',
      namespace: 'l2l_individual',
      key: 'stat1_label',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'First statistic label'
    },
    {
      name: 'Stat 1 Description',
      namespace: 'l2l_individual',
      key: 'stat1_description',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'First statistic description'
    },
    {
      name: 'Stat 1 Icon',
      namespace: 'l2l_individual',
      key: 'stat1_icon',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'First statistic icon (emoji)'
    },

    {
      name: 'Stat 2 Value',
      namespace: 'l2l_individual',
      key: 'stat2_value',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Second statistic value'
    },
    {
      name: 'Stat 2 Suffix',
      namespace: 'l2l_individual',
      key: 'stat2_suffix',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Second statistic suffix'
    },
    {
      name: 'Stat 2 Label',
      namespace: 'l2l_individual',
      key: 'stat2_label',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Second statistic label'
    },
    {
      name: 'Stat 2 Description',
      namespace: 'l2l_individual',
      key: 'stat2_description',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Second statistic description'
    },
    {
      name: 'Stat 2 Icon',
      namespace: 'l2l_individual',
      key: 'stat2_icon',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Second statistic icon (emoji)'
    },

    {
      name: 'Stat 3 Value',
      namespace: 'l2l_individual',
      key: 'stat3_value',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Third statistic value'
    },
    {
      name: 'Stat 3 Suffix',
      namespace: 'l2l_individual',
      key: 'stat3_suffix',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Third statistic suffix'
    },
    {
      name: 'Stat 3 Label',
      namespace: 'l2l_individual',
      key: 'stat3_label',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Third statistic label'
    },
    {
      name: 'Stat 3 Description',
      namespace: 'l2l_individual',
      key: 'stat3_description',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Third statistic description'
    },
    {
      name: 'Stat 3 Icon',
      namespace: 'l2l_individual',
      key: 'stat3_icon',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Third statistic icon (emoji)'
    },

    {
      name: 'Stat 4 Value',
      namespace: 'l2l_individual',
      key: 'stat4_value',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Fourth statistic value'
    },
    {
      name: 'Stat 4 Suffix',
      namespace: 'l2l_individual',
      key: 'stat4_suffix',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Fourth statistic suffix'
    },
    {
      name: 'Stat 4 Label',
      namespace: 'l2l_individual',
      key: 'stat4_label',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Fourth statistic label'
    },
    {
      name: 'Stat 4 Description',
      namespace: 'l2l_individual',
      key: 'stat4_description',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Fourth statistic description'
    },
    {
      name: 'Stat 4 Icon',
      namespace: 'l2l_individual',
      key: 'stat4_icon',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Fourth statistic icon (emoji)'
    },

    // Features Fields (replaces l2l.features)
    {
      name: 'Feature 1 Title',
      namespace: 'l2l_individual',
      key: 'feature1_title',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'First feature title'
    },
    {
      name: 'Feature 1 Description',
      namespace: 'l2l_individual',
      key: 'feature1_description',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'First feature description'
    },
    {
      name: 'Feature 1 Icon',
      namespace: 'l2l_individual',
      key: 'feature1_icon',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'First feature icon (emoji)'
    },

    {
      name: 'Feature 2 Title',
      namespace: 'l2l_individual',
      key: 'feature2_title',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Second feature title'
    },
    {
      name: 'Feature 2 Description',
      namespace: 'l2l_individual',
      key: 'feature2_description',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Second feature description'
    },
    {
      name: 'Feature 2 Icon',
      namespace: 'l2l_individual',
      key: 'feature2_icon',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Second feature icon (emoji)'
    },

    {
      name: 'Feature 3 Title',
      namespace: 'l2l_individual',
      key: 'feature3_title',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Third feature title'
    },
    {
      name: 'Feature 3 Description',
      namespace: 'l2l_individual',
      key: 'feature3_description',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Third feature description'
    },
    {
      name: 'Feature 3 Icon',
      namespace: 'l2l_individual',
      key: 'feature3_icon',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Third feature icon (emoji)'
    },

    // FAQ Fields (replaces l2l.faq)
    {
      name: 'FAQ 1 Question',
      namespace: 'l2l_individual',
      key: 'faq1_question',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'First FAQ question'
    },
    {
      name: 'FAQ 1 Answer',
      namespace: 'l2l_individual',
      key: 'faq1_answer',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'First FAQ answer'
    },

    {
      name: 'FAQ 2 Question',
      namespace: 'l2l_individual',
      key: 'faq2_question',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Second FAQ question'
    },
    {
      name: 'FAQ 2 Answer',
      namespace: 'l2l_individual',
      key: 'faq2_answer',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Second FAQ answer'
    },

    {
      name: 'FAQ 3 Question',
      namespace: 'l2l_individual',
      key: 'faq3_question',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Third FAQ question'
    },
    {
      name: 'FAQ 3 Answer',
      namespace: 'l2l_individual',
      key: 'faq3_answer',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Third FAQ answer'
    },

    {
      name: 'FAQ 4 Question',
      namespace: 'l2l_individual',
      key: 'faq4_question',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Fourth FAQ question'
    },
    {
      name: 'FAQ 4 Answer',
      namespace: 'l2l_individual',
      key: 'faq4_answer',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Fourth FAQ answer'
    },

    {
      name: 'FAQ 5 Question',
      namespace: 'l2l_individual',
      key: 'faq5_question',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Fifth FAQ question'
    },
    {
      name: 'FAQ 5 Answer',
      namespace: 'l2l_individual',
      key: 'faq5_answer',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Fifth FAQ answer'
    },

    // CTA Fields (replaces l2l.cta)
    {
      name: 'CTA Heading',
      namespace: 'l2l_individual',
      key: 'cta_heading',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Call to action heading'
    },
    {
      name: 'CTA Text',
      namespace: 'l2l_individual',
      key: 'cta_text',
      type: 'multi_line_text_field',
      ownerType: 'PAGE',
      description: 'Call to action description text'
    },
    {
      name: 'CTA Button Text',
      namespace: 'l2l_individual',
      key: 'cta_button_text',
      type: 'single_line_text_field',
      ownerType: 'PAGE',
      description: 'Call to action button text'
    },
    {
      name: 'CTA Button URL',
      namespace: 'l2l_individual',
      key: 'cta_button_url',
      type: 'url',
      ownerType: 'PAGE',
      description: 'Call to action button link'
    }
  ];

  // Create all definitions
  for (const def of definitions) {
    await createMetafieldDefinition(def);
  }

  console.log(`\n✅ Created ${definitions.length} individual metafield definitions!`);
  console.log('\n📍 Next steps:');
  console.log('   1. Review metafields in Shopify Admin > Settings > Custom data > Pages');
  console.log('   2. Update your templates to use individual fields instead of JSON');
  console.log('   3. Consider running a migration script to move data from JSON to individual fields');
}

createIndividualMetafields().catch(console.error);
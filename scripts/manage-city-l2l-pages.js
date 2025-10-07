#!/usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

class CityL2LManager {
  constructor() {
    this.shopUrl = process.env.SHOPIFY_STORE_DOMAIN || process.env.DEV_STORE_URL || 'waterwisegroup.myshopify.com';
    this.accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_API_TOKEN;
    this.apiVersion = '2024-10';

    if (!this.accessToken) {
      throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN not found in environment variables');
    }

    this.baseUrl = `https://${this.shopUrl}/admin/api/${this.apiVersion}`;
  }

  async graphqlRequest(query, variables = {}) {
    const response = await fetch(`${this.baseUrl}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    if (data.errors) {
      throw new Error(JSON.stringify(data.errors, null, 2));
    }
    return data.data;
  }

  slugify(text) {
    return text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .trim();
  }

  async createOrUpdatePage(cityData) {
    const handle = `l2l-${this.slugify(cityData.city_name)}`;
    const title = `Laundry to Landscape Systems in ${cityData.city_name}`;

    // First check if page exists
    const existingPage = await this.getPageByHandle(handle);

    if (existingPage) {
      console.log(`📝 Updating existing page: ${handle}`);
      return await this.updatePage(existingPage.id, cityData, title);
    } else {
      console.log(`✨ Creating new page: ${handle}`);
      return await this.createPage(handle, title, cityData);
    }
  }

  async getPageByHandle(handle) {
    const query = `
      query GetPages {
        pages(first: 100) {
          edges {
            node {
              id
              title
              handle
              metafields(first: 20, namespace: "city_l2l") {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.graphqlRequest(query);
    const pages = result.pages.edges;
    const page = pages.find(edge => edge.node.handle === handle);
    return page ? page.node : null;
  }

  async createPage(handle, title, cityData) {
    // Generate content based on city data
    const content = this.generatePageContent(cityData);

    const metafields = this.prepareMetafields(cityData);

    const mutation = `
      mutation CreatePage($input: PageInput!) {
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
        content: content,
        isPublished: true,
        templateSuffix: 'l2l-greywater',
        metafields: metafields
      }
    };

    const result = await this.graphqlRequest(mutation, variables);

    if (result.pageCreate.userErrors.length > 0) {
      throw new Error(JSON.stringify(result.pageCreate.userErrors));
    }

    return result.pageCreate.page;
  }

  async updatePage(pageId, cityData, title) {
    const metafields = this.prepareMetafields(cityData);
    const content = this.generatePageContent(cityData);

    const mutation = `
      mutation UpdatePage($id: ID!, $page: PageInput!) {
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
      id: pageId,
      page: {
        title: title,
        content: content,
        metafields: metafields
      }
    };

    const result = await this.graphqlRequest(mutation, variables);

    if (result.pageUpdate.userErrors.length > 0) {
      throw new Error(JSON.stringify(result.pageUpdate.userErrors));
    }

    return result.pageUpdate.page;
  }

  prepareMetafields(cityData) {
    const metafields = [];

    // City-specific hero content
    metafields.push({
      namespace: 'city_l2l',
      key: 'hero_content',
      value: JSON.stringify({
        heading: `Laundry to Landscape Systems in ${cityData.city_name}`,
        subheading: cityData.hero_subheading || `Save ${cityData.water_savings_percent || '40'}% on water bills while keeping your ${cityData.city_name} garden thriving year-round`,
        button_text: `Get Started in ${cityData.city_name}`,
        button_url: '#get-started',
        image_url: cityData.hero_image_url
      }),
      type: 'json'
    });

    // City-specific statistics
    metafields.push({
      namespace: 'city_l2l',
      key: 'statistics',
      value: JSON.stringify([
        {
          value: cityData.annual_water_savings || '15,000',
          suffix: 'gal',
          label: 'Water Saved Annually',
          description: `Average ${cityData.city_name} household`,
          icon: '💧'
        },
        {
          value: cityData.annual_cost_savings || '$450',
          suffix: '/year',
          label: `${cityData.city_name} Savings`,
          description: 'Based on local water rates',
          icon: '💰'
        },
        {
          value: cityData.drought_days || '120',
          suffix: 'days',
          label: 'Drought Days/Year',
          description: `${cityData.city_name} average`,
          icon: '☀️'
        },
        {
          value: cityData.rebate_amount || '$400',
          suffix: '',
          label: 'Local Rebates',
          description: `${cityData.city_name} water district`,
          icon: '🏦'
        }
      ]),
      type: 'json'
    });

    // Local information
    metafields.push({
      namespace: 'city_l2l',
      key: 'local_info',
      value: JSON.stringify({
        city_name: cityData.city_name,
        state: cityData.state,
        water_district: cityData.water_district,
        permit_required: cityData.permit_required || false,
        permit_info: cityData.permit_info,
        local_codes: cityData.local_codes,
        rebate_program: cityData.rebate_program,
        rebate_url: cityData.rebate_url,
        water_cost_per_gallon: cityData.water_cost_per_gallon,
        average_rainfall: cityData.average_rainfall,
        climate_zone: cityData.climate_zone
      }),
      type: 'json'
    });

    // Local installers
    if (cityData.installers) {
      metafields.push({
        namespace: 'city_l2l',
        key: 'installers',
        value: JSON.stringify(cityData.installers),
        type: 'json'
      });
    }

    // Local resources
    if (cityData.resources) {
      metafields.push({
        namespace: 'city_l2l',
        key: 'resources',
        value: JSON.stringify(cityData.resources),
        type: 'json'
      });
    }

    // Climate-specific tips
    metafields.push({
      namespace: 'city_l2l',
      key: 'local_tips',
      value: JSON.stringify(cityData.local_tips || [
        `Best plants for ${cityData.city_name}'s climate`,
        `Seasonal maintenance for ${cityData.state} weather`,
        'Local soil considerations',
        'Drought-resistant landscaping options'
      ]),
      type: 'json'
    });

    return metafields;
  }

  generatePageContent(cityData) {
    return `
<div class="city-l2l-intro">
  <p>Transform your washing machine water into a thriving landscape with a Laundry to Landscape (L2L) greywater system, perfectly suited for ${cityData.city_name}'s climate and water conservation needs.</p>

  ${cityData.water_district ? `<p><strong>Local Support:</strong> ${cityData.water_district} ${cityData.rebate_program ? `offers rebates up to ${cityData.rebate_amount || '$400'} for greywater systems.` : 'supports water conservation initiatives.'}</p>` : ''}

  ${cityData.permit_required === false ? `<p><strong>Good News:</strong> No permit required for washing machine greywater systems in ${cityData.city_name}!</p>` : ''}
</div>

<div class="city-l2l-benefits">
  <h2>Why L2L Works Great in ${cityData.city_name}</h2>
  <ul>
    <li>Average rainfall: ${cityData.average_rainfall || 'Variable'} - greywater supplements natural precipitation</li>
    <li>Water costs: ${cityData.water_cost_per_gallon ? `$${cityData.water_cost_per_gallon}/gallon` : 'Rising annually'} - save money every month</li>
    <li>Climate zone: ${cityData.climate_zone || 'Ideal for year-round greywater use'}</li>
    ${cityData.drought_days ? `<li>${cityData.drought_days}+ drought days annually - every drop counts</li>` : ''}
  </ul>
</div>
    `.trim();
  }

  async loadCityData(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  async createMetafieldDefinitions() {
    const definitions = [
      {
        name: 'City L2L Hero Content',
        namespace: 'city_l2l',
        key: 'hero_content',
        type: 'json',
        ownerType: 'PAGE'
      },
      {
        name: 'City Statistics',
        namespace: 'city_l2l',
        key: 'statistics',
        type: 'json',
        ownerType: 'PAGE'
      },
      {
        name: 'Local Information',
        namespace: 'city_l2l',
        key: 'local_info',
        type: 'json',
        ownerType: 'PAGE'
      },
      {
        name: 'Local Installers',
        namespace: 'city_l2l',
        key: 'installers',
        type: 'json',
        ownerType: 'PAGE'
      },
      {
        name: 'Local Resources',
        namespace: 'city_l2l',
        key: 'resources',
        type: 'json',
        ownerType: 'PAGE'
      },
      {
        name: 'Local Tips',
        namespace: 'city_l2l',
        key: 'local_tips',
        type: 'json',
        ownerType: 'PAGE'
      }
    ];

    for (const def of definitions) {
      const mutation = `
        mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition {
              id
              name
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      try {
        const result = await this.graphqlRequest(mutation, { definition: def });
        if (result.metafieldDefinitionCreate.userErrors.length > 0) {
          console.log(`⚠️  ${def.namespace}.${def.key}: ${result.metafieldDefinitionCreate.userErrors[0].message}`);
        } else {
          console.log(`✅ Created: ${def.namespace}.${def.key}`);
        }
      } catch (error) {
        console.error(`❌ Error creating ${def.namespace}.${def.key}:`, error.message);
      }
    }
  }
}

// CLI Commands
program
  .name('manage-city-l2l-pages')
  .description('Manage city-specific L2L pages')
  .version('1.0.0');

program
  .command('setup')
  .description('Create metafield definitions for city L2L pages')
  .action(async () => {
    try {
      const manager = new CityL2LManager();
      await manager.createMetafieldDefinitions();
      console.log('✅ Setup complete');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('create <city-file>')
  .description('Create or update a city L2L page from JSON file')
  .action(async (cityFile) => {
    try {
      const manager = new CityL2LManager();
      const cityData = await manager.loadCityData(cityFile);
      const page = await manager.createOrUpdatePage(cityData);
      console.log(`✅ Page ready: ${page.handle}`);
      console.log(`📍 City: ${cityData.city_name}`);
      console.log(`🔗 URL: /pages/${page.handle}`);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('bulk <directory>')
  .description('Create multiple city pages from a directory of JSON files')
  .action(async (directory) => {
    try {
      const manager = new CityL2LManager();
      const files = await fs.readdir(directory);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles) {
        console.log(`\n📄 Processing: ${file}`);
        const cityData = await manager.loadCityData(path.join(directory, file));
        const page = await manager.createOrUpdatePage(cityData);
        console.log(`✅ Created: ${page.handle}`);
      }

      console.log(`\n✅ Processed ${jsonFiles.length} cities`);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all city L2L pages')
  .action(async () => {
    try {
      const manager = new CityL2LManager();

      const query = `
        query {
          pages(first: 100, query: "handle:l2l-*") {
            edges {
              node {
                id
                title
                handle
                metafields(first: 1, namespace: "city_l2l") {
                  edges {
                    node {
                      key
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const result = await manager.graphqlRequest(query);

      console.log('\n📍 City L2L Pages:\n');
      for (const edge of result.pages.edges) {
        const page = edge.node;
        if (page.handle.startsWith('l2l-') && page.metafields.edges.length > 0) {
          const cityName = page.title.replace('Laundry to Landscape Systems in ', '');
          console.log(`• ${cityName} - /pages/${page.handle}`);
        }
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();
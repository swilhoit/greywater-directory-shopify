#!/usr/bin/env node

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

class ShopifyContentManager {
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

  async createMetafieldDefinitions() {
    const definitions = [
      {
        name: 'Hero Content',
        namespace: 'l2l',
        key: 'hero_content',
        type: 'json',
        ownerType: 'PAGE',
        description: 'Hero section content for L2L pages'
      },
      {
        name: 'Statistics',
        namespace: 'l2l',
        key: 'statistics',
        type: 'json',
        ownerType: 'PAGE',
        description: 'Statistics data for L2L pages'
      },
      {
        name: 'Features',
        namespace: 'l2l',
        key: 'features',
        type: 'json',
        ownerType: 'PAGE',
        description: 'Features list for L2L pages'
      },
      {
        name: 'FAQ',
        namespace: 'l2l',
        key: 'faq',
        type: 'json',
        ownerType: 'PAGE',
        description: 'FAQ items for L2L pages'
      },
      {
        name: 'CTA',
        namespace: 'l2l',
        key: 'cta',
        type: 'json',
        ownerType: 'PAGE',
        description: 'Call to action content for L2L pages'
      }
    ];

    for (const def of definitions) {
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
        const result = await this.graphqlRequest(mutation, { definition: def });
        if (result.metafieldDefinitionCreate.userErrors.length > 0) {
          console.log(`⚠️  ${def.namespace}.${def.key}: ${result.metafieldDefinitionCreate.userErrors[0].message}`);
        } else {
          console.log(`✅ Created metafield definition: ${def.namespace}.${def.key}`);
        }
      } catch (error) {
        console.error(`❌ Error creating ${def.namespace}.${def.key}:`, error.message);
      }
    }
  }

  async getPageByHandle(handle) {
    const query = `
      query GetPages {
        pages(first: 50) {
          edges {
            node {
              id
              title
              handle
              metafields(first: 10, namespace: "l2l") {
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

  async updatePageContent(handle, contentData) {
    const page = await this.getPageByHandle(handle);
    if (!page) {
      throw new Error(`Page with handle "${handle}" not found`);
    }

    const metafields = [];

    for (const [key, value] of Object.entries(contentData)) {
      metafields.push({
        namespace: 'l2l',
        key: key,
        value: JSON.stringify(value),
        type: 'json'
      });
    }

    const mutation = `
      mutation UpdatePageMetafields($id: ID!, $metafields: [MetafieldInput!]!) {
        pageUpdate(
          id: $id
          page: {
            metafields: $metafields
          }
        ) {
          page {
            id
            handle
            metafields(first: 10) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const result = await this.graphqlRequest(mutation, { id: page.id, metafields });

    if (result.pageUpdate.userErrors.length > 0) {
      throw new Error(JSON.stringify(result.pageUpdate.userErrors));
    }

    return result.pageUpdate.page;
  }

  async loadContentFromFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  async saveContentToFile(handle, filePath) {
    const page = await this.getPageByHandle(handle);
    if (!page) {
      throw new Error(`Page with handle "${handle}" not found`);
    }

    const content = {};
    for (const edge of page.metafields.edges) {
      const { namespace, key, value } = edge.node;
      if (namespace === 'l2l') {
        try {
          content[key] = JSON.parse(value);
        } catch {
          content[key] = value;
        }
      }
    }

    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    return content;
  }
}

// CLI Commands
program
  .name('manage-page-content')
  .description('Manage Shopify page content via metafields')
  .version('1.0.0');

program
  .command('setup')
  .description('Create metafield definitions for L2L pages')
  .action(async () => {
    try {
      const manager = new ShopifyContentManager();
      await manager.createMetafieldDefinitions();
      console.log('✅ Metafield definitions setup complete');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('update <handle>')
  .description('Update page content from JSON file')
  .option('-f, --file <path>', 'JSON file with content data')
  .action(async (handle, options) => {
    try {
      const manager = new ShopifyContentManager();

      let contentData;
      if (options.file) {
        contentData = await manager.loadContentFromFile(options.file);
      } else {
        // Default content structure
        contentData = {
          hero_content: {
            heading: "Laundry to Landscape Greywater Systems",
            subheading: "Save water, save money, and help your garden thrive",
            button_text: "Get Started",
            button_url: "#installation"
          },
          statistics: [
            { value: "10000+", label: "Gallons Saved Yearly", icon: "💧" },
            { value: "$300", label: "Annual Savings", icon: "💰" },
            { value: "40%", label: "Less Water Use", icon: "🌱" },
            { value: "2 days", label: "Installation", icon: "⏱️" }
          ],
          features: [
            {
              title: "Simple Installation",
              description: "DIY-friendly system that can be installed in a weekend",
              icon: "🔧"
            },
            {
              title: "Cost Effective",
              description: "Pay for itself in water savings within 1-2 years",
              icon: "💵"
            },
            {
              title: "Environmentally Friendly",
              description: "Reduce water waste and help your garden flourish",
              icon: "🌍"
            }
          ]
        };
      }

      const result = await manager.updatePageContent(handle, contentData);
      console.log(`✅ Updated page: ${handle}`);
      console.log('📝 Metafields updated:', result.metafields.edges.length);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('export <handle>')
  .description('Export page content to JSON file')
  .option('-o, --output <path>', 'Output file path', './page-content.json')
  .action(async (handle, options) => {
    try {
      const manager = new ShopifyContentManager();
      const content = await manager.saveContentToFile(handle, options.output);
      console.log(`✅ Exported content for page: ${handle}`);
      console.log(`📁 Saved to: ${options.output}`);
      console.log(`📝 Fields exported: ${Object.keys(content).join(', ')}`);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all pages and their metafields')
  .action(async () => {
    try {
      const manager = new ShopifyContentManager();

      const query = `
        query {
          pages(first: 50) {
            edges {
              node {
                id
                title
                handle
                metafields(first: 10, namespace: "l2l") {
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

      console.log('\n📄 Pages with L2L metafields:\n');
      for (const edge of result.pages.edges) {
        const page = edge.node;
        if (page.metafields.edges.length > 0) {
          console.log(`• ${page.title} (${page.handle})`);
          console.log(`  Metafields: ${page.metafields.edges.map(m => m.node.key).join(', ')}`);
        }
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();
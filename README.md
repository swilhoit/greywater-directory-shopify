# Greywater Directory - Shopify App Proxy

A state-by-state directory of greywater laws and regulations, adapted from the WaterWise repository for integration with Shopify via App Proxy.

## Overview

This project extracts the directory functionality from the WaterWise repository and adapts it for use as a Shopify App Proxy. It provides a comprehensive, searchable directory of greywater regulations across all 50 US states.

## Features

- **Comprehensive State Directory**: Complete regulatory information for all 50 states
- **Interactive Interface**: Card and table views with filtering capabilities
- **Shopify App Proxy Compatible**: Designed to work seamlessly with Shopify's App Proxy system
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Statistics**: Dynamic counts of states by legal status

## Directory Information Includes

For each state:
- Legal status and regulatory classification
- Permit requirements and thresholds
- Indoor/outdoor use permissions
- Approved uses and key restrictions
- Government agency contacts
- Recent regulatory changes

## Installation

### 1. Clone and Setup
```bash
git clone <your-repo>
cd greywater-directory-shopify
npm install
```

### 2. Local Development
```bash
npm run dev
```
Access at: http://localhost:3000/greywater-directory

### 3. Deploy to Your Platform
Deploy to Vercel, Netlify, Heroku, or your preferred hosting platform.

## Shopify App Proxy Setup

### 1. Create App Proxy in Shopify
1. Go to your Shopify Partner Dashboard
2. Select your app
3. Navigate to App Setup > App Proxy
4. Configure the following settings:

**Subpath prefix**: `apps`
**Subpath**: `greywater-directory`
**URL**: `https://your-domain.com/apps/greywater-directory`

### 2. Environment Variables
Set the following environment variable for security:
```
SHOPIFY_PROXY_SECRET=your-shopify-app-secret
```

### 3. Access URLs
Once configured, the directory will be accessible at:
```
https://yourstore.myshopify.com/apps/greywater-directory
```

## API Endpoints

The system supports several query parameters:

### Main Directory
```
GET /apps/greywater-directory
Returns the full HTML directory page
```

### Get All States Data
```
GET /apps/greywater-directory?action=data
Returns JSON data for all states
```

### Get Specific State
```
GET /apps/greywater-directory?action=state&state=California
Returns detailed information for a specific state
```

### Get Statistics
```
GET /apps/greywater-directory?action=stats
Returns summary statistics across all states
```

## File Structure

```
greywater-directory-shopify/
├── api/
│   └── greywater-directory.js    # Main App Proxy handler
├── lib/
│   └── greywater-laws.ts         # Utility functions
├── pages/
│   └── greywater-directory.html  # Main directory interface
├── greywater-state-directory.json # State data
├── package.json
├── server.js                     # Local development server
└── README.md
```

## Customization

### Styling
The directory uses inline CSS for portability. You can customize:
- Colors and branding in the CSS section
- Layout and typography
- Status badge styles

### Data
Update `greywater-state-directory.json` to modify state information.

### Functionality
Extend the JavaScript in the HTML file to add:
- Search functionality
- Advanced filtering
- State detail modals

## Security

The system includes optional Shopify request verification using HMAC signatures. Set the `SHOPIFY_PROXY_SECRET` environment variable to enable verification.

## Legal Notice

This directory provides general guidance only and may not reflect the most current regulations. Greywater laws vary by state, county, and municipality. Always consult local authorities before installing greywater systems.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
1. Check the README and documentation
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Original Data Source**: Extracted and adapted from the WaterWise repository (https://github.com/swilhoit/waterwise) with comprehensive state-by-state greywater regulatory information.
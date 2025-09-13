// Shopify App Proxy handler for the Greywater Directory
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load state directory data
function loadStateData() {
    try {
        const dataPath = path.join(__dirname, '../greywater-state-directory.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Error loading state data:', error);
        return null;
    }
}

// Verify Shopify App Proxy request authenticity
function verifyShopifyProxyRequest(query, secret) {
    if (!secret) return true; // Skip verification if no secret provided
    
    const { signature, ...params } = query;
    
    if (!signature) return false;
    
    // Sort parameters and create query string (Shopify format)
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
    
    console.log('Sorted params for signature:', sortedParams);
    
    // Generate expected signature
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(sortedParams)
        .digest('hex');
    
    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', signature);
    
    return signature === expectedSignature;
}

// Generate HTML for state detail page
function generateStatePageHTML(state) {
    const getStatusClass = (status) => status.toLowerCase().replace(/\s+/g, '-');
    
    return `
    <div class="page-width">
        <div class="breadcrumbs">
            <a href="/tools/greywater-directory">← Back to Directory</a>
        </div>

        <div class="state-detail-container">
            <div class="state-header">
                <h1 class="state-name">${state.state}</h1>
                <div class="state-status ${getStatusClass(state.status)}">${state.status}</div>
                <p class="state-description">${state.description}</p>
            </div>

            <div class="info-grid">
                <div class="info-card">
                    <h3>Permit Requirements</h3>
                    <p class="permit-status ${state.permitRequired === 'Yes' ? 'permit-required' : 'permit-not-required'}">
                        ${state.permitRequired === 'Yes' ? 'Permit Required' : 'No Permit Required'}
                    </p>
                    <p style="margin-top: 15px;">${state.details}</p>
                </div>

                <div class="info-card">
                    <h3>Usage Permissions</h3>
                    <ul>
                        <li>
                            <span class="usage-indicator ${state.indoorUseAllowed ? 'usage-allowed' : 'usage-not-allowed'}">
                                ${state.indoorUseAllowed ? '✓' : '✗'}
                            </span>
                            Indoor Use ${state.indoorUseAllowed ? 'Allowed' : 'Not Allowed'}
                        </li>
                        <li>
                            <span class="usage-indicator ${state.outdoorUseAllowed ? 'usage-allowed' : 'usage-not-allowed'}">
                                ${state.outdoorUseAllowed ? '✓' : '✗'}
                            </span>
                            Outdoor Use ${state.outdoorUseAllowed ? 'Allowed' : 'Not Allowed'}
                        </li>
                    </ul>
                </div>

                ${state.keyRestrictions && state.keyRestrictions.length > 0 ? `
                <div class="info-card">
                    <h3>Key Restrictions</h3>
                    <div class="restrictions-list">
                        <ul>
                            ${state.keyRestrictions.map(restriction => `<li>${restriction}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                ` : ''}

                ${state.regulatoryAgency ? `
                <div class="info-card">
                    <h3>Regulatory Information</h3>
                    <div class="agency-info">
                        <p><strong>Agency:</strong> ${state.regulatoryAgency}</p>
                        ${state.contactInfo ? `<p><strong>Contact:</strong> ${state.contactInfo}</p>` : ''}
                        ${state.website ? `<p><strong>Website:</strong> <a href="${state.website}" target="_blank">${state.website}</a></p>` : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </div>

    <style>
        .breadcrumbs {
            margin-bottom: 30px;
        }

        .breadcrumbs a {
            color: rgb(var(--color-link));
            text-decoration: none;
            font-weight: 500;
        }

        .breadcrumbs a:hover {
            text-decoration: underline;
        }

        .state-detail-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .state-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .state-name {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .state-status {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 20px;
        }

        .state-status.fully-legal {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .state-status.restricted {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }

        .state-status.limited {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .state-status.prohibited {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .state-description {
            font-size: 1.2rem;
            line-height: 1.6;
            color: rgb(var(--color-foreground-75));
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }

        .info-card {
            background: rgb(var(--color-background));
            padding: 25px;
            border-radius: 12px;
            border: 1px solid rgb(var(--color-border));
        }

        .info-card h3 {
            margin-bottom: 15px;
            color: rgb(var(--color-foreground));
        }

        .info-card ul {
            list-style: none;
            padding: 0;
        }

        .info-card li {
            padding: 8px 0;
            border-bottom: 1px solid rgb(var(--color-border));
        }

        .info-card li:last-child {
            border-bottom: none;
        }

        .permit-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .permit-required {
            background: #fff3cd;
            color: #856404;
        }

        .permit-not-required {
            background: #d4edda;
            color: #155724;
        }

        .usage-indicator {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            text-align: center;
            line-height: 20px;
            font-weight: bold;
            font-size: 14px;
            margin-right: 8px;
        }

        .usage-allowed {
            background: #28a745;
            color: white;
        }

        .usage-not-allowed {
            background: #dc3545;
            color: white;
        }

        .restrictions-list {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
        }

        .agency-info {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2196f3;
        }

        @media (max-width: 768px) {
            .state-name {
                font-size: 2rem;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
    `;
}

// Generate HTML for main directory page
function generateDirectoryHTML(transformedStates) {
    const stats = {
        'Fully Legal': 0,
        'Restricted': 0,
        'Limited': 0,
        'Prohibited': 0
    };

    transformedStates.forEach(state => {
        stats[state.status]++;
    });

    return `
    <div class="page-width">
        <div class="page-header text-center">
            <h1 class="main-page-title">Greywater Directory</h1>
            <p>Comprehensive state-by-state guide to greywater regulations</p>
        </div>

        <div class="greywater-stats-grid">
            <div class="stat-card fully-legal">
                <div class="stat-number">${stats['Fully Legal']}</div>
                <div class="stat-label">Fully Legal</div>
                <div class="stat-description">Comprehensive regulations allowing greywater systems with permits</div>
            </div>
            <div class="stat-card restricted">
                <div class="stat-number">${stats['Restricted']}</div>
                <div class="stat-label">Restricted</div>
                <div class="stat-description">Limited use, often only specific system types allowed</div>
            </div>
            <div class="stat-card limited">
                <div class="stat-number">${stats['Limited']}</div>
                <div class="stat-label">Limited</div>
                <div class="stat-description">Unclear regulations or case-by-case approval</div>
            </div>
            <div class="stat-card prohibited">
                <div class="stat-number">${stats['Prohibited']}</div>
                <div class="stat-label">Prohibited</div>
                <div class="stat-description">No greywater systems permitted or no formal regulations</div>
            </div>
        </div>

        <div class="states-table">
            <table>
                <thead>
                    <tr>
                        <th>State</th>
                        <th>Status</th>
                        <th>Permit Required</th>
                        <th>Indoor Use</th>
                        <th>Outdoor Use</th>
                        <th>Key Restrictions</th>
                    </tr>
                </thead>
                <tbody>
                    ${transformedStates.map(state => `
                        <tr onclick="window.location.href='/tools/greywater-directory/${state.state.toLowerCase().replace(/\\s+/g, '-')}'">
                            <td><strong>${state.state}</strong></td>
                            <td><span class="status-badge">${state.status}</span></td>
                            <td>${state.permitRequired}</td>
                            <td>${state.indoorUseAllowed ? '✓' : '✗'}</td>
                            <td>${state.outdoorUseAllowed ? '✓' : '✗'}</td>
                            <td>${state.keyRestrictions ? state.keyRestrictions.slice(0, 2).join('. ') : ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="legal-notice">
            <h3>Important Legal Notice</h3>
            <p>This information is for general guidance only and may not reflect the most current regulations. Greywater laws vary significantly by state, county, and municipality. Always consult with local authorities and obtain necessary permits before installing any greywater system.</p>
        </div>
    </div>

    <style>
        .greywater-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }

        .stat-card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            border-left: 4px solid;
        }

        .stat-card.fully-legal { border-left-color: #27ae60; }
        .stat-card.restricted { border-left-color: #f39c12; }
        .stat-card.limited { border-left-color: #e67e22; }
        .stat-card.prohibited { border-left-color: #e74c3c; }

        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .stat-card.fully-legal .stat-number { color: #27ae60; }
        .stat-card.restricted .stat-number { color: #f39c12; }
        .stat-card.limited .stat-number { color: #e67e22; }
        .stat-card.prohibited .stat-number { color: #e74c3c; }

        .states-table {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 40px;
        }

        .states-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .states-table th {
            background: rgb(var(--color-background));
            color: rgb(var(--color-foreground));
            padding: 20px;
            text-align: left;
            font-weight: 600;
        }

        .states-table td {
            padding: 20px;
            border-bottom: 1px solid rgb(var(--color-border));
        }

        .states-table tbody tr {
            cursor: pointer;
        }

        .states-table tr:hover {
            background: rgb(var(--color-background));
        }

        .status-badge {
            white-space: nowrap;
        }

        .legal-notice {
            background: rgb(var(--color-background));
            border: 1px solid rgb(var(--color-border));
            border-radius: 12px;
            padding: 25px;
            margin-top: 40px;
        }

        .legal-notice h3 {
            color: rgb(var(--color-foreground));
            margin-bottom: 15px;
        }
    </style>
    `;
}

// Transform state data for display
function transformStateData(stateData) {
    return Object.entries(stateData.states).map(([stateName, info]) => {
        let status = "Limited";
        if (info.legalStatus === "Legal" || info.legalStatus === "Legal and Regulated" || 
            info.legalStatus === "Regulated and Permitted" || info.legalStatus === "Comprehensive Regulations") {
            status = "Fully Legal";
        } else if (info.legalStatus === "Restricted" || info.legalStatus === "Highly Restricted" || 
                   info.legalStatus === "Limited" || info.legalStatus === "Limited/Unclear") {
            status = "Restricted";
        } else if (info.legalStatus === "Effectively Prohibited" || info.legalStatus === "No Formal Regulations" || 
                   info.legalStatus === "No Specific Regulations") {
            status = "Prohibited";
        }
        
        return {
            state: stateName,
            status,
            description: info.regulatoryClassification || info.legalStatus,
            details: info.keyRestrictions?.join(". ") || info.summary?.substring(0, 150) + "...",
            fullSummary: info.summary,
            permitRequired: info.permitRequired,
            permitThresholdGpd: info.permitThresholdGpd,
            indoorUseAllowed: info.indoorUseAllowed,
            outdoorUseAllowed: info.outdoorUseAllowed,
            approvedUses: info.approvedUses,
            keyRestrictions: info.keyRestrictions,
            governingCode: info.governingCode,
            primaryAgency: info.primaryAgency,
            agencyContact: info.agencyContact,
            agencyPhone: info.agencyPhone,
            governmentWebsite: info.governmentWebsite
        };
    }).sort((a, b) => a.state.localeCompare(b.state));
}

// Main handler function
function handler(req, res) {
    const SHOPIFY_SECRET = process.env.SHOPIFY_PROXY_SECRET || process.env.SHOPIFY_API_SECRET;
    
    // Debug logging for Shopify requests
    if (req.query.signature) {
        console.log('=== SHOPIFY PROXY REQUEST DEBUG ===');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Query params:', JSON.stringify(req.query, null, 2));
        console.log('URL:', req.url);
        console.log('Secret available:', !!SHOPIFY_SECRET);
        console.log('=====================================');
    }
    
    // Verify request authenticity
    if (SHOPIFY_SECRET && req.query.signature && !verifyShopifyProxyRequest(req.query, SHOPIFY_SECRET)) {
        console.log('Signature verification failed');
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Check for state name in URL path first
    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(part => part);
    
    // Look for state name in path: /tools/greywater-directory/state-name
    let stateName = null;
    let action = req.query.action || 'list';
    
    // Find greywater-directory in path and check if there's a state after it
    const directoryIndex = pathParts.findIndex(part => part === 'greywater-directory');
    if (directoryIndex !== -1 && directoryIndex < pathParts.length - 1) {
        const potentialState = pathParts[directoryIndex + 1];
        // Convert URL slug back to state name
        stateName = potentialState.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        action = 'state-page';
    }
    
    // Auto-detect if request is coming from Shopify (for Liquid format)
    const isShopifyRequest = req.headers['user-agent']?.includes('Shopify') || 
                             req.headers['x-shopify-shop-domain'] || 
                             req.query.format === 'liquid';
    const format = isShopifyRequest ? 'liquid' : (req.query.format || 'html');
    
    try {
        const stateData = loadStateData();
        if (!stateData) {
            return res.status(500).json({ error: 'Failed to load state data' });
        }
        
        switch (action) {
            case 'list':
                // Return the main directory page
                const transformedStates = transformStateData(stateData);
                return res.send(generateDirectoryHTML(transformedStates));
                
            case 'state-page':
                // Find the state data first
                const stateInfo = stateData.states[stateName];
                if (!stateInfo) {
                    return res.status(404).send(`
                        <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
                            <h2>State Not Found</h2>
                            <p>Sorry, we couldn't find information for "${stateName}".</p>
                            <a href="/tools/greywater-directory" style="color: #007cba;">← Back to Directory</a>
                        </div>
                    `);
                }

                // Transform the state data
                const transformedState = {
                    state: stateName,
                    status: (() => {
                        if (stateInfo.legalStatus === "Legal" || stateInfo.legalStatus === "Legal and Regulated" || 
                            stateInfo.legalStatus === "Regulated and Permitted" || stateInfo.legalStatus === "Comprehensive Regulations") {
                            return "Fully Legal";
                        } else if (stateInfo.legalStatus === "Restricted" || stateInfo.legalStatus === "Highly Restricted" || 
                                   stateInfo.legalStatus === "Limited" || stateInfo.legalStatus === "Limited/Unclear") {
                            return "Restricted";
                        } else if (stateInfo.legalStatus === "Prohibited" || stateInfo.legalStatus === "No formal regulations" || 
                                   stateInfo.legalStatus === "Effectively Prohibited") {
                            return "Prohibited";
                        }
                        return "Limited";
                    })(),
                    description: stateInfo.description || `${stateInfo.legalStatus} - ${stateInfo.permitRequired} permit required`,
                    details: stateInfo.details || stateInfo.recentChanges || "See regulatory agency for details",
                    permitRequired: stateInfo.permitRequired || "Unknown",
                    indoorUseAllowed: stateInfo.indoorUseAllowed || false,
                    outdoorUseAllowed: stateInfo.outdoorUseAllowed || false,
                    keyRestrictions: stateInfo.keyRestrictions || [],
                    regulatoryAgency: stateInfo.primaryAgency,
                    contactInfo: stateInfo.contactInfo,
                    website: stateInfo.website
                };

                // Return fully rendered HTML page
                return res.send(generateStatePageHTML(transformedState));
                
            case 'data':
                // Return JSON data for AJAX requests
                const transformedData = transformStateData(stateData);
                return res.json({
                    metadata: stateData.metadata,
                    states: transformedData
                });
                
            case 'state':
                // Return specific state data
                const stateName = req.query.state;
                if (!stateName) {
                    return res.status(400).json({ error: 'State parameter required' });
                }
                
                const stateInfo = stateData.states[stateName];
                if (!stateInfo) {
                    return res.status(404).json({ error: 'State not found' });
                }
                
                return res.json({
                    state: stateName,
                    ...stateInfo
                });
                
            case 'stats':
                // Return summary statistics
                const transformedStates = transformStateData(stateData);
                const stats = {
                    'Fully Legal': 0,
                    'Restricted': 0,
                    'Limited': 0,
                    'Prohibited': 0
                };
                
                transformedStates.forEach(state => {
                    stats[state.status]++;
                });
                
                return res.json({
                    total: transformedStates.length,
                    breakdown: stats
                });
                
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = handler;
}

// For Vercel/Netlify/similar platforms
if (typeof exports !== 'undefined') {
    exports.default = handler;
}

// Example usage URLs for Shopify App Proxy:
// https://yourshop.myshopify.com/apps/greywater-directory
// https://yourshop.myshopify.com/apps/greywater-directory?action=data
// https://yourshop.myshopify.com/apps/greywater-directory?action=state&state=California
// https://yourshop.myshopify.com/apps/greywater-directory?action=stats
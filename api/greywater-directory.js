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
    
    // Sort parameters and create query string
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('');
    
    // Generate expected signature
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(sortedParams)
        .digest('hex');
    
    return signature === expectedSignature;
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
    const SHOPIFY_SECRET = process.env.SHOPIFY_PROXY_SECRET;
    
    // Verify request authenticity (optional, depends on your security needs)
    if (SHOPIFY_SECRET && !verifyShopifyProxyRequest(req.query, SHOPIFY_SECRET)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const action = req.query.action || 'list';
    
    try {
        const stateData = loadStateData();
        if (!stateData) {
            return res.status(500).json({ error: 'Failed to load state data' });
        }
        
        switch (action) {
            case 'list':
                // Return the main directory page
                const htmlPath = path.join(__dirname, '../pages/greywater-directory.html');
                if (fs.existsSync(htmlPath)) {
                    const html = fs.readFileSync(htmlPath, 'utf8');
                    res.setHeader('Content-Type', 'text/html');
                    return res.send(html);
                } else {
                    return res.status(404).json({ error: 'Directory page not found' });
                }
                
            case 'state-page':
                // Return the state detail page HTML
                const statePagePath = path.join(__dirname, '../pages/state-detail.html');
                if (fs.existsSync(statePagePath)) {
                    const html = fs.readFileSync(statePagePath, 'utf8');
                    res.setHeader('Content-Type', 'text/html');
                    return res.send(html);
                } else {
                    return res.status(404).json({ error: 'State detail page not found' });
                }
                
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
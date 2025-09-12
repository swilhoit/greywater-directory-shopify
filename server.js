const express = require('express');
const path = require('path');
const greywaterDirectory = require('./api/greywater-directory');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for local testing)
app.use('/static', express.static(path.join(__dirname, 'pages')));
app.use('/data', express.static(path.join(__dirname)));

// Shopify App Proxy endpoint
app.use('/apps/greywater-directory', greywaterDirectory);

// Alternative routes for testing
app.get('/', greywaterDirectory);
app.get('/greywater-directory', greywaterDirectory);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Greywater Directory server running on port ${PORT}`);
  console.log(`Local access: http://localhost:${PORT}/greywater-directory`);
  console.log(`Shopify App Proxy path: /apps/greywater-directory`);
});

module.exports = app;
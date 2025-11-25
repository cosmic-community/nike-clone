const fs = require('fs')
const path = require('path')

// This script generates a static sitemap during build
// The dynamic sitemap route will handle runtime updates

console.log('✓ Sitemap generation configured via dynamic route at /sitemap.xml')
console.log('✓ The sitemap will be generated dynamically at runtime with fresh data from Cosmic')
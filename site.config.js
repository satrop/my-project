/**
 * Site Configuration - CENTRAL CONFIGURATION HUB
 */

const SITE_CONFIG = {
  basePath: {
    development: '/',                    // Local development (usually root)
    production: '/html_templates/sp/'    // ⚠️ IMPORTANT: Static server path. This is the ONLY place you need to change paths for new projects!
  },
  
  // Project info (optional - for documentation)
  project: {
    name: 'test-site',
    version: '1.0.0'
  }
};

export default SITE_CONFIG;

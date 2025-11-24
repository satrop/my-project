/**
 * Site Configuration - CENTRAL CONFIGURATION HUB
 */

const SITE_CONFIG = {
  basePath: {
    development: "/", // Local development (usually root)
    production: "/html_templates/my-project/", // ⚠️ IMPORTANT: Static server path. This is the ONLY place you need to change paths for new projects!
  },

  // Project info (optional - for documentation)
  project: {
    name: "my-project",
    version: "1.0.0",
  },
};

export default SITE_CONFIG;

/**
 * Shared configuration for all prefix-related tools
 * This ensures consistency across ast-prefix-integration.js, prefix-classes.js, and preview-prefix-changes.js
 */

export const PREFIX_CONFIG = {
  prefix: 'ast-',
  ignoreClasses: ['swiper', 'swiper-slide', 'swiper-wrapper'],
  ignorePatterns: [
    /^astro-/, // Astro's own classes
    /^swiper/, // Swiper classes
    /^fa-/, // Font Awesome icon classes
    /^fa$/, // Font Awesome base class
    /^fas$/, // Font Awesome solid
    /^far$/, // Font Awesome regular
    /^fal$/, // Font Awesome light
    /^fat$/, // Font Awesome thin
    /^fad$/, // Font Awesome duotone
    /^fab$/, // Font Awesome brands
    /^fass$/, // Font Awesome sharp solid
    /^fasr$/, // Font Awesome sharp regular
    /^fasl$/, // Font Awesome sharp light
    /^icon/, // Custom icon classes (icon, icon-*, icon-2x, etc.)
    /^layout-/, // Layout utility classes
    /^site-/, // Site-wide classes
    /^section-grid/, // Section grid classes
    /^col-/, // Grid system classes
    /^md:/, // Responsive prefixes
    /^lg:/, // Responsive prefixes
    /^expand-/, // Expandable elements
    /^resources/, // Resources grid classes
  ],
  patterns: {
    html: ['src/**/*.astro', 'src/**/*.html'],
    css: ['src/**/*.scss', 'src/**/*.css'],
    js: ['src/**/*.js', 'src/**/*.ts']
  }
}

// Helper function to merge user config with defaults
export function createConfig(userConfig = {}) {
  return {
    ...PREFIX_CONFIG,
    ...userConfig,
    // Deep merge arrays to allow adding to ignore patterns
    ignoreClasses: [
      ...PREFIX_CONFIG.ignoreClasses,
      ...(userConfig.ignoreClasses || [])
    ],
    ignorePatterns: [
      ...PREFIX_CONFIG.ignorePatterns,
      ...(userConfig.ignorePatterns || [])
    ],
    patterns: {
      ...PREFIX_CONFIG.patterns,
      ...(userConfig.patterns || {})
    }
  }
}

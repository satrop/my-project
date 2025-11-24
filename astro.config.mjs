// @ts-check
/// <reference types="node" />
import { defineConfig } from 'astro/config'
import siteConfig from './site.config.js'
import { astPrefixIntegration } from './scripts/ast-prefix-integration.js'
import { viteAstPrefixPlugin } from './scripts/vite-prefix-plugin.js'
import * as path from 'node:path';

// Determine base path from configuration
const getBasePath = () => {
  // Allow environment variable override for advanced use cases
  if (process.env.ASTRO_BASE_URL) {
    return process.env.ASTRO_BASE_URL
  }
  
  // Use site.config.js settings
  if (typeof siteConfig.basePath === 'object') {
    // Environment-specific paths - check for production build
    const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('build')
    return isProduction 
      ? siteConfig.basePath.production 
      : siteConfig.basePath.development
  } else {
    // Single path for all environments
    return siteConfig.basePath
  }
}

const basePath = getBasePath()

export default defineConfig({
  base: basePath,
  publicDir: './public',
  trailingSlash: 'never',
  compressHTML: false,
  scopedStyleStrategy: 'where',
  devToolbar: {
    enabled: false
  },
  
  integrations: [
    astPrefixIntegration({
      prefix: 'ast-',
      ignoreClasses: [
        // Additional specific classes that need to be ignored
        'swiper',
        'swiper-slide',
        'swiper-wrapper',
        'coverflow-gallery',
        'swiper-button-next',
        'swiper-button-prev',
        'swiper-pagination',
        'swiper-scrollbar',
        'gallery-captions'
      ]
    })
  ],
  build: {
    format: 'file',
    assets: 'assets',
    inlineStylesheets: 'never'
  },
  output: 'static',
  vite: {
    plugins: [
      viteAstPrefixPlugin({
        prefix: 'ast-',
        ignoreClasses: [
          // Additional specific classes that need to be ignored
          'swiper',
          'swiper-slide',
          'swiper-wrapper',
          'coverflow-gallery',
          'swiper-button-next',
          'swiper-button-prev',
          'swiper-pagination',
          'swiper-scrollbar',
          'gallery-captions'
        ]
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@styles': '/src/styles',
        '/main.js': '/src/assets/main.js',
        '/components/': '/src/components/'
      }
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/css/styles.css'
            }
            // Handle image files
            if (assetInfo.name && /\.(png|jpe?g|svg|gif|webp|avif|ico|bmp|tiff?)$/i.test(assetInfo.name)) {
              return 'assets/img/[name][extname]'
            }
            // Handle JavaScript files
            if (assetInfo.name && /\.(js|mjs)$/i.test(assetInfo.name)) {
              return 'assets/js/[name][extname]'
            }
            // Default for other assets
            return 'assets/[name][extname]'
          }
        }
      },
      // Exclude SVG icon folders from build output
      // copyPublicDir: false // We'll handle public assets manually
    },
    server: {
      host: true,
      port: 4322, // CHANGED PORT TO AVOID BROWSER CACHE
      fs: {
        allow: ['..']
      }
    }
  }
})
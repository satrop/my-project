import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function patchFontCSS() {
  try {
    // Read site config to get production base path
    const siteConfigPath = path.resolve(__dirname, '..', 'site.config.js')
    const { createRequire } = await import('module')
    const require = createRequire(import.meta.url)
    delete require.cache[siteConfigPath]
    const siteConfig = require(siteConfigPath)
    
    const config = siteConfig.default || siteConfig
    const basePath = config.basePath.production
    
    // Path to the CSS file in dist
    const cssPath = path.resolve('./dist/assets/fonts/icons/font-icons.css')
    
    // Read the CSS file
    const cssContent = await fs.readFile(cssPath, 'utf8')
    
    // Replace relative paths with absolute paths including base URL
    const patchedCSS = cssContent.replace(
      /url\("\.\//g,
      `url("${basePath}assets/fonts/icons/`
    )
    
    // Write the patched CSS back
    await fs.writeFile(cssPath, patchedCSS)
    
    console.log(`✅ Patched font CSS with base path: ${basePath}`)
  } catch (err) {
    console.error('❌ Error patching font CSS:', err)
  }
}

patchFontCSS()
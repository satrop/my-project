import path from 'path'
import { webfont } from 'webfont'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Use relative paths - bulletproof solution that works in any environment
function getFontPath() {
  return './'
}

async function buildIcons() {
  try {
    // Get bulletproof relative font path
    const fontPath = getFontPath()
    
    // Webfont configuration
    const webfontConfig = {
      fontName: "font-icons",
      formats: ["woff2", "woff"],
      normalize: true,
      fontHeight: 1000,
      centerHorizontally: true,
      dest: "./public/assets/fonts/icons",
      template: "css",
      templateClassName: "icon",
      templateFontPath: fontPath, // Always /assets/fonts/icons/
      round: 10000000000000,
      prependUnicode: true,
      sort: false
    }

    const result = await webfont({
      ...webfontConfig,
      files: path.resolve('./public/assets/fonts/icons/optimized/*.svg'),
      glyphTransformFn: (obj) => {
        // Remove double "icon-" prefix if it exists
        obj.name = obj.name.replace(/^icon-/, '')
        return obj
      },
    })

    // Write font files and CSS to disk
    const dest = path.resolve('./public/assets/fonts/icons')

    // Write each generated file
    await fs.mkdir(dest, { recursive: true })

    await Promise.all(
      Object.entries(result).map(async ([filename, content]) => {
        if (filename === 'woff' || filename === 'woff2') {
          const filePath = path.join(dest, `font-icons.${filename}`)
          await fs.writeFile(filePath, content)
        } else if (filename === 'template') {
          const filePath = path.join(dest, `font-icons.css`)
          await fs.writeFile(filePath, content)
        }
      })
    )

    console.log(`Icons built successfully with font path: ${fontPath}`)
  } catch (err) {
    console.error('Error building icons:', err)
    process.exit(1)
  }
}

buildIcons()
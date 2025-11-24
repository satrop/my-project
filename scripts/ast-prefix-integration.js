/**
 * Astro integration to add "ast-" prefix to HTML class attributes
 * This works with the Vite plugin to ensure both HTML and CSS are prefixed
 */

import { createConfig } from './prefix-config.js'

export function astPrefixIntegration(options = {}) {
  const config = createConfig(options)
  const {
    prefix,
    ignoreClasses,
    ignorePatterns
  } = config

  // Function to check if a class should be prefixed
  function shouldPrefixClass(className) {
    // Skip if already prefixed
    if (className.startsWith(prefix)) return false
    
    // Skip if in ignore list
    if (ignoreClasses.includes(className)) return false
    
    // Skip if matches ignore patterns
    if (ignorePatterns.some(pattern => pattern.test(className))) return false
    
    return true
  }

  // Function to prefix a class name
  function prefixClass(className) {
    return shouldPrefixClass(className) ? `${prefix}${className}` : className
  }

  // Function to process HTML content
  function processHTML(html) {
    return html.replace(/class="([^"]*)"/g, (match, classValue) => {
      const classes = classValue.split(/\s+/).filter(Boolean)
      const prefixedClasses = classes.map(prefixClass)
      const result = `class="${prefixedClasses.join(' ')}"`
      
      // Log if we made changes
      if (result !== match) {
      }
      
      return result
    })
  }

  // Function to process CSS content
  function processCSS(css) {
    // Split CSS into lines and process each line
    const lines = css.split('\n')
    const processedLines = lines.map(line => {
      // Skip lines that contain URL references, @font-face, @import, etc.
      if (line.includes('url(') || 
          line.includes('@font-face') || 
          line.includes('@import') || 
          line.includes('src:') ||
          line.includes('@media') ||
          line.includes('@keyframes') ||
          line.includes('@supports')) {
        return line
      }
      
      // Only process class selectors at the beginning of lines (or after spaces/commas)
      return line.replace(/(\s|^|,)\.([a-zA-Z][a-zA-Z0-9_-]*)/g, (match, prefixChar, className) => {
        if (shouldPrefixClass(className)) {
          return `${prefixChar}.${prefix}${className}`
        }
        return match
      })
    })
    
    return processedLines.join('\n')
  }

  // Function to process JavaScript content
  function processJS(js) {
    let result = js

    // Process querySelector and querySelectorAll calls with class selectors
    // This handles complex selectors like: querySelector('.class1, .class2 h1, .class3')
    result = result.replace(/(querySelector(?:All)?)\(['"`]([^'"`]*)/g, (match, method, selectorString) => {
      // Process each class selector in the string
      const processedSelector = selectorString.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)/g, (classMatch, className) => {
        const prefixedClassName = prefixClass(className)
        return `.${prefixedClassName}`
      })
      
      const newMatch = `${method}('${processedSelector}`
      
      // if (newMatch !== match) {
      //   console.log(`[ast-prefix-integration] JS querySelector: ${selectorString} -> ${processedSelector}`)
      // }
      
      return newMatch
    })

    // Handle template literals with querySelector
    result = result.replace(/(querySelector(?:All)?)\(`([^`]*)/g, (match, method, selectorString) => {
      const processedSelector = selectorString.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)/g, (classMatch, className) => {
        const prefixedClassName = prefixClass(className)
        return `.${prefixedClassName}`
      })
      
      const newMatch = `${method}(\`${processedSelector}`
      
      // if (newMatch !== match) {
      //   console.log(`[ast-prefix-integration] JS querySelector template: ${selectorString} -> ${processedSelector}`)
      // }
      
      return newMatch
    })

    // Process classList operations (add, remove, toggle, contains)
    result = result.replace(/(classList\.(add|remove|toggle|contains))\(['"`]([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)/g, (match, method, operation, className) => {
      const prefixedClassName = prefixClass(className)
      const newMatch = `${method}('${prefixedClassName}`
      
      // if (newMatch !== match) {
      //   console.log(`[ast-prefix-integration] JS classList: ${match} -> ${newMatch}`)
      // }
      
      return newMatch
    })

    // Process className assignments
    result = result.replace(/(\.className\s*=\s*['"`])([^'"`]*)/g, (match, prefix, classNames) => {
      const classes = classNames.split(/\s+/).filter(Boolean)
      const prefixedClasses = classes.map(prefixClass)
      const newMatch = `${prefix}${prefixedClasses.join(' ')}`
      
      // if (newMatch !== match) {
      //   console.log(`[ast-prefix-integration] JS className: ${match} -> ${newMatch}`)
      // }
      
      return newMatch
    })

    return result
  }

  return {
    name: 'ast-prefix-integration',
    hooks: {
      'astro:build:done': async ({ dir, pages }) => {
        
        const fs = await import('fs')
        const path = await import('path')
        
        // Process all HTML files
        for (const page of pages) {
          // Handle root page (empty pathname) and other pages
          const pagePath = page.pathname === '' || page.pathname === '/' ? 'index' : page.pathname.replace(/\/$/, '')
          const filePath = path.resolve(dir.pathname, pagePath + '.html')
          
          try {
            if (fs.existsSync(filePath)) {
              
              const content = fs.readFileSync(filePath, 'utf8')
              const processedContent = processHTML(content)
              
              if (content !== processedContent) {
                fs.writeFileSync(filePath, processedContent, 'utf8')
              } else {
              }
            } else {
            }
          } catch (error) {
            console.error(`[ast-prefix-integration] Error processing ${page.pathname}:`, error.message)
          }
        }
        
        // Process all CSS files
        try {
          const findCSSFiles = (dir) => {
            const cssFiles = []
            const items = fs.readdirSync(dir, { withFileTypes: true })
            
            for (const item of items) {
              const fullPath = path.join(dir, item.name)
              if (item.isDirectory()) {
                cssFiles.push(...findCSSFiles(fullPath))
              } else if (item.isFile() && item.name.endsWith('.css')) {
                cssFiles.push(fullPath)
              }
            }
            
            return cssFiles
          }
          
          const cssFiles = findCSSFiles(dir.pathname)
          
          for (const cssPath of cssFiles) {
            const relativePath = path.relative(dir.pathname, cssPath)
            
            const cssContent = fs.readFileSync(cssPath, 'utf8')
            const processedCSS = processCSS(cssContent)
            
            if (cssContent !== processedCSS) {
              fs.writeFileSync(cssPath, processedCSS, 'utf8')
            } else {
            }
          }
        } catch (error) {
          console.error('[ast-prefix-integration] Error processing CSS files:', error.message)
        }
        
        // console.log('[ast-prefix-integration] HTML and CSS processing complete')
        
      }
    }
  }
}

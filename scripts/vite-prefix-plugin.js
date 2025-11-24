/**
 * Vite plugin to add "ast-" prefix to CSS/SCSS classes during development and build
 * This ensures consistent prefixing in both dev and production modes
 */

import { createConfig } from './prefix-config.js'

export function viteAstPrefixPlugin(options = {}) {
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

  // Function to process CSS content
  function processCSS(css, id) {
    // Only process CSS/SCSS files, not JS files with CSS imports
    if (!id.endsWith('.css') && !id.endsWith('.scss')) {
      return css
    }

    // Skip processing node_modules
    if (id.includes('node_modules')) {
      return css
    }

    let hasChanges = false
    
    // Split CSS into lines and process each line
    const lines = css.split('\n')
    const processedLines = lines.map((line, index) => {
      // Skip lines that contain URL references, @font-face, @import, etc.
      if (line.includes('url(') || 
          line.includes('@font-face') || 
          line.includes('@import') || 
          line.includes('src:') ||
          line.includes('@media') ||
          line.includes('@keyframes') ||
          line.includes('@supports') ||
          line.includes('@mixin') ||
          line.includes('@function') ||
          line.includes('@extend') ||
          line.includes('@include')) {
        return line
      }
      
      // Process class selectors - match .classname but not in comments or strings
      return line.replace(/(\s|^|,|>|\+|~)\.([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)/g, (match, prefixChar, className) => {
        // Skip if this looks like it's in a comment
        const lineUpToMatch = line.substring(0, line.indexOf(match))
        if (lineUpToMatch.includes('//') || lineUpToMatch.includes('/*')) {
          return match
        }
        
        if (shouldPrefixClass(className)) {
          hasChanges = true
          return `${prefixChar}.${prefix}${className}`
        }
        return match
      })
    })
    
    const result = processedLines.join('\n')
    
    // Only log if we made changes and we're in development mode
    if (hasChanges && process.env.NODE_ENV !== 'production') {
      const fileName = id.split('/').pop()
      console.log(`[vite-ast-prefix] Prefixed CSS classes in ${fileName}`)
    }
    
    return result
  }

  // Function to process Astro HTML content
  function processAstroHTML(code, id) {
    // Skip processing node_modules
    if (id.includes('node_modules')) {
      return code
    }

    let hasChanges = false
    
    // Regular expression to match class attributes in HTML
    // This handles: class="className", class='className', class={className}, class=`className`
    let processedCode = code.replace(/class=(['"`])([^'"`]*)\1/g, (match, quote, classNames) => {
      const classes = classNames.split(/\s+/).filter(Boolean)
      const prefixedClasses = classes.map(className => {
        // Skip if already prefixed or if it shouldn't be prefixed
        if (shouldPrefixClass(className)) {
          hasChanges = true
          return prefix + className
        }
        return className
      })
      
      return `class=${quote}${prefixedClasses.join(' ')}${quote}`
    })
    
    // Also handle dynamic class expressions like class={`some-class ${variable}`}
    processedCode = processedCode.replace(/class=\{`([^`]*)`\}/g, (match, classContent) => {
      // Only prefix static class names in template literals, not variables
      const processedContent = classContent.replace(/(\b[a-zA-Z][\w-]*)/g, (className) => {
        // Check if this looks like a CSS class (not a variable) and should be prefixed
        if (/^[a-z][\w-]*$/.test(className) && shouldPrefixClass(className)) {
          hasChanges = true
          return prefix + className
        }
        return className
      })
      
      return `class={\`${processedContent}\`}`
    })
    
    // Handle class={variable} expressions - but be careful not to prefix variables
    processedCode = processedCode.replace(/class=\{([^}]+)\}/g, (match, expression) => {
      // Only process if it's a simple string literal
      if (expression.match(/^['"`][^'"`]*['"`]$/)) {
        const quote = expression[0]
        const classNames = expression.slice(1, -1)
        const classes = classNames.split(/\s+/).filter(Boolean)
        const prefixedClasses = classes.map(className => {
          if (shouldPrefixClass(className)) {
            hasChanges = true
            return prefix + className
          }
          return className
        })
        
        return `class={${quote}${prefixedClasses.join(' ')}${quote}}`
      }
      return match
    })
    
    // Only log if we made changes and we're in development mode
    if (hasChanges && process.env.NODE_ENV !== 'production') {
      const fileName = id.split('/').pop()
      console.log(`[vite-ast-prefix] Prefixed HTML classes in ${fileName}`)
    }
    
    return processedCode
  }

  /** @type {import('vite').Plugin} */
  const plugin = {
    name: 'vite-ast-prefix',
    enforce: 'pre', // Run before other plugins
    
    transform(code, id) {
      // Process CSS and SCSS files
      if (id.endsWith('.css') || id.endsWith('.scss')) {
        return {
          code: processCSS(code, id),
          map: null // For simplicity, not generating source maps
        }
      }
      
      // Process Astro files for HTML class attributes
      if (id.endsWith('.astro')) {
        return {
          code: processAstroHTML(code, id),
          map: null
        }
      }
      
      return null
    },

    // Also handle CSS loaded via ?inline or other methods
    load(id) {
      return null
    },

    // Handle CSS processing for build as well
    generateBundle(options, bundle) {
      // Process CSS files in the bundle
      Object.keys(bundle).forEach(fileName => {
        const file = bundle[fileName]
        if (file.type === 'asset' && fileName.endsWith('.css')) {
          file.source = processCSS(file.source.toString(), fileName)
        }
      })
    }
  }
  
  return plugin
}
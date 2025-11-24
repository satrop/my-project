import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from 'path';
import fs from 'fs';

async function buildMainJS() {
  try {
    console.log('Building main.js bundle...');
    
    // Create rollup bundle
    const bundle = await rollup({
      input: './src/assets/main.js',
      plugins: [
        nodeResolve({
          browser: true,
          preferBuiltins: false
        })
      ]
    });

    // Generate the bundle
    const { output } = await bundle.generate({
      format: 'es',
      file: 'main.js'
    });

    // Ensure dist directory exists
    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist', { recursive: true });
    }

    // Write the bundle to dist/main.js
    for (const chunkOrAsset of output) {
      if (chunkOrAsset.type === 'chunk') {
        let code = chunkOrAsset.code;
        
        // Process the JavaScript for class prefixing
        console.log('Processing JavaScript for class prefixing...');
        
        // Process JS function
        const processJS = (js) => {
          let result = js
          let changeCount = 0

          // Function to check if a class should be prefixed
          function shouldPrefixClass(className) {
            const prefix = 'ast-'
            const ignoreClasses = ['swiper']
            const ignorePatterns = [/^astro-/]
            
            if (className.startsWith(prefix)) return false
            if (ignoreClasses.includes(className)) return false
            if (ignorePatterns.some(pattern => pattern.test(className))) return false
            return true
          }

          // Function to prefix a class name
          function prefixClass(className) {
            return shouldPrefixClass(className) ? `ast-${className}` : className
          }

          console.log(`[build-main-js] Processing JavaScript content...`)

          // Process querySelector and querySelectorAll calls with class selectors
          // Handle single quotes
          result = result.replace(/(querySelector(?:All)?)\('([^']*)'/g, (match, method, selectorString) => {
            const processedSelector = selectorString.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)/g, (classMatch, className) => {
              const prefixedClassName = prefixClass(className)
              return `.${prefixedClassName}`
            })
            
            const newMatch = `${method}('${processedSelector}'`
            
            if (processedSelector !== selectorString) {
              changeCount++
            }
            
            return newMatch
          })

          // Handle double quotes
          result = result.replace(/(querySelector(?:All)?)\("([^"]*)"/g, (match, method, selectorString) => {
            const processedSelector = selectorString.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)/g, (classMatch, className) => {
              const prefixedClassName = prefixClass(className)
              return `.${prefixedClassName}`
            })
            
            const newMatch = `${method}("${processedSelector}"`
            
            if (processedSelector !== selectorString) {
              changeCount++
            }
            
            return newMatch
          })

          // Handle template literals (backticks) - only process simple class selectors, avoid complex template expressions
          result = result.replace(/(querySelector(?:All)?)\(`([^`${}]*\.[a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*[^`${}]*)`/g, (match, method, selectorString) => {
            // Only process if this doesn't contain template literal expressions ${...}
            if (selectorString.includes('${')) {
              return match // Don't modify template literals with expressions
            }
            
            const processedSelector = selectorString.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)/g, (classMatch, className) => {
              const prefixedClassName = prefixClass(className)
              return `.${prefixedClassName}`
            })
            
            const newMatch = `${method}(\`${processedSelector}\``
            
            if (processedSelector !== selectorString) {
              changeCount++
            }
            
            return newMatch
          })

          // Process classList operations - handle different quote types
          // Handle single quotes
          result = result.replace(/(classList\.(add|remove|toggle|contains))\('([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)'/g, (match, method, operation, className) => {
            const prefixedClassName = prefixClass(className)
            const newMatch = `${method}('${prefixedClassName}'`
            
            if (prefixedClassName !== className) {
              changeCount++
            }
            
            return newMatch
          })

          // Handle double quotes
          result = result.replace(/(classList\.(add|remove|toggle|contains))\("([a-zA-Z][a-zA-Z0-9_-]*(?:__[a-zA-Z0-9_-]+)*(?:--[a-zA-Z0-9_-]+)*)"/g, (match, method, operation, className) => {
            const prefixedClassName = prefixClass(className)
            const newMatch = `${method}("${prefixedClassName}"`
            
            if (prefixedClassName !== className) {
              changeCount++
            }
            
            return newMatch
          })

          console.log(`[build-main-js] JavaScript processing complete. Made ${changeCount} changes.`)
          return result
        }
        
        code = processJS(code);
        
        fs.writeFileSync('./dist/main.js', code);
        console.log('✓ main.js built and processed successfully');
      }
    }

    await bundle.close();
  } catch (error) {
    console.error('Error building main.js:', error);
    process.exit(1);
  }
}

buildMainJS();

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import SITE_CONFIG from '../site.config.js';

function patchHtmlFiles() {
  // Get the production base path from site config
  const basePath = SITE_CONFIG.basePath.production || SITE_CONFIG.basePath;
  
  // Remove trailing slash for consistent replacement patterns
  const basePathClean = basePath.replace(/\/$/, '');
  
  // Find all HTML files in dist directory
  const htmlFiles = glob.sync('dist/**/*.html');
  
  htmlFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Apply path replacements using the configured base path
      content = content
        .replace(new RegExp(`${basePathClean}/main\\.js`, 'g'), `${basePathClean}/assets/js/main.js`)
        .replace(new RegExp(`${basePathClean}/img/`, 'g'), `${basePathClean}/assets/img/`)
        .replace(new RegExp(`${basePathClean}/icons/`, 'g'), `${basePathClean}/assets/img/icons/`)
        .replace(new RegExp(`${basePathClean}/favicon\\.svg`, 'g'), `${basePathClean}/assets/img/favicon.svg`);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Patched: ${filePath}`);
    } catch (error) {
      console.error(`Error patching ${filePath}:`, error.message);
    }
  });
  
  console.log(`Patched ${htmlFiles.length} HTML files`);
}

patchHtmlFiles();

#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const cssPath = path.join(__dirname, '../public/assets/fonts/icons/font-icons.css');
const iconsPagePath = path.join(__dirname, '../src/pages/icons.astro');

console.log('🔄 Updating icons showcase page...');

try {
  // Read the generated CSS file
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Extract icon class names using regex
  const iconMatches = cssContent.match(/\.icon-([^:]+)::before/g);
  
  if (!iconMatches) {
    console.log('❌ No icons found in CSS file');
    process.exit(1);
  }
  
  // Extract clean icon names
  const icons = iconMatches.map(match => {
    const iconName = match.replace('.icon-', '').replace('::before', '');
    return {
      className: `icon-${iconName}`,
      name: iconName,
      displayName: iconName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    };
  });
  
  console.log(`✅ Found ${icons.length} icons:`, icons.map(i => i.name).join(', '));
  
  // Read the current icons page
  const iconsPageContent = fs.readFileSync(iconsPagePath, 'utf8');
  
  // Generate the icon grid HTML
  const iconGridHTML = icons.map(icon => `            <div class="icon-item">
              <i class="icon ${icon.className}"></i>
              <h3>${icon.displayName}</h3>
              <code>.${icon.className}</code>
            </div>`).join('\n');
  
  // Generate size variations HTML
  const sizeRowsHTML = ['Normal', 'Large (2x)', 'Extra Large (3x)', 'Huge (4x)'].map((label, index) => {
    const sizeClass = index === 0 ? '' : ` icon-${index + 1}x`;
    const iconElements = icons.map(icon => `              <i class="icon ${icon.className}${sizeClass}"></i>`).join('\n');
    return `            <div class="size-row">
              <span class="size-label">${label}:</span>
${iconElements}
            </div>`;
  }).join('\n');
  
  // Generate usage examples
  const buttonExamples = icons.slice(0, 3).map((icon, index) => {
    const buttonTypes = ['btn-primary', 'btn-secondary', 'btn-outline'];
    const buttonLabels = ['Download File', 'Settings', 'Go Back'];
    return `              <button class="ast-btn ${buttonTypes[index]}">
                <i class="icon ${icon.className}"></i>
                ${buttonLabels[index] || icon.displayName}
              </button>`;
  }).join('\n');
  
  const inlineTextIcons = icons.slice(0, 3).map(icon => 
    `<i class="icon ${icon.className}"></i>`
  ).join(', ');
  
  const listItems = icons.map(icon => `              <li><i class="icon ${icon.className}"></i> ${icon.displayName}</li>`).join('\n');
  
  const codeExamples = icons.map(icon => `&lt;i class="icon ${icon.className}"&gt;&lt;/i&gt;`).join('\n');
  
  // Replace sections in the Astro file
  let updatedContent = iconsPageContent;
  
  // Replace icon grid
  updatedContent = updatedContent.replace(
    /<!-- Available Icons -->[\s\S]*?<\/section>/,
    `<!-- Available Icons -->
        <section class="ast-showcase__section">
          <h2>Available Icons</h2>
          <div class="icon-grid">
${iconGridHTML}
          </div>
        </section>`
  );
  
  // Replace size variations
  updatedContent = updatedContent.replace(
    /<!-- Size Variations -->[\s\S]*?<\/div>\s*<\/section>/,
    `<!-- Size Variations -->
        <section class="ast-showcase__section">
          <h2>Size Variations</h2>
          <div class="size-demo">
${sizeRowsHTML}
          </div>
        </section>`
  );
  
  // Replace button examples
  updatedContent = updatedContent.replace(
    /<div class="button-examples">[\s\S]*?<\/div>/,
    `<div class="button-examples">
${buttonExamples}
            </div>`
  );
  
  // Replace list items
  updatedContent = updatedContent.replace(
    /<ul class="icon-list">[\s\S]*?<\/ul>/,
    `<ul class="icon-list">
${listItems}
            </ul>`
  );
  
  // Replace basic usage code example
  updatedContent = updatedContent.replace(
    /<h3>Basic Usage<\/h3>\s*<pre><code>[\s\S]*?<\/code><\/pre>/,
    `<h3>Basic Usage</h3>
            <pre><code>${codeExamples}</code></pre>`
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(iconsPagePath, updatedContent);
  
  console.log('✅ Icons showcase page updated successfully!');
  console.log(`📄 Updated: ${iconsPagePath}`);
  
} catch (error) {
  console.error('❌ Error updating icons page:', error.message);
  process.exit(1);
}

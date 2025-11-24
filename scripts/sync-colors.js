#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const scssPath = path.join(__dirname, '../src/styles/tokens/colors/_colors.scss');
const tsPath = path.join(__dirname, '../src/styles/core/_colors-data.ts');
const colorDataPath = path.join(__dirname, '../src/data/color-data.ts');

console.log('🎨 Generating color data from SCSS...');

try {
  // Read the SCSS file
  const scssContent = fs.readFileSync(scssPath, 'utf8');
  
  // Parse the SCSS color map
  const colorMapMatch = scssContent.match(/\$colors:\s*\(([\s\S]*?)\);/);
  
  if (!colorMapMatch) {
    console.error('❌ Could not find $colors map in SCSS file');
    process.exit(1);
  }
  
  const colorMapContent = colorMapMatch[1];
  
  // Parse colors from the map
  const colors = {};
  
  // Split by color groups (look for quoted color names followed by colons and parentheses)
  const colorGroups = colorMapContent.match(/"([^"]+)":\s*\(([\s\S]*?)\),?(?=\s*"|\s*$)/g);
  
  if (!colorGroups) {
    console.error('❌ Could not parse color groups from SCSS');
    process.exit(1);
  }
  
  colorGroups.forEach(group => {
    // Extract color name
    const colorNameMatch = group.match(/"([^"]+)":/);
    if (!colorNameMatch) return;
    
    const colorName = colorNameMatch[1];
    
    // Extract shades within parentheses
    const shadesMatch = group.match(/\(([\s\S]*)\)/);
    if (!shadesMatch) return;
    
    const shadesContent = shadesMatch[1];
    
    // Parse individual shades
    const shades = {};
    const shadeMatches = shadesContent.match(/(\d+(?:-\d+)?(?:-\d+)?)\s*:\s*(#[a-fA-F0-9]{3,8})/g);
    
    if (shadeMatches) {
      shadeMatches.forEach(shade => {
        const shadeMatch = shade.match(/(\d+(?:-\d+)?(?:-\d+)?)\s*:\s*(#[a-fA-F0-9]{3,8})/);
        if (shadeMatch) {
          const [, shadeKey, shadeValue] = shadeMatch;
          shades[shadeKey] = shadeValue.toLowerCase();
        }
      });
    }
    
    if (Object.keys(shades).length > 0) {
      colors[colorName] = shades;
    }
  });
  
  console.log(`✅ Parsed ${Object.keys(colors).length} color groups:`);
  Object.entries(colors).forEach(([name, shades]) => {
    const shadeCount = Object.keys(shades).length;
    const shadeList = Object.keys(shades).join(', ');
    console.log(`   ${name}: ${shadeCount} shade${shadeCount !== 1 ? 's' : ''} (${shadeList})`);
  });
  
  // Generate TypeScript content
  const tsContent = `// Color configuration that mirrors the Sass color map
// This file is auto-generated from _colors.scss
// DO NOT EDIT MANUALLY - run 'pnpm run colors:sync' to regenerate
export const colors = ${JSON.stringify(colors, null, 2).replace(/"/g, '"')} as const;

export type ColorName = keyof typeof colors;
export type ColorShade<T extends ColorName> = keyof typeof colors[T];
export type ColorValue<T extends ColorName, S extends ColorShade<T>> = typeof colors[T][S];
`;
  
  // Write the TypeScript file
  fs.writeFileSync(tsPath, tsContent);
  
  // Generate TypeScript color data module
  const colorDataForDemo = Object.entries(colors).map(([colorName, shades]) => ({
    name: colorName,
    displayName: colorName.charAt(0).toUpperCase() + colorName.slice(1),
    shades: Object.entries(shades).map(([shade, value]) => {
      // Convert shade format for CSS variables
      // e.g., "15050" becomes "150-50", "15075" becomes "150-75"
      let cssVarShade = shade;
      
      // Check if it's an opacity variant (like 15050, 15075, 20050, etc.)
      if (shade.length === 5 && /^\d+$/.test(shade)) {
        const baseShade = shade.substring(0, 3);
        const opacity = shade.substring(3);
        cssVarShade = `${baseShade}-${opacity}`;
      } else if (shade.length === 6 && /^\d+$/.test(shade)) {
        // Handle 6-digit patterns like 80095
        const baseShade = shade.substring(0, 3);
        const opacity = shade.substring(3);
        cssVarShade = `${baseShade}-${opacity}`;
      }
      
      return {
        shade,
        value,
        className: `ast-bg-${colorName}-${cssVarShade}`,
        cssVar: `--${colorName}-${cssVarShade}`
      };
    })
  }));

  const colorDataContent = `// Color data for demo pages - auto-generated from _colors.scss
// DO NOT EDIT MANUALLY - run 'pnpm run colors:sync' to regenerate

export interface ColorGroup {
  name: string;
  displayName: string;
  shades: Array<{
    shade: string;
    value: string;
    className: string;
    cssVar: string;
  }>;
}

export const colorData: ColorGroup[] = ${JSON.stringify(colorDataForDemo, null, 2)};

// Helper function to get color name with proper capitalization
export function getColorName(colorKey: string): string {
  return colorKey.charAt(0).toUpperCase() + colorKey.slice(1);
}

// Helper function to get all color entries
export function getColorEntries() {
  return colorData;
}
`;

  // Write the TypeScript color data file
  fs.writeFileSync(colorDataPath, colorDataContent);
  
  console.log('✅ Color data files generated successfully!');
  console.log(`📄 Updated: ${tsPath}`);
  console.log(`📄 Updated: ${colorDataPath}`);
  
  // Summary
  const totalShades = Object.values(colors).reduce((sum, shades) => sum + Object.keys(shades).length, 0);
  console.log(`📊 Total: ${Object.keys(colors).length} colors, ${totalShades} shades`);
  
} catch (error) {
  console.error('❌ Error generating color data:', error.message);
  process.exit(1);
}

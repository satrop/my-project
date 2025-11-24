#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const scssPath = path.join(__dirname, '../src/styles/tokens/spacing/_spacing.scss');
const spacingDataPath = path.join(__dirname, '../src/data/spacing-data.ts');

console.log('📏 Generating spacing data from SCSS...');

try {
  // Read the SCSS file
  const scssContent = fs.readFileSync(scssPath, 'utf8');
  
  // Parse the SCSS spacing map
  const spacingMapMatch = scssContent.match(/\$spacing:\s*\(([\s\S]*?)\);/);
  
  if (!spacingMapMatch) {
    console.error('❌ Could not find $spacing map in SCSS file');
    process.exit(1);
  }
  
  const spacingMapContent = spacingMapMatch[1];
  
  // Parse spacing tokens from the map
  const spacing = {};
  
  // Split by spacing groups (look for tokens followed by colons and parentheses)
  const spacingGroups = spacingMapContent.match(/([a-zA-Z0-9-_]+):\s*\(([\s\S]*?)\),?(?=\s*[a-zA-Z0-9-_]+\s*:|\s*$)/g);
  
  if (!spacingGroups) {
    console.error('❌ Could not parse spacing groups from SCSS');
    process.exit(1);
  }
  
  spacingGroups.forEach(group => {
    // Extract spacing token name
    const tokenNameMatch = group.match(/([a-zA-Z0-9-_]+):/);
    if (!tokenNameMatch) return;
    
    const tokenName = tokenNameMatch[1];
    
    // Extract values within parentheses
    const valuesMatch = group.match(/\(([\s\S]*)\)/);
    if (!valuesMatch) return;
    
    const valuesContent = valuesMatch[1];
    
    // Parse individual breakpoint values
    const values = {};
    const valueMatches = valuesContent.match(/([a-zA-Z0-9]+):\s*([0-9]+px)/g);
    
    if (valueMatches) {
      valueMatches.forEach(valueMatch => {
        const valueMatchParts = valueMatch.match(/([a-zA-Z0-9]+):\s*([0-9]+px)/);
        if (valueMatchParts) {
          const [, breakpoint, value] = valueMatchParts;
          values[breakpoint] = value;
        }
      });
    }
    
    if (Object.keys(values).length > 0) {
      spacing[tokenName] = values;
    }
  });
  
  console.log(`✅ Parsed ${Object.keys(spacing).length} spacing tokens:`);
  Object.entries(spacing).forEach(([name, values]) => {
    const breakpoints = Object.keys(values);
    const valueList = Object.entries(values).map(([bp, val]) => `${bp}:${val}`).join(', ');
    console.log(`   ${name}: ${breakpoints.length} breakpoint${breakpoints.length !== 1 ? 's' : ''} (${valueList})`);
  });
  
  // Generate TypeScript spacing data module
  const spacingDataForDemo = Object.entries(spacing).map(([tokenName, values]) => {
    // Determine description based on token name
    let description = 'Standard spacing token';
    const tokenNum = parseInt(tokenName);
    
    if (tokenName.includes('vertical')) {
      description = tokenName.includes('LG') ? 'Large vertical rhythm' :
                   tokenName.includes('MD') ? 'Medium vertical rhythm' : 
                   'Small vertical rhythm';
    } else if (tokenName.includes('column')) {
      description = 'Grid column gaps';
    } else if (tokenName.includes('main')) {
      description = 'Main content margins';
    } else if (!isNaN(tokenNum)) {
      if (tokenNum >= 120) description = 'Extra large spacing - for major section breaks';
      else if (tokenNum >= 80) description = 'Large spacing - for section breaks';
      else if (tokenNum >= 40) description = 'Medium spacing - for component separation';
      else if (tokenNum >= 16) description = 'Small spacing - for related content';
      else description = 'Micro spacing - for tight layouts';
    }
    
    return {
      name: tokenName,
      values,
      description,
      isSpecial: tokenName.includes('-') || isNaN(parseInt(tokenName)),
      cssVar: `--spacing-${tokenName}`,
      className: `ast-spacing-${tokenName}`
    };
  });
  
  // Separate standard and special tokens
  const standardTokens = spacingDataForDemo.filter(token => !token.isSpecial);
  const specialTokens = spacingDataForDemo.filter(token => token.isSpecial);
  
  const spacingDataContent = `// Spacing data for demo pages - auto-generated from _spacing.scss
// DO NOT EDIT MANUALLY - run 'pnpm run spacing:sync' to regenerate

export interface SpacingToken {
  name: string;
  values: Record<string, string>;
  description: string;
  isSpecial: boolean;
  cssVar: string;
  className: string;
}

export const standardSpacing: SpacingToken[] = ${JSON.stringify(standardTokens, null, 2)};

export const specialSpacing: SpacingToken[] = ${JSON.stringify(specialTokens, null, 2)};

export const allSpacing: SpacingToken[] = [...standardSpacing, ...specialSpacing];

// Helper function to get spacing token by name
export function getSpacingToken(name: string): SpacingToken | undefined {
  return allSpacing.find(token => token.name === name);
}

// Helper function to get spacing value for breakpoint
export function getSpacingValue(tokenName: string, breakpoint: string = 'lg'): string | undefined {
  const token = getSpacingToken(tokenName);
  return token?.values[breakpoint];
}
`;
  
  // Write the TypeScript spacing data file
  fs.writeFileSync(spacingDataPath, spacingDataContent);
  
  console.log('✅ Spacing data file generated successfully!');
  console.log(`📄 Updated: ${spacingDataPath}`);
  
  // Summary
  const totalBreakpoints = Object.values(spacing).reduce((sum, values) => sum + Object.keys(values).length, 0);
  console.log(`📊 Total: ${Object.keys(spacing).length} tokens, ${totalBreakpoints} breakpoint values`);
  
} catch (error) {
  console.error('❌ Error generating spacing data:', error.message);
  process.exit(1);
}
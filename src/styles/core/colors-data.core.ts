// Core color data utilities - DO NOT MODIFY
// These functions provide data manipulation for the color system
import { colors } from "./_colors-data";

// Helper function to get color name with proper capitalization
export function getColorName(colorKey: string): string {
  return colorKey.charAt(0).toUpperCase() + colorKey.slice(1);
}

// Helper function to get all color entries as an array
export function getColorEntries() {
  return Object.entries(colors);
}

// Helper function to get background color examples (first available shade for each color)
export function getBackgroundExamples() {
  return Object.entries(colors).map(([colorName, shades]) => {
    const firstShade = Object.keys(shades)[0];
    const value = Object.values(shades)[0];
    return {
      colorName,
      shade: firstShade,
      value,
      className: `ast-bg-${colorName}-${firstShade}`,
    };
  }).slice(0, 4); // Limit to first 4 for clean display
}

// Helper function to get text color examples (preferably darker shades for better contrast)
export function getTextExamples() {
  return Object.entries(colors).map(([colorName, shades]) => {
    // Try to get a darker shade (500, 400, then fallback to first available)
    const shadeEntries = Object.entries(shades);
    let selectedEntry = shadeEntries[0]; // fallback
    
    // Look for preferred darker shades
    for (const [shade, value] of shadeEntries) {
      if (shade === '500' || shade === '400') {
        selectedEntry = [shade, value];
        break;
      }
    }
    
    const [selectedShade, value] = selectedEntry;
    return {
      colorName,
      shade: selectedShade,
      value,
      className: `text-${colorName}-${selectedShade}`,
      displayName: getColorName(colorName),
    };
  }).slice(0, 4); // Limit to first 4 for clean display
}

// Helper function to get a good example color for documentation
export function getExampleColor() {
  const colorNames = Object.keys(colors);
  // Prefer colors with multiple shades for better examples
  const colorWithMultipleShades = colorNames.find(name => Object.keys(colors[name as keyof typeof colors]).length > 1);
  const exampleColorName = colorWithMultipleShades || colorNames[0];
  const shades = colors[exampleColorName as keyof typeof colors];
  
  // Try to get a 500 shade, then 400, then first available
  const preferredShades = ['500', '400'];
  let exampleShade = Object.keys(shades)[0]; // fallback
  
  for (const shade of preferredShades) {
    if (shade in shades) {
      exampleShade = shade;
      break;
    }
  }
  
  return {
    colorName: exampleColorName,
    shade: exampleShade,
  };
}

// Helper function to get multiple example colors for CSS code examples
export function getCSSExampleColors() {
  const colorNames = Object.keys(colors);
  const examples = [];
  
  // Get background color (first available color with 500 or darker shade)
  for (const colorName of colorNames) {
    const shades = colors[colorName as keyof typeof colors];
    const darkShades = ['500', '400', '700'];
    const availableShade = darkShades.find(shade => shade in shades) || Object.keys(shades)[0];
    examples.push({
      colorName,
      shade: availableShade,
      property: 'background-color',
    });
    break; // Just get the first one
  }
  
  // Get text color (prefer a different color if available)
  const remainingColors = colorNames.slice(1);
  if (remainingColors.length > 0) {
    const textColorName = remainingColors[0];
    const shades = colors[textColorName as keyof typeof colors];
    const lightShades = ['300', '400'];
    const availableShade = lightShades.find(shade => shade in shades) || Object.keys(shades)[0];
    examples.push({
      colorName: textColorName,
      shade: availableShade,
      property: 'color',
    });
  }
  
  // Get border color (prefer a third color if available)
  const borderColorNames = colorNames.slice(2);
  if (borderColorNames.length > 0) {
    const borderColorName = borderColorNames[0];
    const shades = colors[borderColorName as keyof typeof colors];
    const availableShade = Object.keys(shades)[0];
    examples.push({
      colorName: borderColorName,
      shade: availableShade,
      property: 'border-color',
    });
  }
  
  return examples;
}

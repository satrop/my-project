// Contrast checker utility for WCAG compliance
import wcagContrast from "wcag-contrast";

export interface ContrastResult {
  ratio: number;
  AA: boolean;
  AAA: boolean;
  AALarge: boolean;
  AAALarge: boolean;
}

/**
 * Check WCAG contrast ratio between two colors
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns Contrast result with ratio and compliance levels
 */
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = wcagContrast.hex(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    AA: ratio >= 4.5, // Normal text WCAG AA (4.5:1)
    AAA: ratio >= 7, // Normal text WCAG AAA (7:1)
    AALarge: ratio >= 3, // Large text WCAG AA (3:1)
    AAALarge: ratio >= 4.5, // Large text WCAG AAA (4.5:1)
  };
}

/**
 * Get contrast rating label
 */
export function getContrastRating(result: ContrastResult): string {
  if (result.AAA) return "AAA";
  if (result.AA) return "AA";
  if (result.AALarge) return "AA Large";
  return "Fail";
}

/**
 * Get contrast rating color
 */
export function getContrastRatingColor(result: ContrastResult): string {
  if (result.AAA) return "#00a854"; // Green
  if (result.AA) return "#1da1b2"; // Teal
  if (result.AALarge) return "#f5a623"; // Orange
  return "#f5222d"; // Red
}

/**
 * Check if color is light or dark
 */
export function isLightColor(hex: string): boolean {
  // Remove # if present
  const color = hex.replace("#", "");

  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate relative luminance (simplified)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
}

/**
 * Helper to extract component HTML from Astro's dist folder
 *
 * Usage:
 * 1. Build your Astro site: npm run build
 * 2. Find the page with your component in dist/
 * 3. Copy the component's HTML from the built page
 * 4. Use this helper to clean and format it for Storybook
 */

import fs from "fs";
import { JSDOM } from "jsdom";

/**
 * Extract a component from a built HTML file
 * @param {string} htmlFilePath - Path to the built HTML file in dist/
 * @param {string} selector - CSS selector to find the component
 * @returns {string} - Extracted HTML
 */
export function extractComponentHTML(htmlFilePath, selector) {
  const html = fs.readFileSync(htmlFilePath, "utf-8");
  const dom = new JSDOM(html);
  const element = dom.window.document.querySelector(selector);

  if (!element) {
    throw new Error(`Component not found with selector: ${selector}`);
  }

  return element.outerHTML;
}

// Example usage (uncomment to run):
// const accordionHTML = extractComponentHTML(
//   './dist/index.html',
//   '.ast-accordion'
// );
// console.log(accordionHTML);

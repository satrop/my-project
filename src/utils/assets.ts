/**
 * Asset Utilities
 * 
 * Helper functions for working with public assets in a way that respects
 * the configured base URL from site.config.js
 */

/**
 * Generate a properly formatted asset URL that respects the base path
 * @param path - Relative path to the asset (e.g., "images/hero.jpg")
 * @returns Full URL with base path included
 * 
 * @example
 * Instead of: import.meta.env.BASE_URL + "images/hero.jpg"
 * Use this: src={asset("images/hero.jpg")}
 */
export const asset = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Ensure base URL ends with a slash
  const baseUrl = import.meta.env.BASE_URL;
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  
  return normalizedBase + cleanPath;
};

/**
 * Generate asset URLs for use in JavaScript objects (like Swiper slides)
 * @param paths - Array of asset paths
 * @returns Array of full URLs
 * 
 * @example
 * const imageUrls = assets(["images/slide1.jpg", "images/slide2.jpg"]);
 */
export const assets = (paths: string[]): string[] => {
  return paths.map(path => asset(path));
};



/**
 * Usage examples
 *
 * 1) Inline style in a component (Astro / React / Vue) — preferred when you need
 *    the helper to produce an absolute URL for a CSS background image.
 *
 * Astro / JSX example:
  * import { asset } from "~/utils/assets";
  *
 * In a component render:
 * div style={`background-image: url(${asset("images/nav-background.svg")});`} />
 *
 * 2) Set a CSS custom property from your component and consume it in SCSS.
 *    Useful when you want the background declared in your stylesheet but the
 *    URL resolved at runtime/build by the helper.
 *
 * // Component (Astro / JSX):
 * // <div style={`--nav-bg: url(${asset("images/nav-background.svg")})` } class="ast-navigation__mega-container">...</div>
 *
 * // In your SCSS (`NavDesktop.scss`):
 * // .ast-navigation__mega-container { background: var(--nav-bg); background-size: cover; }
 *
 * Notes:
 * - You can't call this TypeScript helper directly from plain SCSS. Use an inline
 *   style or CSS variable set from JS/ASTRO so the URL produced by `asset()` is
 *   available to your stylesheet.
 */

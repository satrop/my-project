/**
 * Main component initialization
 * Centralized approach - clear separation of auto-load vs DOM-ready
 */

// Auto-load components (self-register via initComponent)
import '../components/index.js';

// Import DOM-dependent functions from index files
import { initAnimations } from '../utils/index.js';
import { initParentLinks, initTruncate } from './index.js';

// Initialize DOM-dependent features when ready
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initParentLinks();
  initTruncate();
});




/**
 * Utilities barrel export
 */

// Import for side-effects (imageHandler auto-initializes)
import './imageHandler.js';

// Export utilities that might be needed directly
export { initAnimations, triggerAnimation, clearAnimation } from './animations.js';
export { initComponent } from './initComponent.js';
export { GlobalImageHandler, globalImageHandler } from './imageHandler.js';
export { getAnimationClass, getAnimationAttrs } from './animationHelpers.ts';
/**
 * Animation utilities for components
 * Provides consistent animation prop handling across all components
 */

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';
export type AnimationProp = AnimationDirection | boolean;

/**
 * Converts animation prop to CSS animation class name
 * @param animateValue - The animation prop value
 * @returns Animation class name or undefined if animation is disabled
 */
export function getAnimationClass(animateValue: AnimationProp): string | undefined {
  if (!animateValue) return undefined;
  if (animateValue === true) return "fadeInUp"; // Default to up if just true
  if (typeof animateValue === "string") {
    return `fadeIn${animateValue.charAt(0).toUpperCase() + animateValue.slice(1)}`;
  }
  return undefined;
}

/**
 * Creates animation attributes object for component props
 * @param animateValue - The animation prop value
 * @returns Object with data-animate attribute
 */
export function getAnimationAttrs(animateValue: AnimationProp): Record<string, string | undefined> {
  return {
    "data-animate": getAnimationClass(animateValue),
  };
}

/**
 * Animation interface for component props
 * Use this in component prop interfaces for consistent animation support
 */
export interface AnimationProps {
  /**
   * Animation direction or boolean to enable/disable animations
   * - 'up': Fades in from bottom (default)
   * - 'down': Fades in from top
   * - 'left': Fades in from left
   * - 'right': Fades in from right
   * - true: Uses default direction (up)
   * - false: Disables animation
   */
  animate?: AnimationProp;
}
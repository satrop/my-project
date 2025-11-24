export function initComponent(name, callback) {
  if (typeof window === 'undefined') return // ⛔ Exit on server

  try {
    const elements = document.querySelectorAll(`[data-js="${name}"]:not([data-init])`)
    
    elements.forEach((el) => {
      // Defensive check to ensure element is valid
      if (!el || typeof el.setAttribute !== 'function') {
        console.error(`initComponent: Invalid element found for "${name}"`, el);
        return;
      }
      
      el.setAttribute('data-init', 'true')
      
      // If callback is a class (has a prototype with a constructor), use 'new', else call as function
      if (typeof callback === 'function' && callback.prototype && callback.prototype.constructor === callback) {
        new callback(el);
      } else {
        callback(el);
      }
    })
  } catch (error) {
    console.error(`initComponent failed for "${name}":`, error);
  }
}
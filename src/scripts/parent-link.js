/**
 * Parent Link Function
 * Makes parent elements clickable by linking them to child link elements or adjacent sibling links
 * 
 * Usage:
 * - Add data-parent-link="true" to the parent element you want to make clickable
 * - Add data-link-target="true" to the link element inside the parent OR to an adjacent sibling
 * - The function will search for the link target in this order:
 *   1. Inside the parent element (child)
 *   2. Next sibling element
 *   3. Previous sibling element
 * - The function will automatically initialize when imported
 */

export function initParentLinks(container = document) {
  // Defensive check to ensure we have a valid DOM element or document
  if (!container || typeof container.querySelectorAll !== 'function') {
    console.error('initParentLinks: Invalid container element', container);
    return;
  }
  
  // Find all elements with data-parent-link="true"
  const parentElements = container.querySelectorAll('[data-parent-link="true"]');
  
  parentElements.forEach(parent => {
    // Skip if already initialized to avoid duplicate listeners
    if (parent.hasAttribute('data-parent-link-initialized')) {
      return;
    }
    
    // Find the target link within this parent, or in adjacent siblings
    let targetLink = parent.querySelector('[data-link-target="true"]');
    
    // If not found inside parent, check next sibling
    if (!targetLink && parent.nextElementSibling) {
      targetLink = parent.nextElementSibling.querySelector('[data-link-target="true"]');
      // Also check if the sibling itself is the target
      if (!targetLink && parent.nextElementSibling.hasAttribute('data-link-target')) {
        targetLink = parent.nextElementSibling;
      }
    }
    
    // If still not found, check previous sibling
    if (!targetLink && parent.previousElementSibling) {
      targetLink = parent.previousElementSibling.querySelector('[data-link-target="true"]');
      // Also check if the sibling itself is the target
      if (!targetLink && parent.previousElementSibling.hasAttribute('data-link-target')) {
        targetLink = parent.previousElementSibling;
      }
    }
    
    if (targetLink && targetLink.href) {
      // Add cursor pointer to indicate it's clickable
      parent.style.cursor = 'pointer';
      
      // Add click event listener to the parent
      parent.addEventListener('click', function(event) {
        // Prevent triggering if the actual link was clicked
        if (event.target === targetLink || targetLink.contains(event.target)) {
          return;
        }
        
        // Check if it's a middle click or ctrl/cmd click for new tab
        if (event.ctrlKey || event.metaKey || event.button === 1) {
          window.open(targetLink.href, '_blank');
        } else {
          // Navigate to the link
          window.location.href = targetLink.href;
        }
      });
      
      // Handle middle mouse click for new tab
      parent.addEventListener('auxclick', function(event) {
        if (event.button === 1) { // Middle mouse button
          event.preventDefault();
          window.open(targetLink.href, '_blank');
        }
      });
      
      // Optional: Add keyboard accessibility (Enter and Space keys)
      parent.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          
          if (event.ctrlKey || event.metaKey) {
            window.open(targetLink.href, '_blank');
          } else {
            window.location.href = targetLink.href;
          }
        }
      });
      
      // Make the parent focusable for keyboard navigation
      if (!parent.hasAttribute('tabindex')) {
        parent.setAttribute('tabindex', '0');
      }
      
      // Add ARIA attributes for accessibility
      parent.setAttribute('role', 'button');
      parent.setAttribute('aria-label', `Navigate to ${targetLink.textContent.trim() || targetLink.href}`);
      
      // Add hover event listeners to trigger hover effects on the target link
      parent.addEventListener('mouseenter', function(event) {
        // Don't trigger if we're already hovering the actual link
        if (event.target === targetLink || targetLink.contains(event.target)) {
          return;
        }
        
        // Prevent recursion by checking if we're already in a hover state
        if (parent.hasAttribute('data-hover-active')) {
          return;
        }
        
        // Mark hover as active to prevent recursion
        parent.setAttribute('data-hover-active', 'true');
        
        // Trigger hover state on the target link
        targetLink.classList.add('hover-triggered');
      });
      
      parent.addEventListener('mouseleave', function(event) {
        // Don't trigger if we're still over the actual link
        if (event.relatedTarget === targetLink || (event.relatedTarget && targetLink.contains(event.relatedTarget))) {
          return;
        }
        
        // Remove hover active state
        parent.removeAttribute('data-hover-active');
        
        // Remove hover state from the target link
        targetLink.classList.remove('hover-triggered');
      });
      
      // Mark as initialized
      parent.setAttribute('data-parent-link-initialized', 'true');
    }
  });
}

// Re-initialize when new content is added (useful for dynamic content)
export function reinitParentLinks() {
  initParentLinks();
}

// Export for global access
if (typeof window !== 'undefined') {
  window.initParentLinks = initParentLinks;
  window.reinitParentLinks = reinitParentLinks;
}
/**
 * Initialize animation observer for elements with data-animate attribute
 */
function initAnimationObserver() {
  if (!window.IntersectionObserver) return;

  // Skip intersection observer for BackstopJS testing
  const isBackstopTesting = new URLSearchParams(window.location.search).get('backstop') === 'true';
  
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  if (isBackstopTesting) {
    // For BackstopJS, immediately show all animations
    elements.forEach(element => {
      const { animate, animateDelay, animateDuration } = element.dataset;
      
      element.classList.add('ast-animate__animated', `ast-animate__${animate}`, 'in-viewport');
      const normalizedDelay = animateDelay ? animateDelay.replace('.', '_') : '';
      if (animateDelay) element.classList.add(`ast-animate__delay-${normalizedDelay}`);
      if (animateDuration) element.classList.add(`ast-animate__${animateDuration}`);
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        const { animate, animateDelay, animateDuration } = target.dataset;
        
        target.classList.add('ast-animate__animated', `ast-animate__${animate}`, 'in-viewport');
        const normalizedDelay = animateDelay ? animateDelay.replace('.', '_') : '';
        if (animateDelay) target.classList.add(`ast-animate__delay-${normalizedDelay}`);
        if (animateDuration) target.classList.add(`ast-animate__${animateDuration}`);
        
        observer.unobserve(target);
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  elements.forEach(el => {
    el.classList.add('ast-animate-on-scroll');
    observer.observe(el);
  });
}

/**
 * Initialize animations
 */
export function initAnimations() {
  initAnimationObserver();
}

/**
 * Trigger animation manually
 */
export function triggerAnimation(element, animationType, options = {}) {
  if (!(element instanceof Element)) return;

  const { delay, duration, infinite, repeat } = options;
  
  element.classList.add('ast-animate__animated', `ast-animate__${animationType}`);
  if (delay) element.classList.add(`ast-animate__delay-${delay}`);
  if (duration) element.classList.add(`ast-animate__${duration}`);
  if (infinite) element.classList.add('ast-animate__infinite');
  if (repeat) element.classList.add(`ast-animate__repeat-${repeat}`);
  
  return new Promise(resolve => {
    const handler = () => {
      element.removeEventListener('animationend', handler);
      resolve();
    };
    element.addEventListener('animationend', handler);
  });
}

/**
 * Remove animation classes from element
 */
export function clearAnimation(element) {
  if (!(element instanceof Element)) return;

  element.classList.remove(
    ...Array.from(element.classList).filter(c => c.startsWith('ast-animate__')),
    'ast-animate-on-scroll', 
    'in-viewport'
  );
}

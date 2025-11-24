/**
 * Simple Image Error Handler
 * Just handles broken images - perfect for static HTML handoff to backend devs
 */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.classList.add('ast-img--error');
    });
  });
});

/**
 * Truncates text in elements with data-truncate attribute to the specified number of lines.
 */
export function initTruncate() {
    const elements = document.querySelectorAll('[data-truncate]');
    elements.forEach(el => {
        const lines = parseInt(el.getAttribute('data-truncate'));
        if (lines > 0) {
            el.style.display = '-webkit-box';
            el.style.webkitLineClamp = lines.toString();
            el.style.webkitBoxOrient = 'vertical';
            el.style.overflow = 'hidden';
        }
    });
}
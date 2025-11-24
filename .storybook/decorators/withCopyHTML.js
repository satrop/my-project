/**
 * Decorator that adds a "Copy HTML" button to stories
 * Allows developers to easily copy the rendered component HTML
 */

export const withCopyHTML = (Story, context) => {
  const container = document.createElement("div");
  container.style.position = "relative";

  // Create the story content
  const storyContainer = document.createElement("div");
  storyContainer.className = "story-content";

  // Create copy button
  const button = document.createElement("button");
  button.textContent = "📋 Copy HTML";
  button.style.cssText = `
    position: absolute;
    top: 0px;
    right: 0;
    padding: 8px 16px;
    background: #1ea7fd;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    z-index: 1000;
    transition: background 0.2s;
  `;

  button.addEventListener("mouseenter", () => {
    button.style.background = "#0d8dd6";
  });

  button.addEventListener("mouseleave", () => {
    button.style.background = "#1ea7fd";
  });

  button.addEventListener("click", async () => {
    // Get the actual component HTML (first child), not the wrapper div
    const componentHTML = storyContainer.firstChild?.outerHTML || storyContainer.innerHTML;

    try {
      await navigator.clipboard.writeText(componentHTML);

      // Success feedback
      const originalText = button.textContent;
      button.textContent = "✓ Copied!";
      button.style.background = "#66bf3c";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "#1ea7fd";
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const componentHTML = storyContainer.firstChild?.outerHTML || storyContainer.innerHTML;
      const textarea = document.createElement("textarea");
      textarea.value = componentHTML;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      button.textContent = "✓ Copied!";
      button.style.background = "#66bf3c";

      setTimeout(() => {
        button.textContent = "📋 Copy HTML";
        button.style.background = "#1ea7fd";
      }, 2000);
    }
  });

  container.appendChild(button);
  container.appendChild(storyContainer);

  // Render the story
  const storyContent = Story();
  storyContainer.appendChild(storyContent);

  return container;
};

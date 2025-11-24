/**
 * HTML Validate Transform for Astro Files
 * Extracts HTML content from Astro files for validation
 */

module.exports = function (source, filename) {
  // Remove frontmatter (content between --- delimiters)
  let content = source.replace(/^---[\s\S]*?---\n?/m, "");

  // Remove Astro directives from attributes
  content = content.replace(/\s+class:list=\{[^}]+\}/g, ' class=""');
  content = content.replace(/\s+set:html=\{[^}]+\}/g, "");
  content = content.replace(/\s+set:text=\{[^}]+\}/g, "");
  content = content.replace(/\s+client:\w+/g, "");
  content = content.replace(/\s+transition:\w+(?:=\{[^}]+\})?/g, "");

  // Replace Astro expressions in text content with placeholder
  content = content.replace(/\{[^}<>]+\}/g, "placeholder");

  // Replace self-closing Astro components
  content = content.replace(/<([A-Z][a-zA-Z0-9]*)\s+([^>]*?)\/>/g, '<div data-component="$1" $2></div>');

  // Replace opening Astro component tags
  content = content.replace(/<([A-Z][a-zA-Z0-9]*)(\s+[^>]*)?>/g, (match, tag, attrs) => {
    // Clean up attributes to remove Astro-specific syntax
    if (attrs) {
      attrs = attrs.replace(/\s*\w+:\w+(?:=\{[^}]+\})?/g, "");
      attrs = attrs.replace(/\{[^}]+\}/g, '""');
    }
    return `<div data-component="${tag}"${attrs || ""}>`;
  });

  // Replace closing Astro component tags
  content = content.replace(/<\/([A-Z][a-zA-Z0-9]*)>/g, "</div>");

  return content;
};

// Utility functions for component documentation pages

/**
 * Generate consistent component page metadata
 */
export function generateComponentPageMeta(componentName: string) {
  return {
    title: `${componentName} Component Demo`,
    pageClass: "ast-centered-page",
    layoutType: "centered" as const,
  };
}

/**
 * Get component download props
 */
export function getComponentDownloadProps(componentName: string, customText?: string) {
  return {
    componentName,
    buttonText: customText || `Download ${componentName} Component`,
  };
}

/**
 * Common styles for component demo pages
 */
export const componentPageStyles = `
  .ast-component-demo {
    margin: 2rem 0;
  }
  
  .ast-demo-section {
    margin: 3rem 0;
  }
  
  .ast-demo-divider {
    margin: 2rem 0;
    border: none;
    border-top: 1px solid #e0e0e0;
  }
  
  .ast-demo-title {
    margin: 2rem 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

export default {
  generateComponentPageMeta,
  getComponentDownloadProps,
  componentPageStyles,
};
export interface NavItem {
  name: string;
  url: string;
  isActive?: boolean;
  isHeader?: boolean;
  className?: string;
}

// All navigation items in one flat list with category headers
export const allNavigationItems: NavItem[] = [
  // Components
  { name: "Components", url: "", isHeader: true },

  { name: "Image and Text Block", url: "./image-n-text-block.html", className: "ast-complete"},
  { name: "Image & Text List", url: "./image-n-text-list.html", className: "ast-complete"},
  { name: "Number and Text Grid", url: "./number-text-grid.html", className: "ast-complete"},
  { name: "Link List", url: "./link-list.html", className: "ast-complete"},
  { name: "Icon List", url: "./icon-list.html", className: "ast-complete"},
  { name: "Accordion", url: "./accordion.html", className: "ast-complete"},
  { name: "Alert", url: "./alert.html", className: "ast-complete"},
  { name: "Callout (Simple)", url: "./simple-callout.html", className: "ast-complete"},
  { name: "Callout (Image)", url: "./simple-callout-image.html", className: "ast-complete"},
  { name: "Image and Caption", url: "./image-with-caption.html", className: "ast-complete"},
  { name: "Image Gallery", url: "./image-gallery.html", className: "ast-complete"},
  { name: "Simple Table", url: "./table.html", className: "ast-complete"},
  // { name: "Dynamic Table", url: "", className: "ast-not-done"},
  { name: "Pullquote", url: "./pullquote.html", className: "ast-complete"},
  { name: "Testimonial", url: "./testimonial.html", className: "ast-complete"},
  { name: "Embedded Video", url: "./embedded-video.html", className: "ast-complete"},
  { name: "Simple Person Listing", url: "./person-block.html", className: "ast-complete"},
  { name: "Award Block", url: "./award-block.html", className: "ast-complete"},
  { name: "Partner Database", url: "./partner-database.html", className: "ast-complete"},
  // { name: "Interactive Map", url: "", className: "ast-not-done"},
  { name: "Homepage Intro Section", url: "./intro.html", className: "ast-complete"},
  { name: "Homepage Large-Scale Image Callout", url: "./large-scale-image-callout.html", className: "ast-complete"},
  { name: "Search Result Block (Gated & Standard)", url: "./search-result-block.html", className: "ast-complete"},
  { name: "Newsletter List Block", url: "./newsletter-list-block.html", className: "ast-complete" },
  { name: "Newsletter Issue Block", url: "./newsletter-issue-block.html", className: "ast-complete" },
  { name: "Featured Event Block x3", url: "./list-event-block.html", className: "ast-complete" },
  { name: "Event Tab Calendar Block", url: "./list-event-block.html", className: "ast-complete"},
  { name: "Webinar Tab Calendar Block", url: "./list-event-block.html", className: "ast-complete"},
  { name: "Archive Tab Calendar Block", url: "./list-event-block.html", className: "ast-complete"},
  { name: "Event Fee Pricing", url: "./event-fee-pricing.html", className: "ast-complete"},
  { name: "Event-Specific Image Callout", url: "./event-specific-image-callout.html", className: "ast-complete"},
  { name: "Featured Article Block", url: "./featured-article-block.html", className: "ast-complete"},
  { name: "List Article Block", url: "./list-article-block.html", className: "ast-complete"},
  { name: "Article Share Block", url: "./article-share-block.html", className: "ast-complete"},
  { name: "Subscribe Bar", url: "./subscribe-bar.html", className: "ast-complete"},
  { name: "Lab Matters Issue-to-Issue Pagination", url: "./lab-matters-issue-to-issue-pagination.html", className: "ast-complete"},
  { name: "Lab Matters Universal Content", url: "./lab-matters-universal-content.html", className: "ast-complete"},
  { name: "Lab Matters Archive Blocks", url: "./lab-matters-archive-blocks.html", className: "ast-complete"},
  { name: "Press Release About Block", url: "./press-release-about-block.html", className: "ast-complete"},
  { name: "Lab Multi-Author List", url: "./lab-multi-author-list.html", className: "ast-complete"},
  { name: "Single-Resource Block", url: "./single-resource-block.html", className: "ast-complete"},
  { name: "Single-Resource Card", url: "./single-resource-card.html", className: "ast-complete"},
  { name: "Toolkit Block", url: "./toolkit-block.html", className: "ast-complete"},
  { name: "Collection Slider w/Single-Resource Cards", url: "./collection-slider.html", className: "ast-complete"},
  { name: "Expandable Toolkit", url: "./expandable-toolkit.html", className: "ast-complete"},
  { name: "Request Access Modal", url: "./request-access.html", className: "ast-complete" },
  { name: "Request Submission Modal", url: "./request-submission.html", className: "ast-complete" },
  { name: "Newsletter subscription", url: "./newsletter-subscription.html", className: "ast-complete" },
  { name: "Side Column: Standard ToC & Related Pages", url: "./side-col-related-links-slide-to.html", className: "ast-complete"},
  { name: "Side Column: Recent Articles", url: "./side-col-recent-articles.html", className: "ast-complete"},
  { name: "Side Column: Recent Articles w/Ad", url: "./side-col-recent-articles-ad.html", className: "ast-complete"},
  { name: "Side Column: Recent Articles w/Member Info", url: "./side-col-recent-articles-member-info.html", className: "ast-complete"},
  { name: "Side Column: Filters", url: "./side-col-filters.html", className: "ast-complete"},

  { name: "Breadcrumbs", url: "./breadcrumbs.html", className: "ast-complete" },
  { name: "Collapsible Filters Section", url: "./collapsible-filters-section.html", className: "ast-complete" },
  { name: "Highlighted Download aka \"Visual Download Highlight\"", url: "./highlighted-download.html", className: "ast-complete" },
  { name: "Jump To", url: "./jump-to.html", className: "ast-complete" },
  { name: "Pagination", url: "./pagination.html", className: "ast-complete" },
  { name: "Related Links", url: "./related-links.html", className: "ast-complete" },
  { name: "Search Input", url: "./search-input.html", className: "ast-complete" },
  { name: "Simple Filters", url: "./simple-filters.html", className: "ast-complete" },

  // Heros
  { name: "Heros", url: "", isHeader: true },
  { name: "Hero Home Page", url: "./hero-home.html", className: "ast-complete" },
  { name: "Hero 404", url: "./hero-404.html", className: "ast-complete" },
  { name: "Hero Lab Matters", url: "./hero-lab-matters.html", className: "ast-complete" },
  { name: "Hero Standard - No Image", url: "./hero-standard-no-image.html", className: "ast-complete" },
  { name: "Hero Standard", url: "./hero-standard.html", className: "ast-complete" },
  { name: "Hero Magazine Home", url: "./hero-magazine-home.html", className: "ast-complete" },
  { name: "Hero Magazine Feature", url: "./hero-magazine-feature.html", className: "ast-complete" },
  { name: "Hero Magazine Article", url: "./hero-magazine-article.html", className: "ast-complete" },
  { name: "Hero Magazine Spotlight", url: "./hero-magazine-spotlight.html", className: "ast-complete" },
  { name: "Hero Blog Home", url: "./hero-blog-home.html", className: "ast-complete" },
  { name: "Hero Blog Standard Post", url: "./hero-blog-standard-post.html", className: "ast-complete" },
  { name: "Hero Blog Ad Post", url: "./hero-blog-ad-post.html", className: "ast-complete" },
  { name: "Hero Event", url: "./hero-event.html", className: "ast-complete" },
  { name: "Hero Newsroom", url: "./hero-newsroom.html", className: "ast-complete" },
  { name: "Hero News Article", url: "./hero-news-article.html", className: "ast-complete" },

  // Navigation Components
  { name: "Navigation", url: "", isHeader: true },
  { name: "Navigation Logged In", url: "./nav-logged-in.html", className: "ast-complete" },
  { name: "Navigation Logged Out", url: "./nav-logged-out.html", className: "ast-complete" },
  { name: "Footer", url: "./footer.html", className: "ast-complete" },
  { name: "Breadcrumbs", url: "./breadcrumbs.html", className: "ast-complete" },

  // Layout & Design
  { name: "Layout & Design", url: "", isHeader: true },
  { name: "Typography", url: "./typography.html", className: "ast-complete" },
  { name: "Colors", url: "./colors.html", className: "ast-complete" },
  { name: "Icons", url: "./icons.html", className: "ast-complete" },
];

/**
 * Get all navigation items with active state based on current page
 */
export function getAllNavigationWithActiveState(currentPage?: string): NavItem[] {
  return allNavigationItems.map(item => ({
    ...item,
    isActive: currentPage && !item.isHeader ? item.url === `./${currentPage}.html` : false,
  }));
}

/**
 * Get navigation items for a specific category (deprecated - kept for compatibility)
 */
export function getCategoryNavigation(categoryTitle: string, currentPath?: string): NavItem[] {
  // Return the full list since we now show everything
  return getAllNavigationWithActiveState(currentPath);
}

/**
 * Get all form component navigation items with active state (now returns all items)
 */
export function getFormComponentNavigation(currentPath?: string): NavItem[] {
  return getAllNavigationWithActiveState(currentPath);
}

/**
 * Get navigation items with active state based on current page
 */
export function getNavigationWithActiveState(items: NavItem[], currentPage: string): NavItem[] {
  return items.map(item => ({
    ...item,
    isActive: !item.isHeader && item.url === `./${currentPage}.html`,
  }));
}

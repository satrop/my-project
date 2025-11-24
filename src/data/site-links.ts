// Site navigation links and components data
// This file contains all the navigation data used throughout the site

// Type definitions for link items
export interface LinkItem {
  name: string;
  url: string;
  className: "no" | "started" | "done"; // no = ❌, started = 🛠️, done = ✅
}

export interface SiteLinksData {
  heroComponents: LinkItem[];
  contentComponents: LinkItem[];
  layoutDesign: LinkItem[];
  pages: LinkItem[];
}

// Site links data
const siteLinks: SiteLinksData = {
  // Hero components for homepage and landing pages
  heroComponents: [
    {
      name: "Hero Home Page",
      url: "hero-home.html",
      className: "no",
    },
  ],

  // Content components used throughout the site
  contentComponents: [
    {
      name: "Image Component",
      url: "components/images.html",
      className: "done",
    },
    {
      name: "Accordion Component",
      url: "components/accordion.html",
      className: "done",
    },
    {
      name: "50/50 Component",
      url: "components/fifty-fifty.html",
      className: "done",
    },
  ],

  // Layout and design system components
  layoutDesign: [
    {
      name: "Typography",
      url: "demos/typography.html",
      className: "done",
    },
    {
      name: "Colors",
      url: "demos/colors.html",
      className: "done",
    },
    {
      name: "Spacing",
      url: "demos/spacing.html",
      className: "done",
    },
    {
      name: "Icons",
      url: "demos/icons.html",
      className: "done",
    },
    {
      name: "Centered Column Example",
      url: "demos/centered-column.html",
      className: "done",
    },
    {
      name: "Left Column Example",
      url: "demos/left-column.html",
      className: "done",
    },
    {
      name: "Left Column Example - With Breakouts",
      url: "demos/left-column-with-breakouts.html",
      className: "done",
    },
    {
      name: "Right Column Example",
      url: "demos/right-column.html",
      className: "done",
    },
    {
      name: "Right Column Example - With Breakouts",
      url: "demos/right-column-with-breakouts.html",
      className: "done",
    },
  ],

  // Main site pages
  pages: [
    {
      name: "Homepage",
      url: "./homepage.html",
      className: "no",
    },
  ],
};

export { siteLinks };

# FiftyFifty Component

A flexible 50/50 layout component for creating side-by-side content and image layouts with configurable positioning.

## Features

- **Two Layout Variants**: Choose between `left` (image left, content right) or `right` (content left, image right)
- **Optional Image Support**: Include images with automatic asset processing, or display a graceful placeholder when no image is provided
- **Flexible Content**: Support for eyebrow text, header, description, and customizable button with multiple style variants
- **Mobile Responsive**: Automatic single-column layout on mobile with optional content reordering
- **Extensible**: Use slots for custom HTML content beyond the standard props
- **Accessible**: Built with semantic HTML and accessibility best practices

## Installation

```astro
---
import FiftyFifty from "@/components/FiftyFifty/FiftyFifty.astro";
---
```

## Basic Usage

```astro
<FiftyFifty
  variant="left"
  image={{
    src: 'hero-image.jpg',
    alt: 'Product showcase'
  }}
  eyebrow="Featured"
  header="Amazing Product"
  description="Transform your workflow with our innovative solution."
  button={{
    text: "Get Started",
    href: "/signup",
    variant: "primary"
  }}
/>
```

## Props

| Prop              | Type                                 | Default     | Description                                                                |
| ----------------- | ------------------------------------ | ----------- | -------------------------------------------------------------------------- |
| `variant`         | `'left' \| 'right'`                  | `'left'`    | Layout variant: `left` places image on left, `right` places image on right |
| `image`           | `object`                             | `undefined` | Image configuration object (optional)                                      |
| `image.src`       | `string`                             | -           | Image filename in `public/img/` directory (e.g., `'hero-image.jpg'`)       |
| `image.alt`       | `string`                             | -           | Alt text for the image (required for accessibility when image is provided) |
| `eyebrow`         | `string`                             | `undefined` | Small uppercase text above the header                                      |
| `header`          | `string`                             | `undefined` | Main heading text (rendered as an h2 element)                              |
| `description`     | `string`                             | `undefined` | Body text content (rendered as paragraph)                                  |
| `button`          | `object`                             | `undefined` | Button configuration object (optional)                                     |
| `button.text`     | `string`                             | -           | Button text content                                                        |
| `button.href`     | `string`                             | -           | Button link destination URL                                                |
| `button.variant`  | `'primary' \| 'secondary' \| 'link'` | `'primary'` | Button style variant                                                       |
| `reverseOnMobile` | `boolean`                            | `false`     | When `true`, displays content before image on mobile devices (< 768px)     |
| `class`           | `string`                             | `''`        | Additional CSS classes to apply to the root element                        |

## Examples

### Left Variant (Image Left, Content Right)

```astro
<FiftyFifty
  variant="left"
  image={{ src: 'landscape.jpg', alt: 'Beautiful landscape' }}
  eyebrow="Featured"
  header="Mountain Vista"
  description="Experience breathtaking mountain views."
  button={{ text: "Explore", href: "#", variant: "primary" }}
/>
```

### Right Variant (Content Left, Image Right)Shown)

```astro
<FiftyFifty
  variant="right"
  eyebrow="About"
  header="Our Story"
  description="We've been helping businesses succeed for over a decade."
  button={{ text: "Learn More", href: "/about", variant: "secondary" }}
/>
```

### Custom Content with Slots

```astro
<FiftyFifty
  variant="left"
  image={{ src: 'team.jpg', alt: 'Our team' }}
  header="Meet the Team"
>
  <p>Custom content goes here using slots.</p>
  <ul>
    <li>Team member 1</li>
    <li>Team member 2</li>
    <li>Team member 3</li>
  </ul>
  <a href="/team" class="custom-link">View All Team Members</a>
</FiftyFifty>
```

### Mobile Content Reordering

```astro
<FiftyFifty
  variant="left"
  reverseOnMobile={true}
  image={{ src: 'mobile-app.jpg', alt: 'Mobile app interface' }}
  header="Mobile First Design"
  description="On mobile, content appears before image for better UX."
/>
```

## Button Variants

The component supports three button styles:

### Primary Button (Solid Background)

```astro
button={{ text: "Get Started", href: "/signup", variant: "primary" }}
```

### Secondary Button (Outlined)

```astro
button={{ text: "Learn More", href: "/about", variant: "secondary" }}
```

### Link Button (Text Only)

```astro
button={{ text: "Read More", href: "/blog", variant: "link" }}
```

## Styling & Theming

The component uses CSS custom properties (CSS variables) for easy theming. You can override these in your own stylesheets:

```css
.ast-fifty-fifty {
  /* Color variables */
  --theme-accent: #3b82f6; /* Primary brand color */
  --theme-accent-2: #2563eb; /* Hover/active state color */
  --color-text: #1f2937; /* Main text color */
  --color-text-muted: #6b7280; /* Secondary text color */
  --color-background-secondary: #f8f9fa; /* Placeholder background */
  --color-border: #e2e8f0; /* Border colors */
}
```

### Custom Styling

To add custom styles, modify the component's SCSS file after the "do not edit" line:

```scss
// * --------------------------------------------
// * Define custom styles below
// * Use the "ast-" prefix to avoid conflicts
// * --------------------------------------------

.ast-fifty-fifty {
  // Your custom styles here
  padding: 6rem 0; // Example: increase section padding
}
```

## Responsive Behavior

The component automatically adapts to different screen sizes:

| Breakpoint         | Layout                                       | Gap  |
| ------------------ | -------------------------------------------- | ---- |
| Mobile (< 768px)   | Single column, image above content (default) | 2rem |
| Tablet (≥ 768px)   | Two column 50/50 split                       | 3rem |
| Desktop (≥ 1024px) | Two column 50/50 split                       | 4rem |

### Mobile Content Ordering

By default on mobile, the image appears above the content. Use `reverseOnMobile={true}` to display content before the image on mobile devices:

```astro
<FiftyFifty
  variant="left"
  reverseOnMobile={true}
  header="Mobile-First Content"
  description="This content appears first on mobile."
  image={{ src: 'example.jpg', alt: 'Example image' }}
/>
```

## Accessibility

The component follows accessibility best practices:

✅ Uses semantic HTML (headers rendered as h2, proper sectioning)
✅ Requires alt text when images are provided
✅ Links and buttons are keyboard accessible
✅ Sufficient color contrast ratios (WCAG AA compliant)
✅ Responsive and mobile-friendly
✅ Screen reader friendly content structure

## Browser Support

✅ All modern browsers (Chrome, Firefox, Safari, Edge)
✅ Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
✅ CSS Grid support required (IE 11 not supported)

## Technical Details

### Dependencies

`@/utils/assets` - For processing image paths from the `public/img/` directory

### Component Structure

**File**: `FiftyFifty.astro`
**Styles**: `FiftyFifty.scss`
**Type**: Astro component (server-rendered)
**Props Interface**: TypeScript interface exported for type safety

## Quick Reference

**Minimal example:**

```astro
<FiftyFifty header="Hello" description="World" />
```

**Full-featured example:**

```astro
<FiftyFifty
  variant="left"
  image={{ src: 'photo.jpg', alt: 'Description' }}
  eyebrow="Label"
  header="Main Title"
  description="Supporting text goes here."
  button={{ text: "Click Me", href: "/page", variant: "primary" }}
  reverseOnMobile={true}
  class="custom-class"
/>
```

**Common use cases:**

Landing page hero sections
Feature showcases
Product highlights
About/team sections
Content marketing layouts

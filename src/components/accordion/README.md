# Accordion Component

Accessible accordion/collapsible content component with keyboard navigation, ARIA support, and smooth animations.

## Features

- Keyboard navigation (Arrow keys, Home/End, Enter/Space)
- Proper ARIA attributes (`aria-expanded`, `aria-controls`, `aria-labelledby`)
- Supports single or multiple open panels (`allowMultiple`)
- Accepts plain text or HTML content for panels
- CSS-driven animations with reduced-motion support
- Public JS API and custom events for programmatic control

## Installation / Import

```astro
---
import Accordion from '@/components/Accordion/Accordion.astro';
---
```

## Props

| Prop            | Type                                 | Default      | Description                            |
| --------------- | ------------------------------------ | ------------ | -------------------------------------- |
| `items`         | `AccordionItem[]`                    | **required** | Array of accordion items               |
| `allowMultiple` | `boolean`                            | `false`      | Allow multiple panels to be open       |
| `variant`       | `'default' \| 'bordered' \| 'flush'` | `'default'`  | Visual style variant                   |
| `class`         | `string`                             | `''`         | Additional CSS classes applied to root |

### AccordionItem

| Property      | Type     | Required | Description                                |
| ------------- | -------- | -------- | ------------------------------------------ |
| `id`          | `string` | ✅       | Unique identifier for the item             |
| `title`       | `string` | ✅       | Panel header text                          |
| `content`     | `string` | ❌       | Plain text content                         |
| `htmlContent` | `string` | ❌       | HTML content (takes priority over content) |

## Usage

Minimal example:

```astro
---
import Accordion from '@/components/Accordion/Accordion.astro';

const items = [
  { id: 'item1', title: 'What is this?', content: 'Basic text content.' },
  { id: 'item2', title: 'How does it work?', content: 'Click header to toggle.' }
];
---

<Accordion items={items} />
```

Allow multiple panels:

```astro
<Accordion items={items} allowMultiple={true} />
```

HTML content example:

```astro
const richItems = [
  { id: 'r1', title: 'HTML panel', htmlContent: `<p><strong>Rich</strong> HTML content</p>` }
];

<Accordion items={richItems} />
```

## Examples

Variants: `variant="default"`, `variant="bordered"`, `variant="flush"`.
Mixed content: combine `content` and `htmlContent` items.
Use in forms to break long forms into sections (set `allowMultiple` for multi-section forms).

## Styling & Theming

The component uses CSS variables for easy theming. Override these in your global stylesheet:

```css
:root {
  --accordion-border-color: #e0e0e0;
  --accordion-bg-hover: #f8f9fa;
  --accordion-focus-color: #007bff;
  --accordion-text-color: #333;
}
```

You can modify spacing, font-sizes, and transition timing in `Accordion.scss`.

## Responsive Behavior

- Mobile-friendly by default; headers are touch targets and content stacks vertically.
- Animations and spacing scale appropriately across breakpoints.

## Accessibility

The component follows accessibility best practices:

✅ Uses semantic HTML and ARIA attributes (`aria-expanded`, `aria-controls`, `aria-labelledby`)
✅ Keyboard accessible (Arrow Up/Down, Home/End, Enter/Space)
✅ Focus management and clear focus indicators
✅ Reduced-motion preference respected by CSS
✅ Sufficient color contrast (WCAG AA)

## Browser Support

✅ All modern browsers (Chrome, Firefox, Safari, Edge)
✅ Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
✅ Graceful degradation / progressive enhancement — component remains usable without JavaScript

## Technical Details

Main implementation: `Accordion.astro`, `Accordion.scss`, and optional `Accordion.js` for advanced behaviors.
Events emitted (DOM events): `accordion:initialized`, `accordion:expand`, `accordion:collapse`.

## Quick Reference

Minimal usage:

```astro
<Accordion items={items} />
```

Common use cases: FAQs, form sections, progressive disclosure content.

## Best Practices

Provide clear, concise titles for each panel.
Prefer `htmlContent` for rich content when needed.
Avoid deeply nested accordions for complexity and accessibility.

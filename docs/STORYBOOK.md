# Storybook Integration

This project includes Storybook v10 for developing and testing UI components in isolation.

## Getting Started

### Running Storybook

Start the Storybook development server:

```bash
pnpm run storybook
```

This will start Storybook on [http://localhost:6006](http://localhost:6006)

### Building Storybook

Build a static version of Storybook for deployment:

```bash
pnpm run build-storybook
```

The static build will be created in the `storybook-static` directory.

## Creating Stories for Astro Components

Since this project uses Astro components, which are compiled to HTML at build time, we need a special approach for Storybook:

### 1. Create the Story File

Create a `.stories.js` file next to your component:

```
src/components/MyComponent/
  ├── MyComponent.astro
  ├── MyComponent.scss
  ├── MyComponent.js
  └── MyComponent.stories.js  ← Create this
```

### 2. Story Structure

Here's a template for creating component stories:

```javascript
// MyComponent.stories.js
export default {
  title: "Components/MyComponent",
  argTypes: {
    propName: {
      control: "text",
      description: "Description of the prop",
    },
  },
};

// Create a template function that returns HTML
const Template = ({ propName }) => {
  return `
    <div class="my-component">
      <h2>${propName}</h2>
      <!-- Add your component's HTML structure here -->
    </div>
  `;
};

// Create story variants
export const Default = Template.bind({});
Default.args = {
  propName: "Default Value",
};

export const Variant = Template.bind({});
Variant.args = {
  propName: "Variant Value",
};
```

### 3. Including Styles

To include component styles in your stories, import the SCSS file at the top of your story:

```javascript
import "./MyComponent.scss";

export default {
  title: "Components/MyComponent",
  // ...
};
```

### 4. Adding JavaScript Behavior

If your component has JavaScript interactions, you can initialize them in the story:

```javascript
const Template = (args) => {
  const html = `
    <div class="my-component" data-js="my-component">
      <!-- Component HTML -->
    </div>
  `;

  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    // Initialize your component's JavaScript
    const element = document.querySelector('[data-js="my-component"]');
    // Add event listeners or initialize behavior
  }, 0);

  return html;
};
```

## Example

Check out the Accordion component story at:
`src/components/accordion/Accordion.stories.js`

## Installed Addons

Storybook 10 includes essential addons built into the core:

- **Controls** - Interactive controls for component props (built-in)
- **Actions** - Display data from event handlers (built-in)
- **Viewport** - Test responsive designs (built-in)
- **Backgrounds** - Change background colors (built-in)
- **@storybook/addon-links** - Link stories together

In Storybook 10, the essential addons (controls, actions, viewport, backgrounds, docs, etc.) are automatically available without needing to be explicitly listed in your configuration.

## Configuration Files

- `.storybook/main.js` - Main Storybook configuration
- `.storybook/preview.js` - Global parameters and decorators

## Tips

1. **Keep stories simple** - Focus on demonstrating component variations
2. **Use controls** - Make your stories interactive with argTypes
3. **Test edge cases** - Create stories for error states, empty states, etc.
4. **Document props** - Use the description field in argTypes
5. **Mobile testing** - Use the viewport addon to test responsive designs

## Troubleshooting

### Port already in use

If port 6006 is already in use, you can:

- Kill the existing process
- Or run Storybook on a different port: `pnpm storybook -- --port 6007`

### Styles not loading

Make sure to import your component's SCSS file at the top of the story file.

### Cache issues

If you encounter issues, try clearing the Storybook cache:

```bash
rm -rf node_modules/.cache/storybook
```

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Writing Stories](https://storybook.js.org/docs/writing-stories)
- [Component Story Format (CSF)](https://storybook.js.org/docs/api/csf)

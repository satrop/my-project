# 👨‍🔧 Core Styles (aka "hands off!")

**⚠️ WARNING: DO NOT MODIFY FILES IN THIS FOLDER ⚠️**

These files contain the **logic, mixins, calculations, and helper systems** that power the design tokens — things like dynamic CSS variable generation, responsive calculations, spacing logic, and dynamic showcase functionality.

---

## ⚠️ Please do not modify these files directly.

- If you need to change a value (like spacing, colors, grid sizes, etc.), head over to the `tokens/` folder.
- If you're trying to understand how something works under the hood — poke around here, but maybe pour a coffee first ☕️

---

## What's in this folder

- **Utility Functions**: Core functions that process data from the tokens folder
- **System Logic**: Internal logic that powers dynamic features like the color and typography showcases
- **Framework Code**: SCSS mixins and TypeScript utilities that make the design system work automatically
- **CSS Generation**: Code that transforms your tokens into usable CSS classes and custom properties

## Current core files

### SCSS Core Files

- **`colors.core.scss`** - Generates color utilities and CSS custom properties
- **`typography.core.scss`** - Generates typography utilities from tokens
- **`grid.core.scss`** - Powers the responsive grid system
- **`spacing.core.scss`** - Generates spacing utilities
- **`breakpoint.core.scss`** - Responsive breakpoint system

### TypeScript Core Files

- **`colors-data.core.ts`** - Processes color data for dynamic showcases and examples

## Why you shouldn't modify these files

- **Breaking Changes**: Modifying these files can break the entire design system
- **Dynamic Features**: The showcase pages depend on these utilities working exactly as designed
- **Updates**: These files may be updated when the framework is updated
- **Complexity**: These files contain complex logic that requires deep understanding of the system

## What you should modify instead

**Tokens are for configuration, Core is for system logic.**

Modify files in the **`tokens`** folder instead:

- **`tokens/colors/`** - Color definitions and data (both `.scss` and `.ts` files)
- **`tokens/typography/`** - Typography scales and font definitions
- **`tokens/grid/`** - Grid system configuration
- **`tokens/spacing/`** - Spacing scale definitions

---

💡 Think of `core/` as the engine room of the system. You probably don't want to start pulling wires unless you _really_ know what they do.

**Need help?** If you need to modify functionality that seems to require editing core files, consider creating a new custom file or reaching out to the team before modifying core files.

Cheers,  
Kickstart Dev Team 🚀es (aka “hands off!”)

These files contain the **logic, mixins, calculations, and helper systems** that power the design tokens — things like dynamic CSS variable generation, responsive calculations, and spacing logic.

---

## ⚠️ Please do not modify these files directly.

- If you need to change a value (like spacing, colors, grid sizes, etc.), head over to the `tokens/` folder.
- If you're trying to understand how something works under the hood — poke around here, but maybe pour a coffee first ☕️

---

💡 Think of `core/` as the engine room of the system. You probably don’t want to start pulling wires unless you _really_ know what they do.

Cheers,  
Kickstart Dev Team 🚀

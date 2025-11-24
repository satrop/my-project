# Color System Maintenance

The color system uses two files that need to be kept in sync:

1. **`src/styles/tokens/colors/_colors.scss`** - The Sass color map used for generating CSS utilities
2. **`src/styles/core/_colors-data.ts`** - The TypeScript color data used for the dynamic showcase page

## File Organization

- **`src/styles/core/_colors-data.ts`** - ✅ **SAFE TO MODIFY** - Contains color definitions
- **`src/styles/core/colors-data.core.ts`** - ❌ **DO NOT MODIFY** - Contains utility functions

## Adding New Colors

When adding new colors, you need to update **both** files:

### 1. Update the Sass file (`_colors.scss`)

```scss
$colors: (
  "red": (
    300: #ea3d3d,
    400: #e01717,
    500: #d11515,
  ),
  "blue": (
    // <- New color
    300: #60a5fa,
    // <- New shades
    500: #3b82f6,
    700: #1d4ed8,
  ),
  // ... other colors
);
```

### 2. Update the TypeScript file (`src/styles/core/_colors-data.ts`)

```typescript
export const colors = {
  red: {
    300: "#ea3d3d",
    400: "#e01717",
    500: "#d11515",
  },
  blue: {
    // <- Same color name
    300: "#60a5fa", // <- Same shades and values
    500: "#3b82f6",
    700: "#1d4ed8",
  },
  // ... other colors
} as const;
```

## Benefits of This System

- **Dynamic Showcase**: The `/colors` page automatically updates when colors are added/removed
- **Type Safety**: TypeScript ensures color names and shades are correctly typed
- **Single Source of Truth**: Both files clearly define the available colors
- **Easy Maintenance**: Color names and values are automatically displayed in the showcase
- **Clean Architecture**: Core utilities are separate from configurable data

## File Structure

```
src/styles/
├── tokens/colors/
│   └── _colors.scss          # Sass color map (SAFE TO MODIFY)
└── core/
    ├── _colors-data.ts       # TypeScript color data (SAFE TO MODIFY)
    └── colors-data.core.ts   # Utility functions (DO NOT MODIFY)
```

## Important Notes

- Color names must match exactly between both files
- Hex values must match exactly between both files
- The showcase page will automatically show all colors defined in `src/styles/core/_colors-data.ts`
- CSS utility classes are generated from the Sass file
- Background and text examples automatically use appropriate shades for contrast
- Only modify files in the `tokens` folder - files in `core` contain system utilities

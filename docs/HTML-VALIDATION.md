# HTML Validation for Astro Files

This directory contains scripts for validating HTML in Astro component files.

## validate-html.js

Validates Astro files for HTML structure issues while handling Astro-specific syntax.

### Usage

```bash
# Validate all Astro files in src/
pnpm validate:html

# Validate specific file
pnpm validate:html src/pages/index.astro

# Validate specific directory
pnpm validate:html src/components/
```

### Features

- **Astro Syntax Handling**: Transforms Astro-specific syntax (frontmatter, JSX expressions, directives, components) into valid HTML for validation
- **Accurate Line Numbers**: Preserves line numbers so errors point to the correct location in source files
- **False Positive Filtering**: Automatically filters out validation errors caused by component transformation
- **Real Issue Detection**: Catches genuine HTML problems like:
  - Missing `type` attribute on buttons
  - Invalid element nesting (e.g., `<div>` inside `<ul>`)
  - Deprecated attributes
  - Accessibility issues

### How It Works

1. **Transformation**: Converts Astro files to HTML while preserving line numbers
   - Removes frontmatter (replaces with blank lines)
   - Removes code blocks in backticks
   - Strips complex JSX expressions (`.map()`, `=>`, `&&`, `||`)
   - Handles `class:list` with nested structures
   - Replaces Astro components with `<div data-component="Name">`
   - Converts `<slot>` to HTML comments

2. **Validation**: Runs html-validate on transformed content

3. **Filtering**: Removes false positives
   - Errors inside transformed components (`data-component` divs)
   - Messages without line numbers (global issues)

4. **Reporting**: Shows only relevant errors with accurate line numbers

### Configuration

Rules are configured in the script itself. Currently enabled:

- `no-implicit-button-type`: Buttons must have explicit `type` attribute
- `element-permitted-content`: Elements must only contain valid children
- `element-required-attributes`: Required attributes must be present

Disabled rules (cause false positives with Astro syntax):

- `parser-error`, `attr-quotes`, `no-dup-id`, `attribute-allowed-values`, etc.

### Custom Checks

The script includes custom structural checks that run on the original Astro source:

- `no-div-in-button`: Detects `<div>` elements inside `<button>` (should use `<span>`)

### Exit Codes

- `0`: All files valid
- `1`: Validation errors found

### Troubleshooting

**False Positives**: If you get false positives from Astro syntax:

1. Check if the error is inside a component (these should be filtered automatically)
2. Complex JSX expressions might need additional handling in `removeComplexJSX()`
3. Add the rule to the disabled list if it's consistently problematic

**Missing Real Errors**: If validation passes but you know there's an issue:

1. Check if the element has `slot=` attribute (these are converted to comments)
2. Verify the transformation isn't removing the problematic code
3. The rule might be disabled - check the rules configuration

**Line Number Mismatches**: Should be rare, but if you see them:

1. Check for multiline template literals or JSX expressions
2. The transformation preserves line count, but complex nested structures might shift slightly

### Adding New Rules

To enable a new html-validate rule:

1. Add it to the `rules` object in the htmlvalidate configuration
2. Test against multiple Astro files to check for false positives
3. If false positives occur, add filtering logic in the `filter` function

### Development

To debug transformation:

```javascript
// Add to validate-html.js in the file loop
if (file.includes("your-file.astro")) {
  console.log(transformed);
}
```

To see what errors are being filtered:

```javascript
// In the filter function
console.log(`Filtering: ${msg.message} at line ${msg.line}`);
```

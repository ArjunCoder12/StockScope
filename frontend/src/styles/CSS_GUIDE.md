# CSS Organization

This directory contains all CSS stylesheets for the StockScope frontend application.

## Structure

### Base Styles

- `global.css` - Global CSS variables, design tokens, and base styles
- `index.css` - Entry point CSS file that imports global styles

### Shared Styles

- `shared/` - Directory for shared/reusable styles
  - `panel.css` - Shared panel component styles

### Component Styles

Component-specific stylesheets follow a naming convention: `[ComponentName].css`

Examples:

- `Grid.css` - Grid component styles
- `GridItem.css` - GridItem component styles
- `NavBar.css` - Navigation bar styles
- `ChartPanel.css` - Chart panel component styles
- `NewsPanel.css` - News panel component styles
- etc.

### Utility/Structure Styles

- `ResponsiveContainer.css` - Responsive container structure styles
- `LoadingSpinner.css` - Loading spinner component styles
- `ErrorBoundary.css` - Error boundary component styles
- `ErrorDisplay.css` - Error display component styles
- `WarningCard.css` - Warning card component styles

## Best Practices

1. **Use CSS Variables** - All design tokens are defined in `global.css`. Use these variables instead of hardcoded values.

2. **Component Scoping** - Each component should have its own CSS file to maintain separation of concerns.

3. **Shared Styles** - Common patterns (like panels) go in `shared/` directory.

4. **No Global Selectors** - Avoid global element selectors unless absolutely necessary. Use class names instead.

5. **Naming Convention** - Use BEM-like naming or component-prefixed class names for clarity.

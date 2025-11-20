# Grid Component Usage Guide

## Quick Start Checklist

When adding a grid to a new page, consider:

1. **Layout Design** - How many items? How should they be arranged?
2. **Responsive Behavior** - How should it look on mobile vs desktop?
3. **Grid Areas** - Named areas make positioning easier
4. **Spacing** - Gap and margin customization
5. **Item Styling** - Panel variant vs default

---

## Grid Configuration Options

### Basic Grid Setup

```tsx
import Grid from "../structures/Grid";
import GridItem from "../structures/GridItem";

<Grid>
  <GridItem>Content 1</GridItem>
  <GridItem>Content 2</GridItem>
</Grid>;
```

### Grid Props

| Prop            | Type       | Default                                  | Description                                                  |
| --------------- | ---------- | ---------------------------------------- | ------------------------------------------------------------ |
| `columns`       | `string`   | `"1fr 1fr"`                              | Grid column template (CSS grid syntax)                       |
| `rows`          | `string`   | `"auto auto"`                            | Grid row template                                            |
| `areas`         | `string[]` | `undefined`                              | Named grid areas (e.g., `["header header", "sidebar main"]`) |
| `gap`           | `string`   | `"var(--spacing-2xl)"`                   | Gap between grid items                                       |
| `margin`        | `string`   | `"var(--spacing-5xl) var(--spacing-xl)"` | Grid container margin                                        |
| `mobileColumns` | `string`   | `"1fr"`                                  | Columns on mobile (< 768px)                                  |
| `mobileAreas`   | `string[]` | `undefined`                              | Area layout on mobile                                        |
| `className`     | `string`   | `""`                                     | Additional CSS classes                                       |

---

## GridItem Configuration Options

### GridItem Props

| Prop        | Type                   | Default     | Description                                           |
| ----------- | ---------------------- | ----------- | ----------------------------------------------------- |
| `area`      | `string`               | `undefined` | Named grid area (must match `areas` in Grid)          |
| `column`    | `string`               | `undefined` | CSS grid-column value (e.g., `"1 / 3"` or `"span 2"`) |
| `row`       | `string`               | `undefined` | CSS grid-row value                                    |
| `variant`   | `"panel" \| "default"` | `"panel"`   | Panel styling (border, padding, hover effects)        |
| `className` | `string`               | `""`        | Additional CSS classes                                |
| `style`     | `React.CSSProperties`  | `undefined` | Inline styles                                         |

---

## Common Layout Patterns

### 1. Two Column Layout (Side by Side)

```tsx
<Grid columns="1fr 1fr" areas={["left right"]} mobileAreas={["left", "right"]}>
  <GridItem area="left">Left content</GridItem>
  <GridItem area="right">Right content</GridItem>
</Grid>
```

### 2. Three Column Layout

```tsx
<Grid
  columns="1fr 1fr 1fr"
  areas={["col1 col2 col3"]}
  mobileAreas={["col1", "col2", "col3"]}
>
  <GridItem area="col1">Column 1</GridItem>
  <GridItem area="col2">Column 2</GridItem>
  <GridItem area="col3">Column 3</GridItem>
</Grid>
```

### 3. Header + Two Columns (Dashboard-like)

```tsx
<Grid
  columns="1fr 1fr"
  areas={["header header", "sidebar main"]}
  mobileAreas={["header", "sidebar", "main"]}
>
  <GridItem area="header">Header spans full width</GridItem>
  <GridItem area="sidebar">Sidebar</GridItem>
  <GridItem area="main">Main content</GridItem>
</Grid>
```

### 4. Asymmetric Layout (e.g., 2:1 ratio)

```tsx
<Grid
  columns="2fr 1fr"
  areas={["main sidebar"]}
  mobileAreas={["main", "sidebar"]}
>
  <GridItem area="main">Main (takes 2/3 width)</GridItem>
  <GridItem area="sidebar">Sidebar (takes 1/3 width)</GridItem>
</Grid>
```

### 5. Card Grid (Multiple Cards)

```tsx
<Grid columns="repeat(3, 1fr)" mobileColumns="1fr" gap="var(--spacing-lg)">
  <GridItem>Card 1</GridItem>
  <GridItem>Card 2</GridItem>
  <GridItem>Card 3</GridItem>
  <GridItem>Card 4</GridItem>
</Grid>
```

---

## Step-by-Step: Adding a Grid to a New Page

### Step 1: Plan Your Layout

Ask yourself:

- How many items do I need to display?
- Should they be equal width or different sizes?
- Do any items span multiple columns/rows?
- How should it rearrange on mobile?

### Step 2: Define Grid Areas

Use descriptive names that match your content:

```tsx
//  Good: Descriptive names
areas={["header header", "chart news", "footer footer"]}

// Bad: Unclear names
areas={["a a", "b c", "d d"]}
```

### Step 3: Set Up Desktop Layout

```tsx
<Grid
  columns="1fr 1fr"           // 2 equal columns
  rows="auto auto auto"        // 3 rows, auto height
  areas={["header header", "chart news", "footer footer"]}
  gap="var(--spacing-xl)"
>
```

### Step 4: Plan Mobile Layout

Think about stacking order on mobile:

```tsx
mobileAreas={["header", "chart", "news", "footer"]}
// Stacks vertically in this order
```

### Step 5: Position GridItems

Match the `area` prop to your grid areas:

```tsx
<GridItem area="header">Header</GridItem>
<GridItem area="chart">Chart</GridItem>
<GridItem area="news">News</GridItem>
<GridItem area="footer">Footer</GridItem>
```

### Step 6: Choose Styling Variant

- `variant="panel"` (default): Adds panel styling (border, padding, hover effect)
- `variant="default"`: No special styling (use when component handles its own styling)

```tsx
// Component already has panel styling
<GridItem area="news" variant="default">
  <NewsPanel />  {/* NewsPanel already wraps itself in dashboard-panel */}
</GridItem>

// Component needs panel styling
<GridItem area="chart">  {/* variant="panel" is default */}
  <ChartPanel />
</GridItem>
```

---

## Responsive Design Considerations

### Breakpoint

The Grid component uses `768px` as the mobile breakpoint (defined in `Grid.css`).

### Mobile Strategy Options

1. **Stack Everything** (Most Common)

   ```tsx
   mobileAreas={["item1", "item2", "item3"]}
   ```

2. **Keep Some Items Side-by-Side**

   ```tsx
   columns="1fr 1fr 1fr"
   mobileColumns="1fr 1fr"  // 2 columns on mobile
   mobileAreas={["item1 item2", "item3 item3"]}
   ```

3. **Reorder Items**
   ```tsx
   areas={["header header", "sidebar main"]}
   mobileAreas={["header", "main", "sidebar"]}  // Reordered on mobile
   ```

---

## Advanced Patterns

### Using Column/Row Instead of Areas

When you don't need named areas:

```tsx
<Grid columns="repeat(3, 1fr)">
  <GridItem column="1 / 3">Spans first 2 columns</GridItem>
  <GridItem column="3">Third column</GridItem>
</Grid>
```

### Custom Spacing

```tsx
<Grid
  gap="2rem"
  margin="1rem"
>
```

### Custom Classes for Special Styling

```tsx
<GridItem area="watchlist" className="grid-item--watchlist">
  {/* Custom styling via className */}
</GridItem>
```

### Mixing Areas and Column/Row Positioning

```tsx
<Grid areas={["header header"]}>
  <GridItem area="header">Header</GridItem>
  <GridItem column="1 / 2" row="2">
    Uses column/row instead of area
  </GridItem>
</Grid>
```

---

## Real-World Examples from Your Codebase

### Dashboard.tsx Pattern

```tsx
<Grid
  areas={["stockstatus news", "watchlist watchlist"]}
  mobileAreas={["stockstatus", "watchlist", "news"]}
>
  {/* 2x2 grid with watchlist spanning full width on row 2 */}
</Grid>
```

### TickerPage.tsx Pattern

```tsx
<Grid columns="1fr 1fr" areas={["chart news"]} mobileAreas={["chart", "news"]}>
  {/* Simple side-by-side with vertical stack on mobile */}
</Grid>
```

---

## Troubleshooting

### Items Not Positioning Correctly

- Ensure `area` names match exactly (case-sensitive)
- Check that `areas` array defines the layout correctly
- Verify each row in `areas` has the same number of area names

### Mobile Layout Not Working

- Make sure you provide `mobileAreas` or `mobileColumns`
- Check that mobile breakpoint is 768px or below

### Panel Styling Applied Twice

- Use `variant="default"` if your component already has panel styling
- Check if component wraps itself in `dashboard-panel` class

### Items Overlapping

- Ensure grid areas don't conflict
- Check `columns` and `rows` match your `areas` definition

---

## Best Practices

1. **Use Named Areas** - Easier to maintain and understand than column/row numbers
2. **Always Plan Mobile** - Think about mobile layout from the start
3. **Descriptive Area Names** - Use names that describe content (e.g., `"chart"`, `"news"`, not `"a"`, `"b"`)
4. **Consistent Spacing** - Use CSS variables for spacing (`var(--spacing-xl)`)
5. **Test Responsive** - Always test at mobile breakpoint (768px)
6. **Reuse Patterns** - Look at existing grids for reference

---

## Need Custom Behavior?

If you need features not covered by Grid/GridItem:

1. Add a `className` prop for custom CSS
2. Use inline `style` prop on GridItem for one-off adjustments
3. Extend GridItem.css with new variant classes if needed for your page

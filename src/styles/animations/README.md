# Animation System

This folder contains a modular animation system based on Animate.css, allowing you to include only the animations you need in your build.

## Structure

- `index.scss` - Main entry point that imports all animation modules
- `animation--base.scss` - Base animation classes and utilities (always required)
- `animation--[name].scss` - Individual animation files

## Usage

### Adding New Animations

1. Edit `animations/index.scss`
2. Uncomment the animation you want to include:

```scss
// Before (commented out, not included)
// @use "./animation--slideInUp";

// After (uncommented, will be included)
@use "./animation--slideInUp";
```

### Currently Active Animations

The following animations are currently included in the build:

- `fadeIn` - Simple fade in
- `fadeInUp` - Fade in from bottom
- `fadeInDown` - Fade in from top
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right

### Available Animations (commented out)

- **Slide animations**: `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`
- **Zoom animations**: `zoomIn`, `zoomInUp`
- **Bounce animations**: `bounce`, `bounceIn`
- **Other animations**: `flip`, `pulse`

### Adding Custom Animations

1. Create a new file: `animation--yourAnimation.scss`
2. Follow the naming convention:

```scss
// ==========================================================================
// Your Animation Name
// ==========================================================================

@keyframes yourAnimation {
  from {
    // initial state
  }
  to {
    // final state
  }
}

.ast-animate__yourAnimation {
  animation-name: yourAnimation;
}
```

3. Add the import to `index.scss`:

```scss
@use "./animation--yourAnimation";
```

## HTML Usage

Add animations to elements using data attributes:

```html
<!-- Basic animation -->
<div data-animate="fadeInUp">This will fade in from below</div>

<!-- With delay -->
<div data-animate="fadeInUp" data-animate-delay="1s">Delayed animation</div>

<!-- With duration -->
<div data-animate="fadeInUp" data-animate-duration="slow">Slow animation</div>

<!-- Combined -->
<div data-animate="fadeInUp" data-animate-delay="2s" data-animate-duration="fast">Fast animation with delay</div>
```

## Available Options

### Delays

- `data-animate-delay="1s"`
- `data-animate-delay="1-5s"` (1.5s)
- `data-animate-delay="2s"`
- `data-animate-delay="2-5s"` (2.5s)
- `data-animate-delay="3s"`
- `data-animate-delay="3-5s"` (3.5s)
- `data-animate-delay="4s"`
- `data-animate-delay="4-5s"` (4.5s)
- `data-animate-delay="5s"`

### Durations

- `data-animate-duration="faster"` (0.5s)
- `data-animate-duration="fast"` (0.8s)
- Default (1s)
- `data-animate-duration="slow"` (2s)
- `data-animate-duration="slower"` (3s)

### Repeats

- `data-animate-repeat="1"` through `data-animate-repeat="3"`
- `data-animate-repeat="infinite"`

## Bundle Size Optimization

This modular approach allows you to:

1. **Include only what you need** - Uncomment only the animations you use
2. **Easy maintenance** - Each animation is in its own file
3. **Tree shaking** - Unused animations won't be included in the final CSS
4. **Clear organization** - Easy to see what's included vs available

## Accessibility

The system includes:

- `prefers-reduced-motion` support to disable animations for users who prefer reduced motion
- Semantic animation timing and easing
- Proper animation fill modes and visibility handling

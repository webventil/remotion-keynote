# remotion-keynote

A Remotion-based keynote presentation player with slide navigation, thumbnails, and keyboard controls.

## Features

- **Slide-by-slide navigation** — auto-pauses at slide boundaries, advance with click/keyboard
- **Fade transitions** between slides (configurable duration)
- **Thumbnail strip** with active slide indicator
- **Progress bar** and slide counter overlay
- **Keyboard controls** — Space/Right Arrow (next), Left Arrow (back), Escape (reset), F (fullscreen)
- **Themeable** — customize colors and fonts via a theme prop
- **No build step** — ships as TypeScript source, your bundler compiles it

## Installation

```bash
npm install github:webventil/remotion-keynote
```

### Peer dependencies

Your project needs these installed (any Remotion project already has them):

```bash
npm install remotion @remotion/player @remotion/transitions react react-dom
```

## Usage

### Define your slides

Each slide is a React component with a duration in frames:

```tsx
import type { SlideConfig } from "remotion-keynote";

const slides: SlideConfig[] = [
  { id: "intro", component: IntroSlide, durationInFrames: 150 },
  { id: "main", component: MainSlide, durationInFrames: 200 },
  { id: "outro", component: OutroSlide, durationInFrames: 120 },
];
```

### Interactive player (browser)

```tsx
import { PresentationPlayer } from "remotion-keynote";

export const App = () => (
  <PresentationPlayer slides={slides} />
);
```

### Remotion composition (for rendering)

```tsx
import { Composition } from "remotion";
import { Presentation, calculateTotalDuration } from "remotion-keynote";

const duration = calculateTotalDuration(slides);

export const Root = () => (
  <Composition
    id="MyPresentation"
    component={Presentation}
    defaultProps={{ slides }}
    durationInFrames={duration}
    fps={30}
    width={1280}
    height={720}
  />
);
```

## Theming

Pass a partial `theme` prop to override the defaults:

```tsx
<PresentationPlayer
  slides={slides}
  theme={{
    accentColor: "#e11d48",
    secondaryColor: "#1e40af",
    fontFamily: "Inter, sans-serif",
  }}
/>
```

All theme properties:

| Property | Description | Default |
|----------|-------------|---------|
| `accentColor` | Progress bar fill, active thumbnail border | `#14b8a6` |
| `accentGlow` | Active thumbnail glow | `rgba(13, 148, 136, 0.3)` |
| `secondaryColor` | Thumbnail number color | `#325797` |
| `textColor` | Slide counter color | `rgba(150, 179, 219, 0.7)` |
| `trackColor` | Progress bar track | `rgba(192, 209, 234, 0.3)` |
| `fontFamily` | Overlay and counter font | `Vollkorn, Georgia, serif` |

## API

### Components

- **`<PresentationPlayer>`** — Full interactive player with thumbnails and keyboard controls
- **`<Presentation>`** — Pure slide sequence (for Remotion rendering)
- **`<SlideOverlay>`** — Progress bar and slide counter
- **`<SlideThumbnails>`** — Clickable thumbnail strip

### Hooks

- **`useSlideNavigation(options)`** — Slide navigation state and controls
- **`useKeynoteTheme()`** — Access current theme values from within custom components

### Utilities

- **`calculateTotalDuration(slides, transitionDuration?)`** — Compute total frames accounting for transitions
- **`computeSlideBoundaries(slides, transitionDuration)`** — Get pause/content frame indices

### Props: `PresentationPlayer`

| Prop | Type | Default |
|------|------|---------|
| `slides` | `SlideConfig[]` | required |
| `transitionDuration` | `number` | `15` |
| `width` | `number` | `1280` |
| `height` | `number` | `720` |
| `fps` | `number` | `30` |
| `theme` | `Partial<KeynoteTheme>` | default theme |

## Bundler configuration

Since this package ships TypeScript source, symlinked installs (e.g. `file:` dependencies) need bundler configuration to resolve modules correctly:

**Remotion** (`remotion.config.ts`):
```ts
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: { ...config.resolve, symlinks: false },
}));
```

**Vite** (`vite.config.ts`):
```ts
export default defineConfig({
  resolve: { preserveSymlinks: true },
});
```

**TypeScript** (`tsconfig.json`):
```json
{ "compilerOptions": { "preserveSymlinks": true } }
```

This is only needed for local/git installs. npm registry installs copy files instead of symlinking, so no extra config is required.

## License

MIT

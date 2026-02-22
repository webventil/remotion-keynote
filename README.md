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

### Remotion composition (for rendering to video)

Remotion's `Composition` serializes `defaultProps` with `JSON.stringify`, which silently drops `component` (a function). Use `registerSlides` to store component references in a side-channel registry, then pass only the serializable fields as `defaultProps`.

**1. Register slides and define the composition** (`src/Root.tsx`):

```tsx
import { Composition } from "remotion";
import {
  Presentation,
  calculateTotalDuration,
  registerSlides,
} from "remotion-keynote";
import type { SerializableSlideConfig } from "remotion-keynote";

// Full slide definitions — used only for registration
const slides = [
  { id: "intro", component: IntroSlide, durationInFrames: 150 },
  { id: "main", component: MainSlide, durationInFrames: 200 },
  { id: "outro", component: OutroSlide, durationInFrames: 120 },
];

// Populate the registry (must run before Presentation renders)
registerSlides(slides);

// Serializable subset — safe for defaultProps
const serializableSlides: SerializableSlideConfig[] = slides.map(
  ({ id, durationInFrames }) => ({ id, durationInFrames }),
);

export const Root = () => (
  <Composition
    id="MyPresentation"
    component={Presentation}
    defaultProps={{ slides: serializableSlides }}
    durationInFrames={calculateTotalDuration(serializableSlides)}
    fps={30}
    width={1280}
    height={720}
  />
);
```

**2. Register the root** (`src/index.ts`):

```tsx
import { registerRoot } from "remotion";
import { Root } from "./Root";

registerRoot(Root);
```

**3. Render from the CLI:**

```bash
npx remotion render src/index.ts MyPresentation out/presentation.mp4
```

> **Note:** `PresentationPlayer` calls `registerSlides` automatically, so the interactive browser path needs no changes.

### Adding a presentation target (Vite)

You can add a lightweight Vite entry point alongside your Remotion project to launch the interactive player in the browser. `PresentationApp` provides a full-page dark layout with keyboard hints out of the box.

**1. Create a `present/` directory** with two files:

`present/index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Presentation</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

`present/main.tsx`:
```tsx
import { createRoot } from "react-dom/client";
import { PresentationApp } from "remotion-keynote";
import type { SlideConfig } from "remotion-keynote";
import { IntroSlide } from "../src/scenes/IntroSlide";
import { MainSlide } from "../src/scenes/MainSlide";
import { OutroSlide } from "../src/scenes/OutroSlide";

const slides: SlideConfig[] = [
  { id: "intro", component: IntroSlide, durationInFrames: 150 },
  { id: "main", component: MainSlide, durationInFrames: 200 },
  { id: "outro", component: OutroSlide, durationInFrames: 120 },
];

createRoot(document.getElementById("root")!).render(
  <PresentationApp slides={slides} />,
);
```

**2. Add a script to `package.json`:**

```json
{
  "scripts": {
    "present": "vite present"
  }
}
```

**3. Launch:**

```bash
npm run present
```

This opens the interactive player at `http://localhost:5173` with keyboard controls, thumbnails, and fade transitions — completely independent of Remotion Studio.

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

- **`<PresentationApp>`** — Full-page presentation with dark background, player, and keyboard hints
- **`<PresentationPlayer>`** — Interactive player with thumbnails and keyboard controls (embed anywhere)
- **`<Presentation>`** — Pure slide sequence (for Remotion rendering)
- **`<SlideOverlay>`** — Progress bar and slide counter
- **`<SlideThumbnails>`** — Clickable thumbnail strip

### Hooks

- **`useSlideNavigation(options)`** — Slide navigation state and controls
- **`useKeynoteTheme()`** — Access current theme values from within custom components

### Utilities

- **`calculateTotalDuration(slides, transitionDuration?)`** — Compute total frames accounting for transitions
- **`computeSlideBoundaries(slides, transitionDuration)`** — Get pause/content frame indices
- **`registerSlides(slides)`** — Store component references in a module-level registry for serialization-safe rendering

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

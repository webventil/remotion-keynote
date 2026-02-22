# Customize PresentationPlayer

Help the user customize their `remotion-keynote` PresentationPlayer based on their description: $ARGUMENTS

## Context

The user is working with the `remotion-keynote` library. The main component is `PresentationPlayer` which accepts these props:

```typescript
interface PresentationPlayerProps {
  slides: SlideConfig[];
  transitionDuration?: number; // Default: 15 frames
  width?: number;              // Default: 1280
  height?: number;             // Default: 720
  fps?: number;                // Default: 30
  theme?: Partial<KeynoteTheme>;
}
```

The theme system uses these properties (all optional overrides):

```typescript
interface KeynoteTheme {
  accentColor: string;     // Progress bar fill, active thumbnail border. Default: "#14b8a6"
  accentGlow: string;      // Active thumbnail glow. Default: "rgba(13, 148, 136, 0.3)"
  secondaryColor: string;  // Thumbnail number color. Default: "#325797"
  textColor: string;       // Slide counter color. Default: "rgba(150, 179, 219, 0.7)"
  trackColor: string;      // Progress bar track background. Default: "rgba(192, 209, 234, 0.3)"
  fontFamily: string;      // Overlay and counter font. Default: "Vollkorn, Georgia, serif"
}
```

Custom slides can read the theme via the `useKeynoteTheme()` hook.

## Instructions

1. **Read the user's existing player code** to understand their current setup. Look for files importing from `remotion-keynote`.

2. **Based on the user's request**, modify the appropriate properties. Common customizations:

   - **Theme / colors**: Update the `theme` prop. When the user describes a mood (e.g. "dark", "corporate", "warm"), generate a cohesive color palette where `accentGlow` is a transparent version of `accentColor`, and `trackColor` complements the overall scheme.
   - **Dimensions**: Update `width`/`height`. Common presets: 1920x1080 (Full HD), 1280x720 (HD), 960x540 (small). Always maintain 16:9 unless the user asks otherwise.
   - **Transitions**: Update `transitionDuration` in frames. At 30fps: 15 frames = 0.5s (default), 30 frames = 1s (slow/dramatic), 8 frames = ~0.27s (snappy).
   - **Frame rate**: Update `fps`. 30 is standard, 60 for smoother animations.

3. **Show the user the changes** and explain what each property controls, so they learn the customization surface.

4. **If the user describes a visual style** without being specific (e.g. "make it look professional"), interpret this as a theme request and generate appropriate colors. Ask the user to confirm before applying.

5. **If a user's custom slide components need to use theme colors**, show them how to import and use `useKeynoteTheme()`:
   ```tsx
   import { useKeynoteTheme } from "remotion-keynote";
   const theme = useKeynoteTheme();
   // theme.accentColor, theme.fontFamily, etc.
   ```

6. **Keep the scope focused** on PresentationPlayer props and theme. If the user asks about slide content or layout, that's outside the scope of this command — help them directly instead.

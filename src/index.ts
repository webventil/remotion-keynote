export { Presentation, calculateTotalDuration } from "./Presentation";
export { PresentationPlayer } from "./PresentationPlayer";
export { PresentationApp } from "./PresentationApp";
export { SlideOverlay } from "./SlideOverlay";
export { SlideThumbnails } from "./SlideThumbnails";
export {
	useSlideNavigation,
	computeSlideBoundaries,
} from "./useSlideNavigation";
export {
	defaultKeynoteTheme,
	KeynoteThemeContext,
	useKeynoteTheme,
} from "./theme";
export type { KeynoteTheme } from "./theme";
export { registerSlides } from "./slidesRegistry";
export type {
	SlideConfig,
	SerializableSlideConfig,
	AnySlideConfig,
	PresentationProps,
} from "./types";

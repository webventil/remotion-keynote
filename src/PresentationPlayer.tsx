import React, { useCallback, useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import {
	Presentation,
	calculateTotalDuration,
	DEFAULT_TRANSITION_DURATION,
} from "./Presentation";
import { useSlideNavigation } from "./useSlideNavigation";
import { SlideOverlay } from "./SlideOverlay";
import { SlideThumbnails } from "./SlideThumbnails";
import { KeynoteThemeContext, defaultKeynoteTheme } from "./theme";
import type { KeynoteTheme } from "./theme";
import type { SlideConfig } from "./types";
import { registerSlides } from "./slidesRegistry";

interface PresentationPlayerProps {
	slides: SlideConfig[];
	transitionDuration?: number;
	width?: number;
	height?: number;
	fps?: number;
	theme?: Partial<KeynoteTheme>;
}

export const PresentationPlayer: React.FC<PresentationPlayerProps> = ({
	slides,
	transitionDuration = DEFAULT_TRANSITION_DURATION,
	width = 1280,
	height = 720,
	fps = 30,
	theme: themeOverrides,
}) => {
	registerSlides(slides);

	const playerRef = useRef<PlayerRef>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const resolvedTheme = themeOverrides
		? { ...defaultKeynoteTheme, ...themeOverrides }
		: defaultKeynoteTheme;

	const totalDuration = calculateTotalDuration(slides, transitionDuration);

	const { currentSlide, totalSlides, next, prev, goTo, reset } =
		useSlideNavigation({
			slides,
			transitionDuration,
			playerRef,
		});

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case " ":
				case "ArrowRight":
					e.preventDefault();
					next();
					break;
				case "ArrowLeft":
					e.preventDefault();
					prev();
					break;
				case "Escape":
					e.preventDefault();
					reset();
					break;
				case "f":
				case "F":
					e.preventDefault();
					containerRef.current?.requestFullscreen?.();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [next, prev, reset]);

	// Click to advance (or skip if animating)
	const handleClick = useCallback(() => {
		next();
	}, [next]);

	return (
		<KeynoteThemeContext.Provider value={resolvedTheme}>
			<div style={{ display: "flex", flexDirection: "column", width }}>
				<div
					ref={containerRef}
					onClick={handleClick}
					style={{
						position: "relative",
						width: "100%",
						cursor: "pointer",
						borderRadius: 8,
						overflow: "hidden",
						boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
					}}
				>
					<Player
						ref={playerRef}
						component={Presentation}
						inputProps={{ slides, transitionDuration }}
						durationInFrames={totalDuration}
						compositionWidth={width}
						compositionHeight={height}
						fps={fps}
						style={{ width: "100%", aspectRatio: `${width}/${height}` }}
						autoPlay={false}
						controls={false}
						clickToPlay={false}
					/>
					<SlideOverlay currentSlide={currentSlide} totalSlides={totalSlides} />
				</div>
				<SlideThumbnails
					slides={slides}
					currentSlide={currentSlide}
					goTo={goTo}
					transitionDuration={transitionDuration}
					compositionWidth={width}
					compositionHeight={height}
					fps={fps}
				/>
			</div>
		</KeynoteThemeContext.Provider>
	);
};

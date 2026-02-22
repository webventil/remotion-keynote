import React, { useMemo } from "react";
import { Thumbnail } from "@remotion/player";
import { Presentation } from "./Presentation";
import { computeSlideBoundaries } from "./useSlideNavigation";
import { useKeynoteTheme } from "./theme";
import type { SlideConfig } from "./types";

interface SlideThumbnailsProps {
	slides: SlideConfig[];
	currentSlide: number;
	goTo: (index: number) => void;
	transitionDuration: number;
	compositionWidth: number;
	compositionHeight: number;
	fps: number;
}

const THUMB_WIDTH = 160;
const THUMB_HEIGHT = 90;

export const SlideThumbnails: React.FC<SlideThumbnailsProps> = ({
	slides,
	currentSlide,
	goTo,
	transitionDuration,
	compositionWidth,
	compositionHeight,
	fps,
}) => {
	const theme = useKeynoteTheme();

	const totalDuration = useMemo(() => {
		const sum = slides.reduce((acc, s) => acc + s.durationInFrames, 0);
		return sum - (slides.length - 1) * transitionDuration;
	}, [slides, transitionDuration]);

	const { pauseFrames } = useMemo(
		() => computeSlideBoundaries(slides, transitionDuration),
		[slides, transitionDuration],
	);

	return (
		<div
			style={{
				display: "flex",
				gap: 8,
				padding: "12px 0",
				overflowX: "auto",
				justifyContent: slides.length * (THUMB_WIDTH + 8) <= compositionWidth ? "center" : "flex-start",
			}}
		>
			{slides.map((slide, i) => {
				const isActive = i === currentSlide;
				return (
					<button
						key={slide.id}
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							goTo(i);
						}}
						style={{
							position: "relative",
							flexShrink: 0,
							width: THUMB_WIDTH,
							cursor: "pointer",
							background: "none",
							padding: 0,
							border: "none",
							outline: "none",
						}}
					>
						<div
							style={{
								borderRadius: 6,
								overflow: "hidden",
								border: isActive
									? `2px solid ${theme.accentColor}`
									: "2px solid transparent",
								boxShadow: isActive
									? `0 0 0 2px ${theme.accentGlow}`
									: "0 1px 3px rgba(0, 0, 0, 0.15)",
								transition: "border-color 0.2s, box-shadow 0.2s",
							}}
						>
							<Thumbnail
								component={Presentation}
								inputProps={{ slides, transitionDuration }}
								durationInFrames={totalDuration}
								compositionWidth={compositionWidth}
								compositionHeight={compositionHeight}
								fps={fps}
								frameToDisplay={i === 0 ? 0 : pauseFrames[i]}
								style={{
									width: THUMB_WIDTH,
									height: THUMB_HEIGHT,
									display: "block",
								}}
							/>
						</div>
						<span
							style={{
								display: "block",
								marginTop: 4,
								fontFamily: theme.fontFamily,
								fontSize: 11,
								fontWeight: 600,
								color: isActive ? theme.accentColor : theme.secondaryColor,
								textAlign: "center",
								letterSpacing: "0.05em",
								transition: "color 0.2s",
							}}
						>
							{i + 1}
						</span>
					</button>
				);
			})}
		</div>
	);
};

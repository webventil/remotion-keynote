import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import type { PresentationProps, SlideConfig } from "./types";

export const DEFAULT_TRANSITION_DURATION = 15;

export const Presentation: React.FC<PresentationProps> = ({
	slides = [],
	transitionDuration = DEFAULT_TRANSITION_DURATION,
}) => {
	return (
		<AbsoluteFill>
			<TransitionSeries>
				{slides.flatMap((slide, i) => {
					const elements: React.ReactNode[] = [
						<TransitionSeries.Sequence
							key={slide.id}
							durationInFrames={slide.durationInFrames}
						>
							<slide.component />
						</TransitionSeries.Sequence>,
					];
					if (i < slides.length - 1) {
						elements.push(
							<TransitionSeries.Transition
								key={`t-${slide.id}`}
								presentation={fade()}
								timing={linearTiming({
									durationInFrames: transitionDuration,
								})}
							/>,
						);
					}
					return elements;
				})}
			</TransitionSeries>
		</AbsoluteFill>
	);
};

export function calculateTotalDuration(
	slides: SlideConfig[],
	transitionDuration: number = DEFAULT_TRANSITION_DURATION,
): number {
	const sum = slides.reduce((acc, s) => acc + s.durationInFrames, 0);
	return sum - (slides.length - 1) * transitionDuration;
}

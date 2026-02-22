import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import type { AnySlideConfig, PresentationProps } from "./types";
import { resolveSlideComponent } from "./slidesRegistry";

export const DEFAULT_TRANSITION_DURATION = 15;

function getSlideComponent(slide: AnySlideConfig): React.FC {
	if ("component" in slide && slide.component) {
		return slide.component;
	}
	return resolveSlideComponent(slide.id);
}

export const Presentation: React.FC<PresentationProps> = ({
	slides = [],
	transitionDuration = DEFAULT_TRANSITION_DURATION,
}) => {
	return (
		<AbsoluteFill>
			<TransitionSeries>
				{slides.flatMap((slide, i) => {
					const SlideComponent = getSlideComponent(slide);
					const elements: React.ReactNode[] = [
						<TransitionSeries.Sequence
							key={slide.id}
							durationInFrames={slide.durationInFrames}
						>
							<SlideComponent />
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
	slides: AnySlideConfig[],
	transitionDuration: number = DEFAULT_TRANSITION_DURATION,
): number {
	const sum = slides.reduce((acc, s) => acc + s.durationInFrames, 0);
	return sum - (slides.length - 1) * transitionDuration;
}

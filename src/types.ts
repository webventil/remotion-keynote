import type React from "react";

export interface SlideConfig {
	id: string;
	component: React.FC;
	durationInFrames: number;
}

export interface SerializableSlideConfig {
	id: string;
	durationInFrames: number;
}

export type AnySlideConfig = SlideConfig | SerializableSlideConfig;

export interface PresentationProps {
	slides?: AnySlideConfig[];
	transitionDuration?: number;
}

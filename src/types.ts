import type React from "react";

export interface SlideConfig {
	id: string;
	component: React.FC;
	durationInFrames: number;
}

export interface PresentationProps {
	slides?: SlideConfig[];
	transitionDuration?: number;
}

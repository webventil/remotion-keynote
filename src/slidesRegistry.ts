import type React from "react";
import type { SlideConfig } from "./types";

const registry = new Map<string, React.FC>();

export function registerSlides(slides: SlideConfig[]): void {
	for (const slide of slides) {
		registry.set(slide.id, slide.component);
	}
}

export function resolveSlideComponent(id: string): React.FC {
	const component = registry.get(id);
	if (!component) {
		throw new Error(
			`Slide "${id}" not found in registry. ` +
				`Call registerSlides(slides) before rendering the Composition.`,
		);
	}
	return component;
}

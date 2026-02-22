import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PlayerRef } from "@remotion/player";
import type { SlideConfig } from "./types";

interface UseSlideNavigationOptions {
	slides: SlideConfig[];
	transitionDuration: number;
	playerRef: React.RefObject<PlayerRef | null>;
}

/**
 * Calculates pause frames and content frames for keynote navigation.
 *
 * Timeline for slides [S0, S1, S2] with transition T:
 *   S0 starts at 0, S1 starts at D0-T, S2 starts at D0+D1-2T
 *   Pause frame = last content frame before exit transition
 *   Content frame = first frame where slide is fully opaque (after entry fade)
 */
export function computeSlideBoundaries(
	slides: SlideConfig[],
	transitionDuration: number,
) {
	const slideStarts: number[] = [];
	let offset = 0;
	for (let i = 0; i < slides.length; i++) {
		slideStarts.push(offset);
		if (i < slides.length - 1) {
			offset += slides[i].durationInFrames - transitionDuration;
		}
	}

	// Pause at last content frame before exit transition begins
	const pauseFrames = slides.map((slide, i) => {
		if (i < slides.length - 1) {
			return slideStarts[i] + slide.durationInFrames - transitionDuration - 1;
		}
		// Last slide: pause at the very end
		return slideStarts[i] + slide.durationInFrames - 1;
	});

	// Where each slide is fully opaque (after entry transition)
	const contentFrames = slideStarts.map((start, i) =>
		i > 0 ? start + transitionDuration : start,
	);

	return { pauseFrames, contentFrames };
}

export function useSlideNavigation({
	slides,
	transitionDuration,
	playerRef,
}: UseSlideNavigationOptions) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isWaiting, setIsWaiting] = useState(true);
	const lastFrameRef = useRef(-1);

	const { pauseFrames, contentFrames } = useMemo(
		() => computeSlideBoundaries(slides, transitionDuration),
		[slides, transitionDuration],
	);

	// Stable ref for the frame handler to avoid stale closures
	const stateRef = useRef({ pauseFrames, contentFrames });
	stateRef.current = { pauseFrames, contentFrames };

	// Attach frameupdate listener to auto-pause at slide boundaries
	useEffect(() => {
		const player = playerRef.current;
		if (!player) return;

		const handler = (e: { detail: { frame: number } }) => {
			const { pauseFrames: pf } = stateRef.current;
			const frame = e.detail.frame;
			const prevFrame = lastFrameRef.current;
			lastFrameRef.current = frame;

			// Determine current slide: first pause frame >= current frame
			const idx = pf.findIndex((p) => frame <= p);
			setCurrentSlide(idx >= 0 ? idx : slides.length - 1);

			// Auto-pause when crossing a pause frame boundary (playing forward)
			if (prevFrame >= 0 && frame > prevFrame) {
				for (const pauseAt of pf) {
					if (prevFrame < pauseAt && frame >= pauseAt) {
						player.seekTo(pauseAt);
						player.pause();
						setIsWaiting(true);
						return;
					}
				}
			}
		};

		player.addEventListener("frameupdate", handler);
		return () => player.removeEventListener("frameupdate", handler);
	}, [playerRef, slides.length]);

	const next = useCallback(() => {
		const player = playerRef.current;
		if (!player) return;

		if (!isWaiting) {
			// Still animating: skip to end of current slide
			const pf = stateRef.current.pauseFrames[currentSlide];
			player.seekTo(pf);
			player.pause();
			setIsWaiting(true);
			return;
		}

		if (currentSlide < slides.length - 1) {
			setIsWaiting(false);
			player.play();
		}
	}, [currentSlide, isWaiting, slides.length, playerRef]);

	const prev = useCallback(() => {
		const player = playerRef.current;
		if (!player) return;

		if (currentSlide === 0) {
			// On first slide: reset to beginning
			player.seekTo(0);
			player.pause();
			setIsWaiting(true);
			lastFrameRef.current = -1;
		} else {
			const target = currentSlide - 1;
			// Seek to the pause frame of previous slide (fully animated state)
			player.seekTo(stateRef.current.pauseFrames[target]);
			player.pause();
			setCurrentSlide(target);
			setIsWaiting(true);
		}
	}, [currentSlide, playerRef]);

	const goTo = useCallback(
		(index: number) => {
			const player = playerRef.current;
			if (!player || index < 0 || index >= slides.length) return;

			if (index === 0) {
				player.seekTo(0);
			} else {
				player.seekTo(stateRef.current.pauseFrames[index]);
			}
			player.pause();
			setCurrentSlide(index);
			setIsWaiting(true);
			lastFrameRef.current = -1;
		},
		[slides.length, playerRef],
	);

	const reset = useCallback(() => {
		const player = playerRef.current;
		if (!player) return;
		player.seekTo(0);
		player.pause();
		setCurrentSlide(0);
		setIsWaiting(true);
		lastFrameRef.current = -1;
	}, [playerRef]);

	return {
		currentSlide,
		isWaiting,
		totalSlides: slides.length,
		next,
		prev,
		goTo,
		reset,
	};
}

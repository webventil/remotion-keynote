import React from "react";
import { useKeynoteTheme } from "./theme";

interface SlideOverlayProps {
	currentSlide: number;
	totalSlides: number;
}

export const SlideOverlay: React.FC<SlideOverlayProps> = ({
	currentSlide,
	totalSlides,
}) => {
	const theme = useKeynoteTheme();
	const progress = ((currentSlide + 1) / totalSlides) * 100;

	return (
		<div
			style={{
				position: "absolute",
				bottom: 0,
				left: 0,
				right: 0,
				pointerEvents: "none",
				padding: "12px 16px",
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-end",
				gap: 12,
			}}
		>
			{/* Progress bar */}
			<div
				style={{
					width: 120,
					height: 3,
					backgroundColor: theme.trackColor,
					borderRadius: 2,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: `${progress}%`,
						height: "100%",
						backgroundColor: theme.accentColor,
						borderRadius: 2,
						transition: "width 0.3s ease",
					}}
				/>
			</div>

			{/* Slide counter */}
			<span
				style={{
					fontFamily: theme.fontFamily,
					fontSize: 13,
					fontWeight: 600,
					color: theme.textColor,
					letterSpacing: "0.05em",
					userSelect: "none",
				}}
			>
				{currentSlide + 1} / {totalSlides}
			</span>
		</div>
	);
};

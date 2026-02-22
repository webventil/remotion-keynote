import React from "react";
import { PresentationPlayer } from "./PresentationPlayer";
import { defaultKeynoteTheme } from "./theme";
import type { KeynoteTheme } from "./theme";
import type { SlideConfig } from "./types";

interface PresentationAppProps {
	slides: SlideConfig[];
	transitionDuration?: number;
	width?: number;
	height?: number;
	fps?: number;
	theme?: Partial<KeynoteTheme>;
}

export const PresentationApp: React.FC<PresentationAppProps> = ({
	theme: themeOverrides,
	...playerProps
}) => {
	const resolvedTheme = themeOverrides
		? { ...defaultKeynoteTheme, ...themeOverrides }
		: defaultKeynoteTheme;

	return (
		<div
			style={{
				margin: 0,
				background: "#192238",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				fontFamily: resolvedTheme.fontFamily,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 16,
					padding: 32,
				}}
			>
				<PresentationPlayer
					{...playerProps}
					theme={themeOverrides}
				/>
				<p
					style={{
						color: resolvedTheme.textColor,
						fontSize: 13,
						fontFamily: resolvedTheme.fontFamily,
						letterSpacing: "0.1em",
						margin: 0,
					}}
				>
					Space / Right Arrow: next &nbsp;&bull;&nbsp; Left Arrow: back
					&nbsp;&bull;&nbsp; Escape: reset &nbsp;&bull;&nbsp; F: fullscreen
				</p>
			</div>
		</div>
	);
};

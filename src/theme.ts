import { createContext, useContext } from "react";

export interface KeynoteTheme {
	/** Progress bar fill, active thumbnail border */
	accentColor: string;
	/** Active thumbnail glow */
	accentGlow: string;
	/** Thumbnail number color */
	secondaryColor: string;
	/** Slide counter color */
	textColor: string;
	/** Progress bar track */
	trackColor: string;
	/** Overlay / counter font */
	fontFamily: string;
}

export const defaultKeynoteTheme: KeynoteTheme = {
	accentColor: "#14b8a6",
	accentGlow: "rgba(13, 148, 136, 0.3)",
	secondaryColor: "#325797",
	textColor: "rgba(150, 179, 219, 0.7)",
	trackColor: "rgba(192, 209, 234, 0.3)",
	fontFamily: "Vollkorn, Georgia, serif",
};

export const KeynoteThemeContext =
	createContext<KeynoteTheme>(defaultKeynoteTheme);

export function useKeynoteTheme(): KeynoteTheme {
	return useContext(KeynoteThemeContext);
}

import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

export const SCALE = WINDOW_WIDTH * 0.9;
const TRESHOLD = 0.1;

export const base_styles = StyleSheet.create({
	heading: {
		color: "white",
	},

	main: {
		backgroundColor: "#161427",
		rowGap: 30,
	},

	image: {
		borderRadius: 0,
	},

	info: {
		justifyContent: "center",
	},

	title: {
		color: "white",
	},

	artist: {
		fontSize: 14,
		fontWeight: "light",
	},

	slider_container: {
		alignItems: "center",
	},

	slider: {
		width: 300,
	},

	info_slider: {
		width: WINDOW_WIDTH * 0.9,
		flexDirection: "row",
		justifyContent: "space-between",
	},

	text: {
		color: "white",
	},

	buttons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 30,
	},

	play_button: {
		backgroundColor: "#C7DA54",
		borderRadius: 100,
	},

	skip_btn: {},
});

export const dynamic_styles = (progress) => ({
	heading: useAnimatedStyle(() => {
		return {
			display: progress.value < TRESHOLD ? "none" : "contents",
		};
	}),

	main: useAnimatedStyle(() => {
		return {
			paddingHorizontal: interpolate(progress.value, [0, 1], [10, 0]),
			paddingVertical: interpolate(progress.value, [0, 1], [0, 50]),
			flex: interpolate(progress.value, [0, 1], [0, 1]),
			flexDirection: progress.value < TRESHOLD ? "row" : "column",
			alignItems: "center",
			justifyContent: progress.value < TRESHOLD ? "flex-start" : "space-around",
		};
	}),

	image: useAnimatedStyle(() => {
		return {
			width: interpolate(progress.value, [0, 1], [50, SCALE]),
			height: interpolate(progress.value, [0, 1], [50, SCALE]),
			borderRadius: interpolate(progress.value, [0, 5], [5, 5]),
		};
	}),

	info: useAnimatedStyle(() => {
		return {
			marginLeft: interpolate(progress.value, [0, 1], [10, 0]),
			alignItems: progress.value < TRESHOLD ? "flex-start" : "center",
			flex: progress.value < TRESHOLD ? 1 : 0,
		};
	}),

	title: useAnimatedStyle(() => {
		return {
			fontSize: interpolate(progress.value, [0, 1], [17, 25]),
			fontWeight: progress.value < TRESHOLD ? "normal" : "bold",
			textAlign: progress.value < TRESHOLD ? "left" : "center",
		};
	}),

	slider_container: useAnimatedStyle(() => {
		return {
			display: progress.value < TRESHOLD ? "none" : "contents",
		};
	}),

	skip_btn: useAnimatedStyle(() => {
		return {
			display: progress.value < TRESHOLD ? "none" : "contents",
		};
	}),

	play_button: useAnimatedStyle(() => {
		return {
			transform: [{ scale: progress.value < TRESHOLD ? 0.7 : 1 }],
		};
	}),
});

import { useEffect } from "react";
import { AppState, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import TrackPlayer, { Capability } from "react-native-track-player";
import { Navigation } from "./router/router";
import { MusicProvider } from "./components/MusicContext";
import Player from "./routes/Player";

export default function App() {
	useEffect(() => {
		hide_navbar();
		setup_player();

		const listener = AppState.addEventListener("change", (state) => {
			if (state === "active") {
				hide_navbar();
			}
		});

		return () => listener.remove();
	});

	async function setup_player() {
		await TrackPlayer.setupPlayer();

		TrackPlayer.updateOptions({
			capabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious],
		});
	}

	async function hide_navbar() {
		await NavigationBar.setVisibilityAsync("hidden");
	}

	return (
		<MusicProvider>
			<View style={{ flex: 1 }}>
				<StatusBar style="light" />
				<Navigation />
				<Player />
			</View>
		</MusicProvider>
	);
}

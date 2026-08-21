import { useEffect } from "react";
import { AppState, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { TrackPlayer } from "react-native-nitro-player";
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
	}, []);

	async function setup_player() {
		await TrackPlayer.configure({
			showInNotification: true,
			lookaheadCount: 3,
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

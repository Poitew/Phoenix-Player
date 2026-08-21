import { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import { TrackPlayer, useNowPlaying } from "react-native-nitro-player";
import { Slider } from "@miblanchard/react-native-slider";
import { useMusic } from "../components/MusicContext";

import seconds_to_time from "../utility/SecondsToTime";

import SkipNext from "../../assets/icons/skip.svg";
import SkipBack from "../../assets/icons/skip-back.svg";
import Resume from "../../assets/icons/resume.svg";
import Stop from "../../assets/icons/stop.svg";
import GrayText from "../components/GrayText";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

function Player() {
	const { current_folder, current_track, is_playing } = useMusic();
	const [expanded, set_expanded] = useState<boolean>(false);
	const { currentPosition } = useNowPlaying();

	const yellow = "#C7DA54";
	const icon_size_lg = 70;
	const icon_size = 40;

	async function handle_play() {
		is_playing ? await TrackPlayer.pause() : await TrackPlayer.play();
	}

	if (!current_track) {
		return null;
	}

	if (!expanded) {
		return (
			<Pressable style={mini_styles.main} onPress={() => set_expanded(true)}>
				<Image resizeMethod="scale" source={{ uri: current_track.artwork }} style={mini_styles.image} />

				<View>
					<Text numberOfLines={1} style={styles.heading}>
						{current_track.title}
					</Text>

					<GrayText style={styles.artist}>{current_track?.artist || "Artist"}</GrayText>
				</View>
			</Pressable>
		);
	}

	return (
		<View style={[StyleSheet.absoluteFill, styles.main]}>
			<Pressable style={styles.back_button} onPress={() => set_expanded(false)}>
				<GrayText>MINIMIZE PLAYER</GrayText>
			</Pressable>

			{current_folder && <Text style={styles.heading}>Listening from {current_folder}</Text>}

			<Image resizeMethod="scale" source={{ uri: current_track.artwork }} style={styles.image} />

			<View style={styles.info}>
				<Text numberOfLines={1} style={styles.title}>
					{current_track?.title || "Title"}
				</Text>

				<GrayText style={styles.artist}>{current_track?.artist || "Artist"}</GrayText>
			</View>

			<View style={styles.slider_container}>
				<Slider
					trackStyle={styles.slider}
					minimumValue={0}
					minimumTrackTintColor={yellow}
					maximumValue={current_track?.duration || 0}
					maximumTrackTintColor="white"
					thumbTintColor={yellow}
					value={currentPosition}
					onSlidingComplete={(value) => TrackPlayer.seek(value[0])}
					step={1}
				/>

				<View style={styles.info_slider}>
					<Text style={styles.text}>{seconds_to_time(currentPosition)}</Text>
					<Text style={styles.text}>{seconds_to_time(current_track?.duration || 0)}</Text>
				</View>
			</View>

			<View style={styles.buttons}>
				<Pressable onPress={() => TrackPlayer.skipToPrevious()}>
					<SkipBack width={icon_size} height={icon_size} />
				</Pressable>

				<Pressable style={styles.play_button} onPress={handle_play}>
					{is_playing ? (
						<Stop width={icon_size_lg} height={icon_size_lg} />
					) : (
						<Resume width={icon_size_lg} height={icon_size_lg} />
					)}
				</Pressable>

				<Pressable onPress={async () => TrackPlayer.skipToNext()}>
					<SkipNext width={icon_size} height={icon_size} />
				</Pressable>
			</View>
		</View>
	);
}

const mini_styles = StyleSheet.create({
	main: {
		width: "95%",
		alignSelf: "center",
		borderRadius: 18,
		backgroundColor: "#211c38",
		padding: 9,
		overflow: "hidden",
		position: "absolute",
		flexDirection: "row",
		alignItems: "center",
		columnGap: 10,
		bottom: 70,
		borderWidth: 1,
		borderColor: "#393052",
	},

	image: {
		borderRadius: 3,
		width: 50,
		height: 50,
	},
});

const styles = StyleSheet.create({
	heading: {
		color: "white",
	},

	main: {
		width: "100%",
		height: "100%",
		position: "absolute",
		backgroundColor: "#0e0c18",
		rowGap: 24,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},

	image: {
		borderRadius: 24,
		width: 300,
		height: 300,
	},

	info: {
		justifyContent: "center",
		alignItems: "center",
	},

	title: {
		color: "#f7f4ff",
		fontSize: 21,
		fontWeight: "bold",
	},

	artist: {
		fontSize: 14,
	},

	slider_container: {
		alignItems: "center",
		width: "100%",
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
		gap: 34,
	},

	back_button: {
		paddingVertical: 10,
	},

	play_button: {
		backgroundColor: "#C7DA54",
		borderRadius: 100,
		padding: 12,
	},
});

export default Player;

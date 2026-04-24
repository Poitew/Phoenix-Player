import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import TrackPlayer, { Event, Track, useProgress } from "react-native-track-player";
import { Slider } from "@miblanchard/react-native-slider";

import seconds_to_time from "../utility/SecondsToTime";
import * as FS from "../utility/FS";

import SkipNext from "../../assets/icons/skip.svg";
import SkipBack from "../../assets/icons/skip-back.svg";
import Resume from "../../assets/icons/resume.svg";
import Stop from "../../assets/icons/stop.svg";
import GrayText from "../components/GrayText";
import { useMusic } from "../components/MusicContext";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

function Player() {
	const { current_folder, current_track, set_current_track, is_playing, set_is_playing } = useMusic();
	const [expanded, set_expanded] = useState<boolean>(false);
	const { position, duration } = useProgress();

	const yellow = "#C7DA54";
	const icon_size_lg = 70;
	const icon_size = 40;

	useEffect(() => {
		get_playing_track();

		const listener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async () => {
			const current_track = await TrackPlayer.getActiveTrack();

			if (current_track) {
				set_current_track(current_track);
				FS.save_current_track(current_track);
			}
		});

		return () => listener.remove();
	}, []);

	async function get_playing_track() {
		const track_id = await TrackPlayer.getActiveTrackIndex();

		if (track_id != undefined) {
			const track = await TrackPlayer.getTrack(track_id);
			if (track) set_current_track(track);
		}
	}

	async function handle_play() {
		is_playing ? await TrackPlayer.pause() : await TrackPlayer.play();
		set_is_playing(!is_playing);
	}

	if (!current_track) {
		return null;
	}

	if (!expanded) {
		return (
			<Pressable style={mini_styles.main} onPress={() => set_expanded(true)}>
				<Image resizeMethod="scale" source={{ uri: current_track.artwork }} style={mini_styles.image} />

				<View>
					<Text style={styles.heading}>{current_track.title}</Text>

					<GrayText style={styles.artist}>{current_track?.artist || "Artist"}</GrayText>
				</View>
			</Pressable>
		);
	}

	return (
		<View style={[StyleSheet.absoluteFill, styles.main]}>
			<Pressable onPress={() => set_expanded(false)}>
				<GrayText>Go back</GrayText>
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
					maximumValue={duration}
					maximumTrackTintColor="white"
					thumbTintColor={yellow}
					value={position}
					onSlidingComplete={(value) => TrackPlayer.seekTo(value[0])}
					step={1}
				/>

				<View style={styles.info_slider}>
					<Text style={styles.text}>{seconds_to_time(position)}</Text>
					<Text style={styles.text}>{seconds_to_time(duration)}</Text>
				</View>
			</View>

			<View style={styles.buttons}>
				<Pressable style={styles.skip_btn} onPress={async () => await TrackPlayer.skipToPrevious()}>
					<SkipBack width={icon_size} height={icon_size} />
				</Pressable>

				<Pressable style={styles.play_button} onPress={handle_play}>
					{is_playing ? (
						<Stop width={icon_size_lg} height={icon_size_lg} />
					) : (
						<Resume width={icon_size_lg} height={icon_size_lg} />
					)}
				</Pressable>

				<Pressable style={styles.skip_btn} onPress={async () => await TrackPlayer.skipToNext()}>
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
		borderRadius: 5,
		backgroundColor: "#1a1730",
		padding: 10,
		overflow: "hidden",
		position: "absolute",
		flexDirection: "row",
		alignItems: "center",
		columnGap: 10,
		bottom: 70,
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
		backgroundColor: "#161427",
		rowGap: 30,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},

	image: {
		borderRadius: 3,
		width: 325,
		height: 325,
	},

	info: {
		justifyContent: "center",
		alignItems: "center",
	},

	title: {
		color: "white",
		fontSize: 18,
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
		gap: 30,
	},

	play_button: {
		backgroundColor: "#C7DA54",
		borderRadius: 100,
		padding: 10,
	},

	skip_btn: {},
});

export default Player;

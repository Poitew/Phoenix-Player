import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, { Event, Track, useProgress } from "react-native-track-player";
import { Slider } from "@miblanchard/react-native-slider";

import seconds_to_time from "../utility/SecondsToTime";
import * as FS from "../utility/FS";

import SkipNext from "../../assets/icons/skip.svg";
import SkipBack from "../../assets/icons/skip-back.svg";
import Resume from "../../assets/icons/resume.svg";
import Stop from "../../assets/icons/stop.svg";
import Vinyl from "../../assets/icons/vinyl.svg";

interface PlayerProps {
	song_key: number;
	folder: string;
}

function Player({ song_key, folder }: PlayerProps) {
	const [is_playing, set_is_playing] = useState<boolean>(false);
	const [songs, set_songs] = useState<Track[]>([]);
	const [current_song, set_current_song] = useState<Track>();

	const { position, duration } = useProgress();

	const yellow = "#C7DA54";
	const icon_size_lg = 75;
	const icon_size = 50;

	useEffect(() => {
		get_cached_songs();
		get_playing_track();

		const listener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async () => {
			const current_track = await TrackPlayer.getActiveTrack();

			if (current_track) {
				set_current_song(current_track);
				FS.save_current_track(current_track);
			}
		});

		return () => listener.remove();
	}, []);

	useEffect(() => {
		if (songs) {
			add_queue();
		}
	}, [song_key, songs]);

	async function get_cached_songs() {
		let songs_cached: Track[] | null;

		if (folder) {
			songs_cached = await FS.load_specific_folder(folder);
		} else {
			songs_cached = await FS.load_tracks();
		}

		if (songs_cached && songs_cached.length) {
			set_songs(songs_cached);
		}
	}

	async function get_playing_track() {
		const track_id = await TrackPlayer.getActiveTrackIndex();

		if (track_id != undefined) {
			const track = await TrackPlayer.getTrack(track_id);
			set_current_song(track);
		}
	}

	async function add_queue() {
		await TrackPlayer.reset();
		await TrackPlayer.add(songs);
		let index: number = 0;

		if (song_key) {
			index = songs.findIndex((song) => song.id === song_key);
		} else {
			const current_track = await FS.load_current_track();

			if (current_track != null) {
				index = songs.findIndex((song) => song.id === current_track.id);
			}
		}

		if (index >= 0) {
			await TrackPlayer.skip(index);
			await TrackPlayer.play();
			set_is_playing(true);
		}
	}

	async function handle_play() {
		is_playing ? TrackPlayer.pause() : TrackPlayer.play();

		set_is_playing(!is_playing);
	}

	return (
		<SafeAreaView style={styles.main}>
			{current_song?.artwork ? (
				<Image source={{ uri: current_song.artwork }} style={styles.image} />
			) : (
				<Vinyl width={250} height={250} style={{ borderRadius: 100 }} />
			)}

			<View style={styles.info}>
				<Text style={styles.title}>{current_song?.title || "Title"}</Text>

				<Text style={styles.artist}>{current_song?.artist || "Artist"}</Text>
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
				<Pressable onPress={async () => await TrackPlayer.skipToPrevious()}>
					<SkipBack width={icon_size} height={icon_size} />
				</Pressable>

				<Pressable style={styles.play_button} onPress={handle_play}>
					{is_playing ? (
						<Stop width={icon_size_lg} height={icon_size_lg} />
					) : (
						<Resume width={icon_size_lg} height={icon_size_lg} />
					)}
				</Pressable>

				<Pressable onPress={async () => await TrackPlayer.skipToNext()}>
					<SkipNext width={icon_size} height={icon_size} />
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		minHeight: "100%",
		backgroundColor: "#0f0d19ff",
		justifyContent: "center",
		alignItems: "center",
		gap: 50,
	},

	image: {
		width: 250,
		height: 250,
		borderRadius: 1000,
	},

	info: {
		alignItems: "center",
	},

	title: {
		color: "white",
		fontSize: 25,
		fontWeight: "bold",
		textAlign: "center",
	},

	artist: {
		color: "white",
		fontSize: 15,
		fontWeight: "light",
	},

	slider_container: {
		width: "80%",
		alignItems: "center",
	},

	slider: {
		width: 300,
	},

	info_slider: {
		width: "100%",
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
});

export default Player;

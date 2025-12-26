import { useEffect, useState } from "react";
import { View, Pressable, Text } from "react-native";
import { Extrapolation, interpolate, SharedValue, useDerivedValue } from "react-native-reanimated";
import TrackPlayer, { Event, Track, useProgress } from "react-native-track-player";
import { Slider } from "@miblanchard/react-native-slider";
import { base_styles, dynamic_styles, SCALE } from "../styles/player_styles";
import Animated from "react-native-reanimated";

import seconds_to_time from "../utility/SecondsToTime";
import * as FS from "../utility/FS";

import SkipNext from "../../assets/icons/skip.svg";
import SkipBack from "../../assets/icons/skip-back.svg";
import Resume from "../../assets/icons/resume.svg";
import Stop from "../../assets/icons/stop.svg";
import GrayText from "../components/GrayText";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PlayerProps {
	song_key: number;
	folder: string;
	player_position: SharedValue<number>;
}

function Player({ song_key, folder, player_position }: PlayerProps) {
	const [is_playing, set_is_playing] = useState<boolean>(false);
	const [songs, set_songs] = useState<Track[]>([]);
	const [current_song, set_current_song] = useState<Track>();

	const { position, duration } = useProgress();

	const progress = useDerivedValue(() => interpolate(player_position.value, [SCALE, 0], [0, 1], Extrapolation.CLAMP));

	const dynamic = dynamic_styles(progress);

	const yellow = "#C7DA54";
	const icon_size_lg = 70;
	const icon_size = 40;

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
		<Animated.View style={[base_styles.main, dynamic.main]}>
			{folder && (
				<Animated.Text style={[base_styles.heading, dynamic.heading]}>Listening from {folder}</Animated.Text>
			)}

			{current_song?.artwork && (
				<Animated.Image
					resizeMethod="scale"
					source={{ uri: current_song.artwork }}
					style={[base_styles.image, dynamic.image]}
				/>
			)}

			<Animated.View style={[base_styles.info, dynamic.info]}>
				<Animated.Text numberOfLines={1} style={[base_styles.title, dynamic.title]}>
					{current_song?.title || "Title"}
				</Animated.Text>

				<GrayText style={base_styles.artist}>{current_song?.artist || "Artist"}</GrayText>
			</Animated.View>

			<Animated.View style={[base_styles.slider_container, dynamic.slider_container]}>
				<Slider
					trackStyle={base_styles.slider}
					minimumValue={0}
					minimumTrackTintColor={yellow}
					maximumValue={duration}
					maximumTrackTintColor="white"
					thumbTintColor={yellow}
					value={position}
					onSlidingComplete={(value) => TrackPlayer.seekTo(value[0])}
					step={1}
				/>

				<View style={base_styles.info_slider}>
					<Text style={base_styles.text}>{seconds_to_time(position)}</Text>

					<Text style={base_styles.text}>{seconds_to_time(duration)}</Text>
				</View>
			</Animated.View>

			<View style={base_styles.buttons}>
				<AnimatedPressable
					style={[base_styles.skip_btn, dynamic.skip_btn]}
					onPress={async () => await TrackPlayer.skipToPrevious()}
				>
					<SkipBack width={icon_size} height={icon_size} />
				</AnimatedPressable>

				<AnimatedPressable style={[base_styles.play_button, dynamic.play_button]} onPress={handle_play}>
					{is_playing ? (
						<Stop width={icon_size_lg} height={icon_size_lg} />
					) : (
						<Resume width={icon_size_lg} height={icon_size_lg} />
					)}
				</AnimatedPressable>

				<AnimatedPressable
					style={[base_styles.skip_btn, dynamic.skip_btn]}
					onPress={async () => await TrackPlayer.skipToNext()}
				>
					<SkipNext width={icon_size} height={icon_size} />
				</AnimatedPressable>
			</View>
		</Animated.View>
	);
}

export default Player;

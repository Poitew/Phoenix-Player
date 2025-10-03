import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Platform, PermissionsAndroid, Pressable, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAudioFiles, Song } from "@gauch_99/react-native-audio-files";
import { Track } from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import * as FS from "../utility/FS";

import LibraryIcon from "../../assets/icons/library.svg";
import PlayButton from "../../assets/icons/resume.svg";

import BigCard from "../components/BigCard";
import Player from "./Player";

function Home({ route }: any) {
	const [tracks, set_tracks] = useState<Track[]>([]);
	const [key, set_key] = useState<number>(route?.params?.key);
	const [folder] = useState<string>(route?.params?.folder);
	const bottom_sheet_ref = useRef<BottomSheet>(null);

	const navigation: any = useNavigation();

	const snap_points = ["3.5%", "50%", "100%"];
	const icon_size_lg = 50;
	const icon_size = 40;

	useEffect(() => {
		request_permissions();
		get_all_tracks();
	}, []);

	async function request_permissions() {
		if (Platform.OS === "android") {
			if (Platform.Version >= 33) {
				await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
			} else {
				await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
			}
		}
	}

	async function get_all_tracks() {
		const songs_cached = await FS.load_tracks();

		if (songs_cached && songs_cached.length) {
			set_tracks(songs_cached);
		} else {
			const songs = await fetchAudioFiles();
			const tracks = songs_to_track(songs);
			set_tracks(tracks);
			FS.save_tracks(tracks);
		}
	}

	function play_random_song() {
		const song_index = Math.floor(Math.random() * tracks.length - 1);
		set_key(tracks[song_index].id);
	}

	function songs_to_track(songs: Song[]) {
		return songs.map((song) => ({
			url: song.audioUrl,
			title: song.title,
			artist: song.artist,
			artwork: song.imageUrl,
			id: song.id,
		}));
	}

	return (
		<GestureHandlerRootView>
			<SafeAreaView style={styles.main}>
				<ScrollView>
					<View>
						<TextInput
							placeholder="Search from complete library"
							placeholderTextColor="white"
							style={styles.input}
							onFocus={() => navigation.navigate("Search")}
						/>
					</View>

					<Pressable onPress={() => navigation.navigate("Library")} style={styles.button}>
						<LibraryIcon width={icon_size} height={icon_size} />
						<Text>Library</Text>
					</Pressable>

					<View style={styles.section}>
						<Text style={styles.section_title}>Unsure?</Text>

						<Pressable style={styles.random_card} onPress={play_random_song}>
							<Text style={styles.random_card_title}>Test Your Luck!</Text>
							<Text>Click here to play a random song from your library!</Text>
							<PlayButton style={styles.play_button} width={icon_size_lg} height={icon_size_lg} />
						</Pressable>
					</View>

					<View style={styles.section}>
						<Text style={styles.section_title}>Latest songs!</Text>

						<ScrollView horizontal={true} contentContainerStyle={{ gap: 5 }}>
							{tracks.slice(0, 10).map((song, i) => (
								<BigCard track={song} set_key={set_key} key={i} />
							))}
						</ScrollView>
					</View>

					<BottomSheet
						backgroundStyle={{ backgroundColor: "#0f0d19ff" }}
						handleIndicatorStyle={{ backgroundColor: "white" }}
						ref={bottom_sheet_ref}
						index={0}
						snapPoints={snap_points}
					>
						<BottomSheetView>
							<Player song_key={key} folder={folder} />
						</BottomSheetView>
					</BottomSheet>
				</ScrollView>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	main: {
		backgroundColor: "#0f0d19ff",
		minHeight: "100%",
		padding: 15,
	},

	input: {
		backgroundColor: "#25203fff",
		color: "white",
		paddingLeft: 20,
		marginBottom: 15,
		borderRadius: 50,
	},

	button: {
		height: 75,
		padding: 20,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		borderRadius: 10,
		backgroundColor: "#3ac4ffff",
	},

	section: {
		marginTop: 25,
		gap: 10,
	},

	section_title: {
		color: "white",
		fontSize: 30,
	},

	random_card: {
		padding: 20,
		backgroundColor: "#ab89f4ff",
		borderRadius: 10,
		gap: 10,
	},

	random_card_title: {
		fontSize: 20,
		fontWeight: "bold",
	},

	play_button: {
		backgroundColor: "#ffffff8d",
		borderRadius: 100,
	},
});

export default Home;

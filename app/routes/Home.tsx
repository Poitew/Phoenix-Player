import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Platform, PermissionsAndroid, Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAudioFiles, Song } from "@gauch_99/react-native-audio-files";
import { Track } from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import BlackText from "../components/BlackText";
import FolderCard from "../components/FolderCard";
import Player from "./Player";

import * as FS from "../utility/FS";
import * as String from "../utility/String";

import LibraryIcon from "../../assets/icons/library.svg";
import BigCard from "../components/BigCardSong";

function Home({ route }: any) {
	const [folders, set_folders] = useState<Record<string, Track[]> | null>();
	const [key, set_key] = useState<number>(route?.params?.key);
	const [folder] = useState<string>(route?.params?.folder);

	const bottom_sheet_position = useSharedValue<number>(0);
	const bottom_sheet_ref = useRef<BottomSheet>(null);
	const navigation: any = useNavigation();

	const snap_points = ["17.5%", "100%"];
	const icon_size = 40;

	useEffect(() => {
		set_key(route?.params?.key);
	}, [route?.params?.key]);

	useEffect(() => {
		request_permissions();
		get_data();
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

	async function get_data() {
		const record_cached = await FS.load_folders();

		if (record_cached === null) {
			const songs_cached = await FS.load_tracks();

			if (songs_cached && songs_cached.length) {
				const record = String.divide_songs_in_folder(songs_cached);
				FS.save_folders(record);
				set_folders(record);
			} else {
				const songs = await fetchAudioFiles();
				const tracks = songs_to_track(songs);
				FS.save_tracks(tracks);
			}
		} else {
			set_folders(record_cached);
		}
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
				<View style={styles.grid}>
					{folders &&
						Object.entries(folders)
							.slice(0, 4)
							.map(([folder], index) => (
								<FolderCard
									navigation={navigation}
									folder={folder}
									track_artwork={folders[folder][0].artwork}
									key={index}
								/>
							))}
				</View>

				<Pressable onPress={() => navigation.navigate("Library")} style={styles.button}>
					<LibraryIcon width={icon_size} height={icon_size} />
					<BlackText>Library</BlackText>
				</Pressable>

				<View style={styles.section}>
					<Text style={styles.section_title}>Keep Listening</Text>

					<ScrollView horizontal={true} contentContainerStyle={{ gap: 5 }}>
						{folders &&
							Object.values(folders)[0]
								.slice(0, 10)
								.map((folder, index) => <BigCard track={folder} key={index} set_key={set_key} />)}
					</ScrollView>
				</View>

				{key && (
					<BottomSheet
						backgroundStyle={{ backgroundColor: "#161427" }}
						handleIndicatorStyle={{ display: "none" }}
						ref={bottom_sheet_ref}
						index={0}
						snapPoints={snap_points}
						animatedPosition={bottom_sheet_position}
						enableOverDrag={false}
					>
						<BottomSheetView>
							<Player song_key={key} folder={folder} player_position={bottom_sheet_position} />
						</BottomSheetView>
					</BottomSheet>
				)}
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	main: {
		backgroundColor: "#0e0c18ff",
		minHeight: "100%",
		padding: 12.5,
	},

	grid: {
		marginVertical: 30,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},

	button: {
		height: 75,
		padding: 20,
		borderRadius: 10,
		backgroundColor: "#0c95cfff",
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},

	section: {
		marginTop: 50,
		gap: 10,
	},

	section_title: {
		color: "white",
		fontSize: 25,
	},
});

export default Home;

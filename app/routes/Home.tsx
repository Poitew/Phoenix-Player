import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Platform, PermissionsAndroid, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAudioFiles, Song } from "@gauch_99/react-native-audio-files";
import { useNavigation } from "@react-navigation/native";
import BlackText from "../components/BlackText";
import FolderCard from "../components/FolderCard";

import * as FS from "../utility/FS";
import * as String from "../utility/String";

import LibraryIcon from "../../assets/icons/library.svg";
import SongCard from "../components/SongCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

function Home() {
	const [folders, set_folders] = useState<Record<string, Track[]> | null>();

	const navigation: any = useNavigation();
	const bottom_tab_bar_height = useBottomTabBarHeight();
	const icon_size = 40;

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
			id: `${song.id}`,
		}));
	}

	return (
		<SafeAreaView style={styles.main}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.topbar}>
					<View>
						<Text style={styles.kicker}>MUSIC PLAYER</Text>
						<Text style={styles.title}>
							Welcome, <Text style={styles.title_accent}>enjoy your music.</Text>
						</Text>
					</View>
				</View>

				<View style={styles.hero}>
					<View style={styles.hero_copy}>
						<Text style={styles.hero_label}>Did you know?</Text>
						<Text style={styles.hero_title}>Your library is {`\n`}composed of...</Text>
					</View>
					<View style={styles.hero_ring}>
						<Text style={styles.hero_number}>{folders ? Object.keys(folders).length : "--"}</Text>
						<Text style={styles.hero_unit}>PLAYLISTS</Text>
					</View>
				</View>

				<View style={styles.section_heading}>
					<Text style={styles.section_title}>Some of your playlists</Text>
				</View>
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
					<View>
						<BlackText style={styles.button_title}>Open full library</BlackText>
						<Text style={styles.button_hint}>All folders and saved tracks</Text>
					</View>
					<Text style={styles.arrow}>&#8599;</Text>
				</Pressable>

				<View style={[styles.section, { marginBottom: bottom_tab_bar_height }]}>
					<Text style={styles.section_title}>Keep Listening</Text>

					<ScrollView horizontal={true} contentContainerStyle={{ gap: 5 }}>
						{folders &&
							Object.values(folders)[0]
								.slice(0, 10)
								.map((track, index) => (
									<SongCard
										variant="big"
										track={track}
										key={index}
										folder_name={Object.keys(folders)[0]}
									/>
								))}
					</ScrollView>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	main: {
		backgroundColor: "#0e0c18",
		minHeight: "100%",
		padding: 20,
	},

	topbar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},

	kicker: {
		color: "#958cae",
		fontSize: 10,
		fontWeight: "800",
		letterSpacing: 2,
	},

	title: {
		color: "#f7f4ff",
		fontSize: 25,
		fontWeight: "800",
		marginTop: 5,
	},

	title_accent: {
		color: "#C7DA54",
	},

	hero: {
		borderRadius: 24,
		padding: 20,
		backgroundColor: "#282245",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		overflow: "hidden",
	},

	hero_copy: {
		flex: 1,
	},

	hero_label: {
		color: "#C7DA54",
		fontSize: 10,
		fontWeight: "800",
		letterSpacing: 1.5,
	},

	hero_title: {
		color: "#fff",
		fontSize: 23,
		fontWeight: "700",
		lineHeight: 29,
		marginTop: 10,
	},

	hero_hint: {
		color: "#aaa1bd",
		fontSize: 12,
		lineHeight: 17,
		marginTop: 12,
		maxWidth: 210,
	},

	hero_ring: {
		width: 100,
		height: 100,
		borderRadius: 100,
		borderWidth: 1,
		borderColor: "#C7DA54",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#211c38",
	},

	hero_number: {
		color: "#C7DA54",
		fontSize: 25,
		fontWeight: "800",
	},

	hero_unit: {
		color: "#aaa1bd",
		fontSize: 8,
		fontWeight: "800",
		letterSpacing: 1,
	},

	section_heading: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
		marginTop: 30,
		marginBottom: 12,
	},

	grid: {
		marginVertical: 0,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},

	button: {
		minHeight: 72,
		padding: 15,
		borderRadius: 18,
		backgroundColor: "#C7DA54",
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginTop: 18,
	},

	button_title: {
		color: "#171329",
		fontWeight: "800",
		fontSize: 15,
	},

	button_hint: {
		color: "#4e5223",
		fontSize: 11,
		marginTop: 3,
	},

	arrow: {
		color: "#171329",
		fontSize: 25,
		marginLeft: "auto",
	},

	section: {
		marginTop: 30,
		gap: 10,
	},

	section_title: {
		color: "white",
		fontSize: 20,
		fontWeight: "800",
	},
});

export default Home;

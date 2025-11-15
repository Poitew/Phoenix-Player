import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Track } from "react-native-track-player";
import FolderCard from "../components/FolderCard";
import SectionHeader from "../components/SectionHeader";

import * as FS from "../utility/FS";
import * as String from "../utility/String";

function Library() {
	const [folders, set_folders] = useState<Record<string, Track[]> | null>();
	const navigation: any = useNavigation();

	useEffect(() => {
		get_cached_songs();
	}, []);

	async function get_cached_songs() {
		const record_cached = await FS.load_songs_folder();

		if (record_cached === null) {
			const songs_cached = await FS.load_tracks();

			if (songs_cached && songs_cached.length) {
				const record = String.divide_songs_in_folder(songs_cached);
				FS.save_songs_folders(record);
				set_folders(record);
			}
		} else {
			set_folders(record_cached);
		}
	}

	return (
		<SafeAreaView style={styles.main}>
			<ScrollView>
				<SectionHeader title="Folders" route="HomeStack" />

				<View style={styles.container}>
					{folders &&
						Object.entries(folders).map(([folder], index) => (
							<FolderCard
								navigation={navigation}
								folder={folder}
								tracks_count={folders[folder].length}
								key={index}
							/>
						))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	main: {
		backgroundColor: "#0f0d19ff",
		minHeight: "100%",
		padding: 15,
	},

	container: {
		marginTop: 50,
		gap: 35,
	},
});

export default Library;

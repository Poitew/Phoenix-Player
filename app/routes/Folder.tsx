import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Track } from "react-native-track-player";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionHeader from "../components/SectionHeader";
import SongCard from "../components/SongCard";

import * as FS from "../utility/FS";

function Folder({ route }: any) {
	const { folder } = route.params;
	const [local_tracks, set_local_tracks] = useState<Track[]>([]);

	useEffect(() => {
		async function load_folder_tracks() {
			const tracks = await FS.load_specific_folder(folder);

			if (tracks) {
				set_local_tracks(tracks);
			}
		}

		load_folder_tracks();
	}, [folder]);

	const render_item = useCallback(
		({ item }: { item: Track }) => <SongCard track={item} folder_name={folder} />,
		[folder],
	);

	return (
		<SafeAreaView style={styles.main}>
			<SectionHeader title={folder} route="Home" />

			<FlatList
				data={local_tracks}
				keyExtractor={(item: Track, index: number) => index.toString()}
				renderItem={render_item}
				initialNumToRender={8}
				maxToRenderPerBatch={10}
				contentContainerStyle={styles.container}
				removeClippedSubviews={true}
			/>
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
		paddingBottom: 75,
		gap: 15,
	},
});

export default Folder;

import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Track } from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";

import * as FS from "../utility/FS";

function Folder({ route }: any) {
	const [tracks, set_tracks] = useState<Track[]>();
	const navigation: any = useNavigation();
	const folder = route.params.folder;

	useEffect(() => {
		get_tracks();
	});

	const render_item = useCallback(
		({ item }: any) => <Card navigation={navigation} track={item} folder={folder} />,
		[tracks],
	);

	async function get_tracks() {
		const folder_content = await FS.load_specific_folder(folder);

		if (folder_content) {
			set_tracks(folder_content);
		}
	}

	return (
		<SafeAreaView style={styles.main}>
			<SectionHeader title={folder} route="Library" />

			<FlatList
				data={tracks}
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
		gap: 25,
	},
});

export default Folder;

import { useEffect, useState } from "react";
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
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => <Card navigation={navigation} track={item} folder={folder} />}
				initialNumToRender={6}
				maxToRenderPerBatch={10}
				removeClippedSubviews={true}
				contentContainerStyle={styles.container}
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
		marginTop: 50,
		gap: 35,
	},
});

export default Folder;

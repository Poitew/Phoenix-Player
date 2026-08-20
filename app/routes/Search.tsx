import { useEffect, useState } from "react";
import { StyleSheet, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionHeader from "../components/SectionHeader";
import SongCard from "../components/SongCard";

import * as FS from "../utility/FS";
import * as String from "../utility/String";

function Search() {
	const [tracks, set_tracks] = useState<Track[]>([]);
	const [results, set_results] = useState<Track[]>();
	const [search, set_search] = useState<string>("");

	useEffect(() => {
		get_cached_songs();
	}, []);

	useEffect(() => {
		if (search.trim() === "") {
			set_results(undefined);
			return;
		}

		if (search) {
			set_results(String.search_songs(tracks!, search));
		}
	}, [search]);

	async function get_cached_songs() {
		let songs = await FS.load_tracks();

		if (songs && songs.length) {
			set_tracks(songs);
		}
	}

	return (
		<SafeAreaView style={styles.main}>
			<TextInput
				placeholder="Search from complete library"
				placeholderTextColor="white"
				style={styles.input}
				onChangeText={(text) => set_search(text)}
			/>

			<SectionHeader title="Results" route="Home" />

			<FlatList
				data={results ? results : tracks}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }: { item: Track }) => <SongCard track={item} />}
				initialNumToRender={6}
				maxToRenderPerBatch={10}
				removeClippedSubviews={true}
				keyboardShouldPersistTaps="handled"
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	main: {
		minHeight: "100%",
		backgroundColor: "#0f0d19ff",
		padding: 15,
	},

	input: {
		backgroundColor: "#25203fff",
		color: "white",
		paddingLeft: 20,
		marginBottom: 15,
		borderRadius: 50,
	},

	section: {
		flexDirection: "row",
		alignItems: "baseline",
		justifyContent: "space-between",
	},

	results: {
		color: "white",
		fontSize: 30,
	},
});

export default Search;

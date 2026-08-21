import { useEffect, useState } from "react";
import { StyleSheet, FlatList, TextInput, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SongCard from "../components/SongCard";
import PageHeader from "../components/PageHeader";

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
			<PageHeader kicker="DISCOVER" title="Find your mood" subtitle="Look through every saved track." />
			<TextInput
				placeholder="Track title"
				placeholderTextColor="#8f86a4"
				style={styles.input}
				onChangeText={(text) => set_search(text)}
			/>

			<View style={styles.results_header}>
				<Text style={styles.results_title}>{results ? "Matches" : "All tracks"}</Text>
				<Text style={styles.count}>{(results ?? tracks).length} TRACKS</Text>
			</View>

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
		padding: 20,
		paddingBottom: 100,
	},
	input: {
		backgroundColor: "#211c38",
		color: "white",
		paddingHorizontal: 18,
		height: 54,
		marginBottom: 24,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#393052",
	},
	results_header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
		marginBottom: 10,
	},
	results_title: {
		color: "#f7f4ff",
		fontSize: 18,
		fontWeight: "800",
	},
	count: {
		color: "#766d8d",
		fontSize: 10,
		fontWeight: "800",
		letterSpacing: 1,
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

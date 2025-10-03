import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TextInput } from "react-native";
import { Track } from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";

import * as FS from "../utility/FS";
import * as StringUtility from "../utility/String";

function Search() {
	const [tracks, set_tracks] = useState<Track[]>([]);
	const [results, set_results] = useState<Track[]>([]);
	const [search, set_search] = useState<string>("");

	const navigation: any = useNavigation();

	useEffect(() => {
		get_cached_songs();
	}, []);

	useEffect(() => {
		if (tracks && search) {
			set_results(StringUtility.search_songs(tracks!, search));
		}
	}, [search]);

	async function get_cached_songs() {
		const songs_cached = await FS.load_tracks();

		if (songs_cached && songs_cached.length) {
			set_tracks(songs_cached);
		}
	}

	return (
		<SafeAreaView style={styles.main}>
			<ScrollView>
				<TextInput
					placeholder="Search from complete library"
					placeholderTextColor="white"
					style={styles.input}
					onChangeText={(text) => set_search(text)}
					autoFocus={true}
				/>

				<SectionHeader title="Results" route="HomeStack" />

				<View>
					{results?.map((song, i) => (
						<Card track={song} navigation={navigation} key={i} />
					))}
				</View>
			</ScrollView>
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

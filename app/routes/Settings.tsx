import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FS from "../utility/FS";
import PageHeader from "../components/PageHeader";

function Settings() {
	async function delete_cache() {
		await FS.clear_tracks_cache();
		await FS.clear_folders();
		alert(`Cache cleared`);
	}

	return (
		<SafeAreaView style={styles.main}>
			<ScrollView>
				<PageHeader kicker="PREFERENCES" title="Settings" subtitle="Adjust the settings to your liking." />

				{/* TO-DO: Create a Card component once more settings starts to get implemented */}
				<View style={styles.cache_button_container}>
					<Pressable onPress={delete_cache} style={styles.cache_button}>
						<Text style={styles.cache_title}>Clear local library cache</Text>
						<Text style={styles.cache_hint}>Remove cached data and refetch on next visit</Text>
					</Pressable>
				</View>
			</ScrollView>
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
	cache_button_container: {
		alignItems: "center",
		marginTop: 30,
	},

	cache_button: {
		width: "100%",
		minHeight: 74,
		borderRadius: 16,
		backgroundColor: "#211c38",
		padding: 16,
		justifyContent: "center",
	},
	cache_title: {
		color: "#f7f4ff",
		fontWeight: "800",
		fontSize: 15,
	},
	cache_hint: {
		color: "#958cae",
		fontSize: 11,
		marginTop: 5,
	},
});

export default Settings;

import { Pressable, Image, View, Text, StyleSheet } from "react-native";
import { Track } from "react-native-track-player";
import GrayText from "./GrayText";
import * as String from "../utility/String";

interface CardProps {
	navigation: any;
	track: Track;
	folder?: string;
	from_search?: boolean;
}

function Card({ navigation, track, folder, from_search = false }: CardProps) {
	function redirect_to_player(key: number) {
		if (from_search) {
			navigation.navigate("Home", {
				key: key,
				folder: folder || "",
			});
		} else {
			navigation.navigate("HomeStack", {
				screen: "Home",
				params: {
					key: key,
					folder: folder || "",
				},
			});
		}
	}

	return (
		<Pressable
			style={({ pressed }) => [styles.card, pressed && styles.hover_card]}
			onPress={() => redirect_to_player(track.id)}
		>
			<Image source={{ uri: track.artwork }} style={styles.image} />

			<View style={{ gap: 5 }}>
				<Text style={styles.title}>{String.truncate_string(track.title!, 30)}</Text>
				<GrayText style={styles.artist}>{track.artist}</GrayText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 5,
		borderRadius: 7.5,
		flexDirection: "row",
		alignItems: "center",
		gap: 15,
	},

	hover_card: {
		backgroundColor: "#231e39ff",
	},

	image: {
		width: 55,
		height: 55,
		borderRadius: 5,
	},

	title: {
		color: "white",
		fontSize: 16.5,
		fontWeight: "bold",
	},

	artist: {
		fontSize: 12.5,
		fontWeight: "light",
	},
});

export default Card;

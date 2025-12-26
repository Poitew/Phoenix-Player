import { Pressable, Image, View, Text, StyleSheet } from "react-native";
import { Track } from "react-native-track-player";
import * as String from "../utility/String";

interface CardProps {
	track: Track;
	folder?: string;
	set_key: React.Dispatch<React.SetStateAction<number>>;
}

function BigCard({ track, set_key }: CardProps) {
	function redirect_to_player(key: number) {
		set_key(key);
	}

	return (
		<Pressable
			style={({ pressed }) => [styles.card, pressed && styles.hover_card]}
			onPress={() => redirect_to_player(track.id)}
		>
			<Image source={{ uri: track.artwork }} style={styles.image} />

			<View>
				<Text style={styles.title}>{String.truncate_string(track.title!, 15)}</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		padding: 5,
		borderRadius: 7.5,
		gap: 15,
	},

	hover_card: {
		backgroundColor: "#231e39ff",
	},

	image: {
		width: 125,
		height: 125,
		borderRadius: 10,
	},

	title: {
		color: "white",
		fontSize: 17.5,
		fontWeight: "bold",
	},

	artist: {
		color: "white",
		fontSize: 12.5,
		fontWeight: "light",
	},
});

export default BigCard;

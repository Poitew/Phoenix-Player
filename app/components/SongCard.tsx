import { Pressable, Image, View, Text, StyleSheet } from "react-native";
import { Track } from "react-native-track-player";
import { useMusic } from "./MusicContext";
import GrayText from "./GrayText";
import * as StringUtils from "../utility/String";

interface CardProps {
	track: Track;
	variant?: "small" | "big";
	folder_name: string;
}

function SongCard({ track, variant = "small", folder_name }: CardProps) {
	const { load_and_play_folder } = useMusic();
	const is_big = variant === "big";

	function handle_press() {
		load_and_play_folder(folder_name, track.id as number);
	}

	if (is_big) {
		return (
			<Pressable
				style={({ pressed }) => [styles.card, styles.card_big, pressed && styles.hover_card]}
				onPress={handle_press}
			>
				<Image source={{ uri: track.artwork }} style={styles.image_big} />

				<View>
					<Text style={styles.title_big}>{StringUtils.truncate_string(track.title!, 15)}</Text>
				</View>
			</Pressable>
		);
	}

	return (
		<Pressable
			style={({ pressed }) => [styles.card, styles.card_small, pressed && styles.hover_card]}
			onPress={handle_press}
		>
			<Image source={{ uri: track.artwork }} style={styles.image_small} />

			<View style={{ gap: 5 }}>
				<Text style={styles.title_small}>{StringUtils.truncate_string(track.title!, 30)}</Text>
				<GrayText style={styles.artist}>{track.artist}</GrayText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 5,
		borderRadius: 7.5,
		gap: 15,
	},

	card_small: {
		flexDirection: "row",
		alignItems: "center",
	},

	card_big: {
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "transparent",
	},

	hover_card: {
		backgroundColor: "#231e39ff",
	},

	image_small: {
		width: 55,
		height: 55,
		borderRadius: 5,
	},

	image_big: {
		width: 125,
		height: 125,
		borderRadius: 10,
	},

	title_small: {
		color: "white",
		fontSize: 16.5,
		fontWeight: "bold",
	},

	title_big: {
		color: "white",
		fontSize: 17.5,
		fontWeight: "bold",
	},

	artist: {
		fontSize: 12.5,
	},
});

export default SongCard;

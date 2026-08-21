import { Pressable, Image, View, Text, StyleSheet } from "react-native";
import { useMusic } from "./MusicContext";
import GrayText from "./GrayText";
import * as StringUtils from "../utility/String";

interface CardProps {
	track: Track;
	variant?: "small" | "big";
	folder_name?: string;
}

function SongCard({ track, variant = "small", folder_name }: CardProps) {
	const { load_and_play_folder } = useMusic();
	const is_big = variant === "big";

	function handle_press() {
		const folder = folder_name ?? track.url.match(/\/([^/]+)\/[^/]+$/)?.[1] ?? "Unknown";
		load_and_play_folder(folder, track.id);
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
		padding: 9,
		borderRadius: 16,
		gap: 13,
	},

	card_small: {
		flexDirection: "row",
		alignItems: "center",
	},

	card_big: {
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "#211c38",
	},

	hover_card: {
		backgroundColor: "#30294c",
	},

	image_small: {
		width: 58,
		height: 58,
		borderRadius: 12,
	},

	image_big: {
		width: 142,
		height: 142,
		borderRadius: 16,
	},

	title_small: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},

	title_big: {
		color: "white",
		fontSize: 15,
		fontWeight: "bold",
	},

	artist: {
		fontSize: 12.5,
	},
});

export default SongCard;

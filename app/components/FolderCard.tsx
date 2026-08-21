import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import Folder from "../../assets/icons/folder.svg";
import GrayText from "./GrayText";
import * as StringUtils from "../utility/String";

interface FolderCardProps {
	navigation: any;
	folder: string;
	track_artwork: string | undefined | null;
	variant?: "small" | "big";
	tracks_count?: number;
}

function FolderCard({ navigation, folder, track_artwork, variant = "small", tracks_count }: FolderCardProps) {
	const is_big = variant === "big";
	const icon_size = 50;

	const handle_press = () => {
		navigation.navigate("Library", {
			screen: "Folder",
			params: { folder: folder },
		});
	};

	if (is_big) {
		return (
			<Pressable onPress={handle_press} style={[styles.folder, styles.folder_big]}>
				{track_artwork ? (
					<Image source={{ uri: track_artwork }} style={styles.image_big} />
				) : (
					<View style={styles.icon_wrapper_big}>
						<Folder width={icon_size} height={icon_size} />
					</View>
				)}

				<View>
					<Text style={styles.title_big}>{StringUtils.truncate_string(folder, 20)}</Text>
					<GrayText>{tracks_count} Songs</GrayText>
				</View>
			</Pressable>
		);
	}

	return (
		<Pressable onPress={handle_press} style={[styles.folder, styles.folder_small]}>
			{track_artwork ? (
				<Image source={{ uri: track_artwork }} style={styles.image_small} />
			) : (
				<View style={styles.icon_wrapper_small}>
					<Folder width={icon_size} height={icon_size} />
				</View>
			)}

			<View>
				<Text style={styles.title_small}>{StringUtils.truncate_string(folder, 13)}</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	folder: {
		minWidth: "46%",
		flex: 1,
		flexShrink: 0,
		borderRadius: 16,
		overflow: "hidden",
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},

	folder_small: {
		backgroundColor: "#211c38",
		padding: 8,
	},

	folder_big: {
		backgroundColor: "transparent",
		padding: 8,
	},

	image_small: {
		width: 52,
		height: 52,
		borderRadius: 12,
	},

	image_big: {
		width: 78,
		height: 78,
		borderRadius: 14,
	},

	icon_wrapper_small: {
		width: 50,
		alignItems: "center",
	},

	icon_wrapper_big: {
		width: 75,
		alignItems: "center",
	},

	title_small: {
		color: "#f7f4ff",
		fontWeight: "700",
	},

	title_big: {
		color: "#f7f4ff",
		fontSize: 17,
		fontWeight: "700",
	},
});

export default FolderCard;

import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import Folder from "../../assets/icons/folder.svg";
import GrayText from "./GrayText";

import * as String from "../utility/String";

interface FolderCardProps {
	navigation: any;
	folder: string;
	tracks_count: number;
	track_artwork: string | undefined;
}

function BigFolderCard({ navigation, folder, tracks_count, track_artwork }: FolderCardProps) {
	const icon_size = 50;

	return (
		<Pressable onPress={() => navigation.navigate("Folder", { folder: folder })} style={styles.folder}>
			{track_artwork ? (
				<Image source={{ uri: track_artwork }} style={styles.image} />
			) : (
				<Folder width={icon_size} height={icon_size} />
			)}

			<View>
				<Text style={styles.title}>{String.truncate_string(folder, 20)}</Text>
				<GrayText>{tracks_count} Songs</GrayText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	folder: {
		minWidth: "45%",
		flex: 1,
		flexShrink: 0,
		padding: 1,
		borderRadius: 5,
		overflow: "hidden",
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},

	image: {
		width: 75,
		height: 76,
		borderRadius: 5,
	},

	title: {
		color: "white",
		fontSize: 20,
	},
});

export default BigFolderCard;

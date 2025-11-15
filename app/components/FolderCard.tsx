import { Pressable, StyleSheet, Text, View } from "react-native";
import Folder from "../../assets/icons/folder.svg";
import GrayText from "./GrayText";

interface FolderCardProps {
	navigation: any;
	folder: string;
	tracks_count: number;
}

function FolderCard({ navigation, folder, tracks_count }: FolderCardProps) {
	const icon_size = 50;

	return (
		<Pressable onPress={() => navigation.navigate("Folder", { folder: folder })} style={styles.folder}>
			<Folder width={icon_size} height={icon_size} />

			<View>
				<Text style={{ color: "white" }}>{folder}</Text>
				<GrayText>{tracks_count} Songs</GrayText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	folder: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
});

export default FolderCard;

import { Pressable, StyleSheet, Text } from "react-native";
import Folder from "../../assets/icons/folder.svg";

interface FolderCardProps {
	navigation: any;
	folder: string;
}

function FolderCard({ navigation, folder }: FolderCardProps) {
	const icon_size = 50;

	return (
		<Pressable onPress={() => navigation.navigate("Folder", { folder: folder })} style={styles.folder}>
			<Folder width={icon_size} height={icon_size} />
			<Text style={{ color: "white" }}>{folder}</Text>
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

import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import GoBack from "../../assets/icons/GoBack.svg";

interface SectionHeaderProps {
	title: string;
	route: string;
}

function SectionHeader({ title, route }: SectionHeaderProps) {
	const navigation: any = useNavigation();

	const icon_size = 75;

	return (
		<View>
			<Pressable style={styles.section} onPress={() => navigation.navigate(route)}>
				<Text numberOfLines={1} style={styles.page_title}>
					{title}
				</Text>

				<GoBack width={icon_size} height={icon_size} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	section: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	page_title: {
		flex: 1,
		color: "white",
		fontSize: 30,
	},
});

export default SectionHeader;

import { StyleSheet, Text, View } from "react-native";

interface PageHeaderProps {
	kicker: string;
	title: string;
	subtitle: string;
}

function PageHeader({ kicker, title, subtitle }: PageHeaderProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.kicker}>{kicker}</Text>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.subtitle}>{subtitle}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},

	kicker: {
		color: "#C7DA54",
		fontSize: 10,
		fontWeight: "800",
		letterSpacing: 1.5,
	},

	title: {
		color: "#f7f4ff",
		fontSize: 34,
		fontWeight: "800",
		marginTop: 6,
	},

	subtitle: {
		color: "#958cae",
		fontSize: 13,
		marginTop: 4,
	},
});

export default PageHeader;

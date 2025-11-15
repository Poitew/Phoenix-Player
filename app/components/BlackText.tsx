import { Text, TextProps } from "react-native";

interface BlackTextProps extends TextProps {
	children: React.ReactNode;
}

function BlackText({ children, style, ...rest }: BlackTextProps) {
	return (
		<Text style={[{ color: "#171616ff" }, style]} {...rest}>
			{children}
		</Text>
	);
}

export default BlackText;

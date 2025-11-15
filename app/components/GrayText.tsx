import { Text, TextProps } from "react-native";

interface GrayTextProps extends TextProps {
	children: React.ReactNode;
}

function GrayText({ children, style, ...rest }: GrayTextProps) {
	return (
		<Text style={[{ color: "#94A3B8" }, style]} {...rest}>
			{children}
		</Text>
	);
}

export default GrayText;

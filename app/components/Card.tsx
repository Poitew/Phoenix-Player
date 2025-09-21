import { Pressable, Image, View, Text, StyleSheet } from "react-native";
import { Track } from "react-native-track-player";

interface CardProps {
    navigation: any,
    track: Track,
    folder?: string
}

function Card({ navigation, track, folder  }: CardProps) {
    function redirect_to_player(key: number) {
        navigation.navigate("Player", {
            key: key,
            folder: folder || ""
        });
    }

    return (
        <Pressable 
            style={({ pressed }) => [
                styles.card,
                pressed && styles.hover_card,
            ]}
            onPress={() => redirect_to_player(track.id)}
        >
            <Image source={{ uri: track.artwork }} style={styles.image} />
            
            <View style={{ gap: 10 }}>
                <Text style={styles.title} >{track.title}</Text>
                <Text style={styles.artist} >{track.artist}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 5,
        borderRadius: 7.5,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },

    hover_card: {
        backgroundColor: "#231e39ff",
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 15
    },

    title: {
        color: "white",
        fontSize: 17.5,
        fontWeight: "bold",
    },

    artist: {
        color: "white",
        fontSize: 12.5,
        fontWeight: "light",
    },
});

export default Card;
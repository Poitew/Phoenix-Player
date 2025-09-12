import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, ScrollView, Pressable, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Track } from "react-native-track-player";

function Library({ route }: any) {
    const songs: Track[] = route.params.songs;
    const navigation: any = useNavigation();

    function redirect_to_player(key: number) {
        navigation.navigate("Player", {
            key: key,
            songs: songs,
        });
    }

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <Pressable onPress={() => navigation.navigate("Home")}>
                    <Text style={{color: "white"}} >Go back</Text>
                </Pressable>
                
                <Text style={styles.page_title} >Your Library!</Text>
                
                <View style={styles.container}>
                    {songs.map((song, i) => (
                        <Pressable 
                            style={({ pressed }) => [
                                styles.card,
                                pressed && styles.hover_card,
                            ]}
                            onPress={() => redirect_to_player(i)}
                            key={i}
                        >
                            <Image source={{ uri: song.artwork }} style={styles.image} />
                            
                            <View style={{ gap: 10 }}>
                                <Text style={styles.title} >{song.title}</Text>
                                <Text style={styles.artist} >{song.artist}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: "#0f0d19ff",
        minHeight: "100%",
        padding: 15,
    },

    page_title: {
        color: "white",
        fontSize: 30,
        marginTop: 20,
    },

    container: {
        marginTop: 50,
        gap: 35,
    },

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
})

export default Library;
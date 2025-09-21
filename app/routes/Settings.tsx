import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FS from "../utility/FS";

function Settings() {
    async function delete_cache() {
        await FS.clear_tracks_cache();
        await FS.clear_songs_folder();
        alert(`Cache cleared`);
    }
    
    return(
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <Text style={styles.title} >Settings</Text>

                {/* TO-DO: Create a Card component once more settings starts to get implmented */}
                <View style={styles.cache_button_container}>
                    <Pressable onPress={delete_cache} style={styles.cache_button} >
                        <Text>Delete Cache</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        minHeight: "100%",
        backgroundColor: "#0f0d19ff",
        padding: 15,
    },

    title: {
        fontSize: 35,
        color: "white",
    },

    cache_button_container: {
        alignItems: "center",
        marginTop: 20,
    },

    cache_button: {
        width: "92.5%",
        height: 50,
        borderRadius: 10,
        backgroundColor: "#cd5353ff",
        alignItems: "center",
        justifyContent: "center",
    },
})

export default Settings;
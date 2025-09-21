import { useEffect, useState } from "react";
import { Track } from "react-native-track-player";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";

import * as FS from "../utility/FS"; 

function Folder({ route }: any) {
    const [ tracks, set_tracks ] = useState<Track[]>();
    const navigation: any = useNavigation();
    const folder = route.params.folder;

    useEffect(() => {
        get_tracks();
    });

    async function get_tracks() {
        const folder_content = await FS.load_specific_folder(folder);

        if (folder_content) {
            set_tracks(folder_content);
        }
    }

    return(
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.page_title}>{folder}</Text>

                    <Pressable onPress={() => navigation.navigate("Library")}>
                        <Text style={{color: "white"}}>Go back</Text>
                    </Pressable>
                </View>

                <View style={styles.container}>
                    {tracks?.map((track, index) => (
                        <Card 
                            navigation={navigation}
                            track={track}
                            folder={folder}
                            key={index}
                        />
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

    section: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
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
});

export default Folder;
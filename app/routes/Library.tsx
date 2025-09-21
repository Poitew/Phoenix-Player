import { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Track } from "react-native-track-player";
import FolderCard from "../components/FolderCard";
import Card from "../components/Card";

import * as FS from "../utility/FS";
import * as String from "../utility/String";

function Library() {
    const [ tracks,  set_tracks  ] = useState<Track[]>([]);
    const [ folders, set_folders ] = useState<Record<string, Track[]> | null>();
    const navigation: any = useNavigation();
    
    useEffect(() => {
        get_cached_songs();
    }, []);
    
    async function get_cached_songs() {
        const songs_cached = await FS.load_tracks();
        
        if (songs_cached && songs_cached.length) {
            set_tracks(songs_cached);

            const record_cached = await FS.load_songs_folder();

            if(record_cached === null){
                const record = String.divide_songs_in_folder(songs_cached);
                FS.save_songs_folders(record);
                set_folders(record);
            }
            else {
                set_folders(record_cached);
            }
        }
    }

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.page_title}>Your Library!</Text>

                    <Pressable onPress={() => navigation.navigate("HomeStack")}>
                        <Text style={{color: "white"}} >Go back</Text>
                    </Pressable>
                </View>

                <View style={styles.container}>
                    {folders && Object.entries(folders).map(([folder], index) => (
                       <FolderCard
                            navigation={navigation}
                            folder={folder}
                            key={index}
                       />
                    ))}
                </View>
                
                <View style={styles.container}>
                    <Text style={styles.page_title}>All Songs!</Text>

                    {tracks.map((song, i) => (
                        <Card 
                            track={song}
                            navigation={navigation}
                            key={i}
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
})

export default Library;
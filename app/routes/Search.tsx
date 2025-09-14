import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { Track } from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FS from "../utility/FS";
import * as StringUtility from "../utility/String";
import Card from "../components/Card";

function Search() {
    const [ tracks,     set_tracks  ] = useState<Track[]>([]);
    const [ results,    set_results ] = useState<Track[]>([]);
    const [ search,     set_search  ] = useState<string>("");

    const navigation: any = useNavigation();

    useEffect(() => {
        get_cached_songs();
    }, []);


    useEffect(() => {
        if (tracks && search) {
            set_results(StringUtility.search_songs(tracks!, search));
        }
    }, [search]);


    async function get_cached_songs() {
        const songs_cached = await FS.load_tracks();
        
        if (songs_cached && songs_cached.length) {
            set_tracks(songs_cached);
        }
    }

    // Get the position of the song in the global array
    function resolve_index(id: number): number {
        const index: number = tracks.findIndex((song) => song.id === id);
        return index;
    }


    return (
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <TextInput 
                    placeholder='Search from library'
                    placeholderTextColor="white"
                    style={styles.input}
                    onChangeText={(text) => set_search(text)}
                    autoFocus={true}
                />
                <View style={styles.section}>
                    <Text style={styles.results} >Results</Text>

                    <Pressable onPress={() => navigation.navigate("Home")}>
                        <Text style={{color: "white"}} >Go back</Text>
                    </Pressable>
                </View>

                <View>
                    {results?.map((song, i) => (
                        <Card 
                            tracks={tracks}
                            track={song}
                            navigation={navigation}
                            index={resolve_index(song.id)}
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
        minHeight: "100%",
        backgroundColor: "#0f0d19ff",
        padding: 15,
    },

    input: {
        backgroundColor: "#25203fff",
        color: "white",
        paddingLeft: 20,
        marginBottom: 15,
        borderRadius: 50,
    },

    section: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
    },

    results: {
        color: "white",
        fontSize: 30,
    },
})

export default Search;
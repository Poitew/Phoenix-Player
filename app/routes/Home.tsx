import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Platform, PermissionsAndroid, Pressable, TextInput, Button } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAudioFiles, fetchAudioFilesByFolder, Song } from '@gauch_99/react-native-audio-files';
import { Track } from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native';
import * as FS from "../utility/FS";

import Headphones from "../../assets/icons/headphones.svg";
import LibraryIcon from "../../assets/icons/library.svg";
import PlayButton from "../../assets/icons/resume.svg";

function Home() {
    const [tracks, set_tracks] = useState<Track[]>([]);
    const [input_dir, set_input_dir] = useState<string>("/");
    const navigation: any = useNavigation();

    const icon_size_lg = 60;
    const icon_size = 40;


    useEffect(() => {
        request_permissions();
        get_all_tracks();
    }, []);


    async function request_permissions() {
        if (Platform.OS === "android") {
            if (Platform.Version >= 33) {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
            } 
            else {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            }
        }
    }


    async function get_all_tracks() {
        const songs_cached = await FS.load_tracks();

        if (songs_cached) {
            set_tracks(songs_cached);
        }
        else {
            const songs = await fetchAudioFiles();
            const tracks = songs_to_track(songs);
            set_tracks(tracks);
            FS.save_tracks(tracks);
        }
    }


    async function get_tracks_from_dir() {
        const songs = await fetchAudioFilesByFolder(input_dir);

        if (songs) {
            const tracks = songs_to_track(songs);
            set_tracks(tracks);
            FS.save_tracks(tracks);
            redirect_to_library();
        }
    }


    function redirect_to_player(key: number) {
        navigation.navigate("Player", {
            key: key,
            songs: tracks,
        });
    }


    function play_random_song() {
        const key = Math.floor(Math.random() * tracks.length - 1);

        redirect_to_player(key);
    }


    function redirect_to_library() {
        navigation.navigate("Library", {
            songs: tracks,
        })
    }


    function songs_to_track(songs: Song[]) {
        return songs.map((song) => ({
            url: song.audioUrl,
            title: song.title,
            artist: song.artist,
            artwork: song.imageUrl,
        }));
    }
    

    return (
        <SafeAreaView style={styles.main} >
            <ScrollView>
                <View>
                    <TextInput 
                        placeholder='Load from folder'
                        placeholderTextColor="white"
                        style={styles.input}
                        onChangeText={(text) => set_input_dir(text)}
                        onSubmitEditing={get_tracks_from_dir}
                    />
                </View>


                <View style={styles.button_container} >
                    <Pressable onPress={() => navigation.navigate("Player")} style={[styles.button_base, styles.player_button]}>
                        <Headphones width={icon_size} height={icon_size} />
                    </Pressable>

                    <Pressable onPress={redirect_to_library} style={[styles.button_base, styles.library_button]}>
                        <LibraryIcon width={icon_size} height={icon_size} />
                    </Pressable>
                </View>


                <View style={styles.section} >
                    <Text style={styles.section_title}>Unsure?</Text>
                    <Pressable style={styles.random_card} onPress={play_random_song} >
                        <Text style={styles.random_card_title} >Test Your Luck!</Text>
                        <Text>Click here to play a random song from your loaded library!</Text>
                        <PlayButton style={styles.play_button} width={icon_size_lg} height={icon_size_lg} />
                    </Pressable>
                </View>


                <View style={styles.container}>
                    <Text style={styles.section_title}>Latest loaded songs!</Text>
                    {tracks.slice(0, 10).map((song, i) => (
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

    input: {
        backgroundColor: "#25203fff",
        color: "white",
        paddingLeft: 20,
        marginBottom: 15,
        borderRadius: 50,
    },

    button_container: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
    },

    button_base: {
        width: "45%",
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    
    player_button: {
        backgroundColor: "#C7DA54",
    },

    library_button: {
        backgroundColor: "#3ac4ffff",
    },

    section: {
        marginTop: 15,
        gap: 10
    },

    section_title: {
        color: "white",
        fontSize: 30
    },

    random_card: {
        padding: 20,
        backgroundColor: "#ab89f4ff",
        borderRadius: 25,
        gap: 10,
    },

    random_card_title: {
        fontSize: 20,
        fontWeight: "bold"
    },

    play_button: {
        backgroundColor: "#ffffff8d",
        borderRadius: 100,
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
});


export default Home;
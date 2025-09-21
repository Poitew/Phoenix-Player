import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Platform, PermissionsAndroid, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAudioFiles, Song } from '@gauch_99/react-native-audio-files';
import { Track } from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native';
import * as FS from "../utility/FS";

import Headphones from "../../assets/icons/headphones.svg";
import LibraryIcon from "../../assets/icons/library.svg";
import PlayButton from "../../assets/icons/resume.svg";

import Card from '../components/Card';

function Home() {
    const [ tracks, set_tracks ] = useState<Track[]>([]);

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

        if (songs_cached && songs_cached.length) {
            set_tracks(songs_cached);
        }
        else {
            const songs = await fetchAudioFiles();
            const tracks = songs_to_track(songs);
            set_tracks(tracks);
            FS.save_tracks(tracks);
        }
    }


    function play_random_song() {
        const song_index = Math.floor(Math.random() * tracks.length - 1);
        const key = tracks[song_index].id;

        navigation.navigate("Player", {
            key: key,
        });
    }


    function songs_to_track(songs: Song[]) {
        return songs.map((song) => ({
            url: song.audioUrl,
            title: song.title,
            artist: song.artist,
            artwork: song.imageUrl,
            id: song.id,
        }));
    }

    return (
        <SafeAreaView style={styles.main} >
            <ScrollView>
                <View>
                    <TextInput 
                        placeholder='Search from complete library'
                        placeholderTextColor="white"
                        style={styles.input}
                        onFocus={() => navigation.navigate("Search")}
                    />
                </View>


                <View style={styles.button_container} >
                    <Pressable onPress={() => navigation.navigate("Player")} style={[styles.button_base, styles.player_button]}>
                        <Headphones width={icon_size} height={icon_size} />
                        <Text>Player</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Library")} style={[styles.button_base, styles.library_button]}>
                        <LibraryIcon width={icon_size} height={icon_size} />
                        <Text>Library</Text>
                    </Pressable>
                </View>

                <View style={styles.section} >
                    <Text style={styles.section_title}>Unsure?</Text>
                    <Pressable style={styles.random_card} onPress={play_random_song} >
                        <Text style={styles.random_card_title} >Test Your Luck!</Text>
                        <Text>Click here to play a random song from your library!</Text>
                        <PlayButton style={styles.play_button} width={icon_size_lg} height={icon_size_lg} />
                    </Pressable>
                </View>


                <View style={styles.container}>
                    <Text style={styles.section_title}>Latest songs!</Text>
                    {tracks.slice(0, 10).map((song, i) => (
                        <Card
                            navigation={navigation}
                            track={song}
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
});


export default Home;
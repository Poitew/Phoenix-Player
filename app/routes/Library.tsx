import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Platform, PermissionsAndroid, Pressable, TextInput, Button } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAudioFiles, fetchAudioFilesByFolder, Song } from '@gauch_99/react-native-audio-files';
import { useNavigation } from '@react-navigation/native';

function Library() {
    const [songs, set_songs] = useState<Song[]>([]);
    const [input_dir, set_input_dir] = useState<string>("/");
    const navigation: any = useNavigation();

    useEffect(() => {
        request_permissions();
        get_all_songs();
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

    async function get_all_songs() {
        const songs = await fetchAudioFiles();
        set_songs(songs);
    }

    async function get_songs_from_dir() {
        const songs = await fetchAudioFilesByFolder(input_dir);
        set_songs(songs);
    }

    function redirect_to_player(key: number) {
        navigation.navigate("Player", {
            key: key,
            songs: songs,
        });
    }

    return (
        <SafeAreaView style={styles.main} >
            <ScrollView>
                <View>
                    <TextInput 
                        placeholder='Search from folder'
                        placeholderTextColor="white"
                        style={styles.input}
                        onChangeText={(text) => set_input_dir(text)}
                        onSubmitEditing={get_songs_from_dir}
                    />
                </View>

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
                            <Image source={{ uri: song.imageUrl }} style={styles.image} />
                            
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
        color: "white",
        paddingLeft: 20,
        backgroundColor: "#25203fff",
        borderRadius: 50,
    },

    container: {
        marginTop: 50,
        gap: 35,
    },

    card: {
        padding: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },

    hover_card: {
        backgroundColor: "#231e39ff",
    },


    slider: {
        width: "80%",
    },

    image: {
        width: 75,
        height: 75,
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


export default Library;
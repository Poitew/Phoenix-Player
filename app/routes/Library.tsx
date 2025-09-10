import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Platform, PermissionsAndroid, Pressable } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAudioFiles, Song } from '@gauch_99/react-native-audio-files';
import { useNavigation } from '@react-navigation/native';

function Library() {
    const [songs, set_songs] = useState<Song[]>([]);
    const navigation: any = useNavigation();

    useEffect(() => {
        request_permissions();
        get_songs();
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

    async function get_songs() {
        const songs = await fetchAudioFiles();
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
                <View style={styles.container}>
                    {songs.map((song, i) => (
                        <Pressable onPress={() => redirect_to_player(i)} key={i}>
                            <Image source={{ uri: song.imageUrl }} style={styles.image} />
                            <Text style={{ color: "white" }} >{song.title}</Text>
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
    },

    container: {
        gap: 20
    },

    slider: {
        width: "80%",
    },

    image: {
        width: 75,
        height: 75,
        borderRadius: 15
    },
});


export default Library;
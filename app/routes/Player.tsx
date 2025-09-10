import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Song } from '@gauch_99/react-native-audio-files';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';

import secondsToTime from '../utility/SecondsToTime';

function Player({ route }: any) {
    const [songs, set_songs] = useState<Song[]>();

    const [is_playing, set_is_playing] = useState<boolean>(false);
    const { position, duration } = useProgress();

    const yellow = "#C7DA54";

    useEffect(() => {
        add_song();
    }, []);

    async function add_song() {
        const track = {
            url: require("./Bigmouth Strikes Again - 2011 Remaster.mp3"),
            title: "Bigmouth",
            artist: "The Smiths",
        }

        await TrackPlayer.add([track]);
    }

    async function handle_play() {
        if (is_playing) {
            TrackPlayer.stop();
        }
        else {
            TrackPlayer.play();
        }

        set_is_playing(!is_playing);
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.slider_container}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    minimumTrackTintColor={yellow}
                    maximumValue={duration}
                    maximumTrackTintColor="white"
                    thumbTintColor={yellow}
                    value={position}
                    onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
                    step={1}
                />

                <View style={styles.info_slider}>
                    <Text style={styles.text}>{secondsToTime(position)}</Text>
                    <Text style={styles.text}>{secondsToTime(duration)}</Text>
                </View>
            </View>

            <Pressable onPress={handle_play}>
                <Text style={{ color: "white" }} >Play</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        minHeight: "100%",
        backgroundColor: "#0f0d19ff",
        justifyContent: "center",
        alignItems: "center",
    },

    slider_container: {
        width: "80%",
        alignItems: "center",
    },

    slider: {
        width: "100%",
    },

    info_slider: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    text: {
        color: "white",
    }
});

export default Player;
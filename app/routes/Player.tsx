import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { Event, Track, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import seconds_to_time from '../utility/SecondsToTime';


import SkipNext from "../../assets/icons/skip.svg";
import SkipBack from "../../assets/icons/skip-back.svg";
import Resume from "../../assets/icons/resume_white.svg";
import Stop from "../../assets/icons/stop.svg";
import Vinyl from "../../assets/icons/vinyl.svg";


function Player({ route }: any) {
    const [ is_playing,     set_is_playing    ]   = useState<boolean>(true);
    const [ songs,          set_songs         ]   = useState<Track[]>(route.params?.songs);
    const [ current_song,   set_current_song  ]   = useState<Track>();

    const { position, duration } = useProgress();
    const navigation: any = useNavigation()

    const yellow = "#C7DA54";
    const icon_size_lg = 75;
    const icon_size = 50;


    useEffect(() => {
        const listener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async () => {
            const current_track = await TrackPlayer.getActiveTrack();
            set_current_song(current_track);
        });

        return () => listener.remove();
    }, []);
    

    useEffect(() => {
        if (route.params?.songs && typeof route.params.key === "number") {
            add_queue();
        }
    }, [route.params?.key]);


    async function add_queue() {
        await TrackPlayer.reset();
        await TrackPlayer.add(songs);
        await TrackPlayer.skip(route.params.key);
        await TrackPlayer.play();
    }


    async function handle_play() {
        is_playing ? TrackPlayer.pause() : TrackPlayer.play();

        set_is_playing(!is_playing);
    }


    return (
        <SafeAreaView style={styles.main}>
            <Pressable onPress={() => navigation.navigate("Library")} >
                <Text>Go back</Text>
            </Pressable>

            {current_song?.artwork ?
                <Image source={{ uri: current_song.artwork }} style={styles.image} /> :
                <Vinyl width={250} height={250} style={{borderRadius: 100}} />
            }

            <View style={styles.info}>
                <Text style={styles.title}>
                    {current_song?.title || "Title"}
                </Text>

                <Text style={styles.artist}>
                    {current_song?.artist || "Artist"}
                </Text>
            </View>

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
                    <Text style={styles.text}>
                        {seconds_to_time(position)}
                    </Text>

                    <Text style={styles.text}>
                        {seconds_to_time(duration)}
                    </Text>
                </View>
            </View>

            <View style={styles.buttons}>
                <Pressable onPress={async () => await TrackPlayer.skipToPrevious()} >
                    <SkipBack width={icon_size} height={icon_size} />
                </Pressable>

                <Pressable onPress={handle_play}>
                    {is_playing ? 
                        <Stop width={icon_size_lg} height={icon_size_lg} /> :
                        <Resume width={icon_size_lg} height={icon_size_lg} />
                    }
                </Pressable>

                <Pressable onPress={async () => await TrackPlayer.skipToNext()} >
                    <SkipNext width={icon_size} height={icon_size} />
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        minHeight: "100%",
        backgroundColor: "#0f0d19ff",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
    },

    image: {
        width: 250,
        height: 250,
        borderRadius: 1000,
    },

    info: {
        alignItems: "center"
    },

    title: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },

    artist: {
        color: "white",
        fontSize: 15,
        fontWeight: "light",
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
    },

    buttons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 30
    },
});

export default Player;
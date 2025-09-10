import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import TrackPlayer, { Capability } from "react-native-track-player";
import Navigation from "./router/router";

export default function App() {
    useEffect(() => {
        setup_player();
    }, []);

    async function setup_player() {
        await TrackPlayer.setupPlayer();

        TrackPlayer.updateOptions({
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
            ],
        });
    }

    return (
        <>
            <StatusBar style="light" />
            <Navigation />
        </>
    );
}
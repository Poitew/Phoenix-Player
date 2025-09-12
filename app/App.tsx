import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import TrackPlayer, { Capability } from "react-native-track-player";
import Navigation from "./router/router";

export default function App() {
    useEffect(() => {
        setup_navbar();
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

    async function setup_navbar() {
        await NavigationBar.setVisibilityAsync("hidden");
    }

    return (
        <>
            <StatusBar style="light" />
            <Navigation />
        </>
    );
}
import { enableScreens } from "react-native-screens";
enableScreens();

import TrackPlayer from "react-native-track-player";
import { PlaybackService } from "./app/services/PlaybackService";
import { registerRootComponent } from "expo";
import App from "./app/App";

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);

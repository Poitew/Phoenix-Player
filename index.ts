import { enableScreens } from 'react-native-screens';
enableScreens();

import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from './app/services/PlaybackService';
import { registerRootComponent } from 'expo';
import App from './app/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
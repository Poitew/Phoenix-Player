import * as FileSystem from "expo-file-system";
import { Track } from "react-native-track-player";
const SONGS_PATH = FileSystem.documentDirectory + "songs.json";


export async function save_tracks(tracks: Track[]) {
    try {
        await FileSystem.writeAsStringAsync(SONGS_PATH, JSON.stringify(tracks));
    } catch (error) {
        console.error("Error while saving songs:", error);
    }
}


export async function load_tracks(): Promise<Track[] | null> {
    try {
        const file = await FileSystem.readAsStringAsync(SONGS_PATH);
        return JSON.parse(file);
    } catch (error) {
        return null;
    }
}



export async function clear_tracks_cache() {
    try {
        const file_info = await FileSystem.getInfoAsync(SONGS_PATH);

        if (file_info.exists) {
            await FileSystem.deleteAsync(SONGS_PATH, { idempotent: true });
        } 
        else {
            console.log("No cache at: ", SONGS_PATH);
        }
    } catch (error) {
        console.error("Error while clearing songs cache: ", error);
    }
}
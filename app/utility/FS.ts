import * as FileSystem from "expo-file-system";
import { Track } from "react-native-track-player";
const SONGS_PATH = FileSystem.documentDirectory + "songs.json";
const SONG_PATH = FileSystem.documentDirectory + "song.json";
const FOLDERS_PATH = FileSystem.documentDirectory + "songs_folders.json";

/**
 *
 * Save all songs on the device
 * @param tracks - All songs on the device
 */
export async function save_tracks(tracks: Track[]) {
	try {
		await FileSystem.writeAsStringAsync(SONGS_PATH, JSON.stringify(tracks));
	} catch (error) {
		console.error("Error while saving songs:", error);
	}
}

/**
 *
 * @returns - returns all the songs on the device or null
 */
export async function load_tracks(): Promise<Track[] | null> {
	try {
		const file = await FileSystem.readAsStringAsync(SONGS_PATH);
		return JSON.parse(file);
	} catch (error) {
		return null;
	}
}

/**
 * Delete: FileSystem.documentDirectory + "songs.json";
 */
export async function clear_tracks_cache() {
	try {
		const file_info = await FileSystem.getInfoAsync(SONGS_PATH);

		if (file_info.exists) {
			await FileSystem.deleteAsync(SONGS_PATH, { idempotent: true });
		} else {
			console.log("No cache at: ", SONGS_PATH);
		}
	} catch (error) {
		console.error("Error while clearing songs cache: ", error);
	}
}

/**
 *
 * @param track - the the track which is currently playing
 */
export async function save_current_track(track: Track) {
	try {
		await FileSystem.writeAsStringAsync(SONG_PATH, JSON.stringify(track));
	} catch (error) {
		console.error("Error while saving current song:", error);
	}
}

/**
 *
 * @returns Track - the track which is currently playing
 */
export async function load_current_track(): Promise<Track | null> {
	try {
		const file = await FileSystem.readAsStringAsync(SONG_PATH);
		return JSON.parse(file);
	} catch (error) {
		return null;
	}
}

/**
 *
 * @param songs - a Record where the keys are folders name, and their content are songs contained in said folders
 */
export async function save_folders(songs: Record<string, Track[]>) {
	try {
		await FileSystem.writeAsStringAsync(FOLDERS_PATH, JSON.stringify(songs));
	} catch (error) {
		console.error("Error while saving the songs in folder:", error);
	}
}

/**
 *
 * @returns - potentally returns a record consisting of: "folder name" : [track1, track2, ...]
 */
export async function load_folders(): Promise<Record<string, Track[]> | null> {
	try {
		const file = await FileSystem.readAsStringAsync(FOLDERS_PATH);
		return JSON.parse(file) as Record<string, Track[]>;
	} catch (error) {
		return null;
	}
}

/**
 * Delete: FileSystem.documentDirectory + "songs_folders.json";
 */
export async function clear_folders() {
	try {
		const file_info = await FileSystem.getInfoAsync(FOLDERS_PATH);

		if (file_info.exists) {
			await FileSystem.deleteAsync(FOLDERS_PATH, { idempotent: true });
		} else {
			console.log("No cache at: ", FOLDERS_PATH);
		}
	} catch (error) {
		console.error("Error while clearing songs cache: ", error);
	}
}

/**
 *
 * @param key - The name of a folder, used as a key in a record to get all the content of said folder
 * @returns Promise<Track[] | null> - potentally a Promise to an array of Track
 */
export async function load_specific_folder(key: string): Promise<Track[] | null> {
	try {
		const file = await FileSystem.readAsStringAsync(FOLDERS_PATH);
		const folders = await JSON.parse(file);

		return folders[key];
	} catch (error) {
		return null;
	}
}

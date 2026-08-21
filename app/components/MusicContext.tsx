import { createContext, useContext, useState } from "react";
import { TrackPlayer, PlayerQueue, useNowPlaying, TrackItem } from "react-native-nitro-player";
import * as FS from "../utility/FS";

interface IPlayerContextType {
	load_and_play_folder: (folder: string, start_id: string) => Promise<void>;
	current_folder: string;
	current_track: Track | undefined;
	is_playing: boolean;
	queue: Track[];
}

const PlayerContext = createContext<IPlayerContextType | undefined>(undefined);

interface IMusicProviderProps {
	children: React.ReactNode;
}

export function MusicProvider({ children }: IMusicProviderProps) {
	const [queue, set_queue] = useState<Track[]>([]);
	const [current_folder, set_current_folder] = useState<string>("");

	const { currentTrack, currentState } = useNowPlaying();

	const is_playing = currentState === "playing";
	const current_track: Track | undefined = currentTrack
		? ({ ...currentTrack, folder_name: current_folder } as Track)
		: undefined;

	async function load_and_play_folder(folder_name: string, start_id: string) {
		const tracks = await FS.load_specific_folder(folder_name);

		if (tracks && tracks.length > 0) {
			set_queue(tracks);
			set_current_folder(folder_name);

			const playlist_id = await PlayerQueue.createPlaylist(folder_name);

			const track_items: TrackItem[] = tracks.map((track) => ({
				id: track.id,
				url: track.url,
				title: track.title ?? "Unknown title",
				artist: track.artist ?? "Unknown artist",
				album: track.album ?? folder_name,
				duration: track.duration ?? 0,
				artwork: track.artwork ?? null,
				extraPayload: {
					folder_name: track.folder_name ?? "",
				},
			}));

			await PlayerQueue.addTracksToPlaylist(playlist_id, track_items);

			const index = start_id ? tracks.findIndex((t) => t.id === start_id) : 0;
			const start_track = track_items[index >= 0 ? index : 0];
			await TrackPlayer.playSong(start_track.id, playlist_id);
		}
	}

	return (
		<PlayerContext
			value={{
				load_and_play_folder,
				current_folder,
				current_track,
				is_playing,
				queue,
			}}
		>
			{children}
		</PlayerContext>
	);
}

export const useMusic = () => {
	const context = useContext(PlayerContext);
	if (!context) {
		throw new Error("useMusic context not available");
	}
	return context;
};

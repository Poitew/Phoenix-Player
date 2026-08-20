import { createContext, useContext, useState } from "react";
import TrackPlayer from "@rntp/player";
import * as FS from "../utility/FS";

interface IPlayerContextType {
	load_and_play_folder: (folder: string, start_id: string) => Promise<void>;
	current_folder: string;
	current_track: Track | undefined;
	set_current_track: React.Dispatch<React.SetStateAction<Track | undefined>>;
	queue: Track[];
	is_playing: boolean;
	set_is_playing: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerContext = createContext<IPlayerContextType | undefined>(undefined);

interface IMusicProviderProps {
	children: React.ReactNode;
}

export function MusicProvider({ children }: IMusicProviderProps) {
	const [queue, set_queue] = useState<Track[]>([]);
	const [current_folder, set_current_folder] = useState<string>("");
	const [is_playing, set_is_playing] = useState<boolean>(false);
	const [current_track, set_current_track] = useState<Track | undefined>();

	async function load_and_play_folder(folder_name: string, start_id: string) {
		const songs = await FS.load_specific_folder(folder_name);

		if (songs && songs.length > 0) {
			set_queue(songs);
			set_current_folder(folder_name);

			const index = start_id ? songs.findIndex((s) => s.id === start_id) : 0;
			TrackPlayer.setMediaItems(
				// Convert songs from Track[] to MediaItem[]
				songs.map(({ id, artwork, ...song }) => ({ ...song, mediaId: id, artworkUrl: artwork })),
				index >= 0 ? index : 0,
			);

			set_is_playing(true);
			TrackPlayer.play();
		}
	}

	return (
		<PlayerContext
			value={{
				load_and_play_folder,
				current_folder,
				current_track,
				set_current_track,
				queue,
				is_playing,
				set_is_playing,
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

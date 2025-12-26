import { Track } from "react-native-track-player";

function normalize(str: string) {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "");
}

export function search_songs(songs: Track[], query: string) {
	const q = normalize(query);
	const results = songs.filter((song) => normalize(song.title!).includes(q));
	return results;
}

export function divide_songs_in_folder(songs: Track[]): Record<string, Track[]> {
	return songs.reduce<Record<string, Track[]>>((acc, song) => {
		const match = song.url.match(/\/([^/]+)\/[^/]+\.mp3$/);
		const folder = match ? match[1] : "unknown";

		if (!acc[folder]) {
			acc[folder] = [];
		}

		acc[folder].push(song);
		return acc;
	}, {});
}

export function truncate_string(str: string, n: number) {
	if (str.length > n && str.length != n + 1) return str.slice(0, n) + "...";
	else return str;
}

import { Track } from "react-native-track-player";

function normalize(str: string) {
    return str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function search_songs(songs: Track[], query: string) {
    const q = normalize(query);
    const results = songs.filter(song => normalize(song.title!).includes(q));
    return results;
}

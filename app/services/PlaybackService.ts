import TrackPlayer, { Event } from "@rntp/player";

export const PlaybackService = async function () {
	TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
	TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
	TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
	TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
};

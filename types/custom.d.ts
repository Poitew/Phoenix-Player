declare module "*.svg" {
	const value: any;
	export default value;
}

interface Track {
	url: string;
	id: string;
	title: string;
	album: string;
	duration: number;
	artist: string;
	artwork: string;
	folder_name?: string;
}

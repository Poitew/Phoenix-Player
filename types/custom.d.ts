declare module "*.svg" {
	const value: any;
	export default value;
}

interface Track {
	url: string;
	id: string;
	title?: string;
	artist?: string;
	artwork?: string;
	folder_name?: string;
}

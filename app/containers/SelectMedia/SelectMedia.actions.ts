export type Media = {
	title?: string;
	path?: string;
};

export const SET_MEDIA = 'SET_MEDIA';

export default function setMedia(media: Media) {
	return {
		type: SET_MEDIA,
		media,
	};
}

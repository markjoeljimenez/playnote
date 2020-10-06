export const SET_MEDIA = 'SET_MEDIA';

export default function setMedia(media: string) {
	return {
		type: SET_MEDIA,
		media,
	};
}

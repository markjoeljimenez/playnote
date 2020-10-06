export const SET_MEDIA = 'SET_MEDIA';

export default function setMedia(media) {
	return {
		type: SET_MEDIA,
		media,
	};
}

import { SET_MEDIA } from './SelectMedia.actions';

type State = {
	type: string;
	media: string;
};

const DEFAULT_STATE = 'C:\\Users\\Mark Jimenez\\Downloads\\1.mp4';

const SelectMedia = (state = DEFAULT_STATE, { type, media }: State) => {
	switch (type) {
		case SET_MEDIA:
			return media;

		default:
			return state;
	}
};

export default SelectMedia;

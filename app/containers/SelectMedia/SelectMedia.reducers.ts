import { Media } from './SelectMedia';
import { SET_MEDIA } from './SelectMedia.actions';

type State = {
	type: string;
	media: Media;
};

// const DEFAULT_STATE = 'C:\\Users\\Mark Jimenez\\Downloads\\1.mp4';
const DEFAULT_STATE: Media | null = null;

const SelectMediaReducers = (state = DEFAULT_STATE, { type, media }: State) => {
	switch (type) {
		case SET_MEDIA:
			return media;

		default:
			return state;
	}
};

export default SelectMediaReducers;

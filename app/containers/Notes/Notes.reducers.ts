import { Message } from './Notes';
import { SET_MESSAGES, SORT_MESSAGES } from './Notes.actions';

type State = {
	type: string;
	messages: Message[];
	sort: boolean;
};

const DEFAULT_STATE: Message[] = [];

const NotesReducers = (
	state = DEFAULT_STATE,
	{ type, messages, sort }: State
) => {
	switch (type) {
		case SET_MESSAGES:
			return messages;

		case SORT_MESSAGES:
			return [...state].sort((a, b) =>
				sort ? a.timeStamp - b.timeStamp : b.timeStamp - a.timeStamp
			);

		default:
			return state;
	}
};

export default NotesReducers;

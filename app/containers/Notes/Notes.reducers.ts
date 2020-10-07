import { Message } from './Notes';
import { SET_MESSAGES } from './Notes.actions';

type State = {
	type: string;
	messages: Message[];
};

const DEFAULT_STATE: Message[] = [];

const NotesReducers = (state = DEFAULT_STATE, { type, messages }: State) => {
	switch (type) {
		case SET_MESSAGES:
			return messages;

		default:
			return state;
	}
};

export default NotesReducers;

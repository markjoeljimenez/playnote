import { Message } from './Notes';
import {
	DELETE_MESSAGE,
	EDIT_MESSAGE,
	SET_MESSAGES,
	SORT_MESSAGES,
} from './Notes.actions';

type State = {
	type: string;
	messages: Message[];
	index: number;
	sort: boolean;
	text?: string;
};

const DEFAULT_STATE: Message[] = [];

const NotesReducers = (
	state = DEFAULT_STATE,
	{ type, messages, index, sort, text }: State
) => {
	switch (type) {
		case SET_MESSAGES:
			return messages;

		case SORT_MESSAGES:
			return [...state].sort((a, b) =>
				sort ? a.timeStamp - b.timeStamp : b.timeStamp - a.timeStamp
			);

		case EDIT_MESSAGE: {
			const arr = [...state];

			if (text) {
				arr.splice(index, 1, {
					...arr[index],
					message: text,
				});
			} else {
				arr.splice(index, 1);
			}

			return arr;
		}

		case DELETE_MESSAGE: {
			const arr = [...state];

			arr.splice(index, 1);

			return arr;
		}

		default:
			return state;
	}
};

export default NotesReducers;

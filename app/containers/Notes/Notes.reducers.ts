import { Message } from './Notes';
import {
	DELETE_MESSAGE,
	EDIT_MESSAGE,
	SAVE_MESSAGES,
	SET_MESSAGES,
} from './Notes.actions';

type State = {
	type: string;
	messages: Message[];
	index: number;
	text?: string;
	saved?: boolean;
};

const DEFAULT_STATE: {
	messages: Message[];
	saved?: boolean;
} = {
	messages: [],
	saved: undefined,
};

const NotesReducers = (
	state = DEFAULT_STATE,
	{ type, messages, index, text, saved }: State
) => {
	switch (type) {
		case SET_MESSAGES:
			return {
				...state,
				messages,
				saved,
			};

		case EDIT_MESSAGE: {
			const arr = [...state.messages];

			if (text) {
				arr.splice(index, 1, {
					...arr[index],
					message: text,
				});
			} else {
				arr.splice(index, 1);
			}

			return {
				...state,
				messages: arr,
				saved: false,
			};
		}

		case DELETE_MESSAGE: {
			const arr = [...state.messages];

			arr.splice(index, 1);

			return {
				...state,
				messages: arr,
				saved: false,
			};
		}

		case SAVE_MESSAGES:
			return {
				...state,
				saved,
			};

		default:
			return state;
	}
};

export default NotesReducers;

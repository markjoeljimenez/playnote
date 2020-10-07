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
	saved?: boolean;
};

// const DEFAULT_STATE: Message[] = [];
const DEFAULT_STATE: {
	messages: Message[];
	saved: boolean;
} = {
	messages: [],
	saved: true,
};

const NotesReducers = (
	state = DEFAULT_STATE,
	{ type, messages, index, sort, text, saved }: State
) => {
	switch (type) {
		case SET_MESSAGES:
			console.log(messages, saved);
			return {
				...state,
				messages,
				saved: saved ?? false,
			};

		// case SORT_MESSAGES:
		// 	return {
		// 		...state,
		// 		messsages: [...state.messages].sort((a, b) =>
		// 			sort ? a.timeStamp - b.timeStamp : b.timeStamp - a.timeStamp
		// 		),
		// 	};

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

		default:
			return state;
	}
};

export default NotesReducers;

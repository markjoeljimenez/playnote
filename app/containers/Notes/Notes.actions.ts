export const SET_MESSAGES = 'SET_MESSAGES';
export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const SORT_MESSAGES = 'SORT_MESSAGES';

export type Message = {
	timeStamp: number;
	message: string;
};

export function setMessagesAction(messages: Message[]) {
	return {
		type: SET_MESSAGES,
		messages,
	};
}

export function editMessageAction(index: number, text?: string) {
	return {
		type: EDIT_MESSAGE,
		index,
		text,
	};
}
export function deleteMessageAction(index: number) {
	return {
		type: DELETE_MESSAGE,
		index,
	};
}

export function sortMessagesAction(sort: boolean) {
	return {
		type: SORT_MESSAGES,
		sort,
	};
}

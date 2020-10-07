export const SET_MESSAGES = 'SET_MESSAGES';
export const SORT_MESSAGES = 'SORT_MESSAGES';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';

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

export function sortMessagesAction(sort: boolean) {
	return {
		type: SORT_MESSAGES,
		sort,
	};
}

export function deleteMessageAction(index: number) {
	return {
		type: DELETE_MESSAGE,
		index,
	};
}

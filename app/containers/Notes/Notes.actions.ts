export const SET_MESSAGES = 'SET_MESSAGES';
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

export function sortMessagesAction(sort: boolean) {
	return {
		type: SORT_MESSAGES,
		sort,
	};
}

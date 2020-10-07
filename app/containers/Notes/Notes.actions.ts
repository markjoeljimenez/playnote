export const SET_MESSAGES = 'SET_MESSAGES';

export type Message = {
	timeStamp: number;
	message: string;
};

export default function setMessages(messages: Message[]) {
	return {
		type: SET_MESSAGES,
		messages,
	};
}
